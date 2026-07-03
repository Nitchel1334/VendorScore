from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional
import jwt
from passlib.context import CryptContext
from app.core.database import get_db
from app.core.config import settings
from app.models.all_models import Vendor, Admin
from app.schemas.all_schemas import LoginRequest, VendorCreate, Token, VendorResponse, AdminLoginRequest
from app.api.deps import get_current_vendor

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    """Vendor login using mobile number only — low-friction MVP onboarding."""
    vendor = db.query(Vendor).filter(Vendor.phone == req.phone).first()
    if not vendor:
        # Phone not found — redirect to registration
        return {"status": "success", "registered": False}

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": vendor.phone, "role": "vendor"},
        expires_delta=access_token_expires
    )
    return {
        "status": "success",
        "token": access_token,
        "registered": True,
        "vendor": {"id": vendor.id, "name": vendor.vendor_name}
    }

@router.post("/register")
def register(req: VendorCreate, db: Session = Depends(get_db)):
    """Vendor registration — no PIN required for MVP."""
    existing = db.query(Vendor).filter(Vendor.phone == req.phone).first()
    if existing:
        raise HTTPException(status_code=400, detail="Phone already registered")

    new_vendor = Vendor(
        phone=req.phone,
        vendor_name=req.vendor_name,
        business_name=req.business_name,
        category=req.category,
        address="Not provided",
        aadhaar_hash=None,
        pan_hash=None,
    )
    db.add(new_vendor)
    db.commit()
    db.refresh(new_vendor)

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": new_vendor.phone, "role": "vendor"},
        expires_delta=access_token_expires
    )
    return {
        "status": "success",
        "token": access_token,
        "vendor": {"id": new_vendor.id, "name": new_vendor.vendor_name}
    }

@router.post("/admin/login")
def admin_login(req: AdminLoginRequest, db: Session = Depends(get_db)):
    """Admin login using mobile number + password/PIN."""
    # MVP Requirement: Accept any phone number as long as the PIN is '123456'
    if req.password != "123456":
        raise HTTPException(status_code=401, detail="Invalid admin PIN")

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": req.phone, "role": "admin"},
        expires_delta=access_token_expires
    )
    return {
        "status": "success",
        "token": access_token,
        "role": "Admin"
    }

@router.get("/me", response_model=VendorResponse)
def get_me(current_vendor: Vendor = Depends(get_current_vendor)):
    return current_vendor

from app.api.deps import get_current_admin
from app.api.assessment import calculate_score

@router.get("/admin/vendors")
def get_all_vendors(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    vendors = db.query(Vendor).all()
    result = []
    for v in vendors:
        # Calculate basic score details to show in admin dashboard
        score_obj = calculate_score(db, v)
        result.append({
            "id": v.id,
            "name": v.vendor_name,
            "business": v.business_name,
            "phone": v.phone,
            "category": v.category,
            "score": score_obj.score,
            "eligible": score_obj.score > 600,
            "status": v.status.value
        })
    return result

from sqlalchemy import func
from app.models.all_models import Transaction, CreditScore

@router.get("/admin/stats")
def get_admin_stats(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    total_vendors = db.query(Vendor).count()
    active_vendors = db.query(Vendor).filter(Vendor.status == "active").count()
    
    total_transactions = db.query(Transaction).count()
    total_revenue = db.query(func.sum(Transaction.amount)).filter(Transaction.type == "Sale").scalar() or 0.0
    
    avg_score = db.query(func.avg(CreditScore.score)).scalar() or 0.0
    
    # Calculate eligible vendors manually for now
    vendors = db.query(Vendor).all()
    eligible_count = 0
    for v in vendors:
        score = calculate_score(db, v)
        if score.score > 600:
            eligible_count += 1
            
    return {
        "total_vendors": total_vendors,
        "active_vendors": active_vendors,
        "total_transactions": total_transactions,
        "average_credit_score": round(avg_score),
        "total_platform_revenue": total_revenue,
        "total_loan_eligible": eligible_count
    }

from app.models.all_models import Product, VendorInsight
from app.api.assessment import get_loan_eligibility

@router.get("/admin/vendors/{vendor_id}/details")
def get_vendor_details(
    vendor_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
        
    transactions = db.query(Transaction).filter(Transaction.vendor_id == vendor_id).order_by(Transaction.transaction_date.desc()).limit(20).all()
    products = db.query(Product).filter(Product.vendor_id == vendor_id).all()
    insights = db.query(VendorInsight).filter(VendorInsight.vendor_id == vendor_id).all()
    score = calculate_score(db, vendor)
    loan = get_loan_eligibility(db, vendor)
    
    return {
        "profile": {
            "id": vendor.id,
            "name": vendor.vendor_name,
            "business": vendor.business_name,
            "phone": vendor.phone,
            "category": vendor.category,
            "address": vendor.address,
            "status": vendor.status.value,
            "joined": vendor.created_at
        },
        "products": products,
        "transactions": transactions,
        "credit_score": score,
        "loan_eligibility": loan,
        "insights": insights
    }
