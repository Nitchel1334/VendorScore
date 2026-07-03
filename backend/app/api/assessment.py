from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.all_models import CreditScore, LoanEligibility, Vendor, Transaction
from app.api.deps import get_current_vendor
from app.schemas.all_schemas import CreditScoreResponse, LoanEligibilityResponse
from datetime import date
import random

router = APIRouter()

@router.post("/score", response_model=CreditScoreResponse)
def calculate_score(
    db: Session = Depends(get_db),
    current_vendor: Vendor = Depends(get_current_vendor)
):
    transactions = db.query(Transaction).filter(Transaction.vendor_id == current_vendor.id).order_by(Transaction.transaction_date).all()
    
    if not transactions:
        cs = CreditScore(vendor_id=current_vendor.id, score=300, stability_score=0, frequency_score=0, growth_score=0, risk_score=100)
        db.add(cs)
        db.commit()
        db.refresh(cs)
        return cs

    total_revenue = sum(t.amount for t in transactions if t.type.value == "Sale")
    total_expenses = sum(t.amount for t in transactions if t.type.value == "Expense")
    total_purchases = sum(t.amount for t in transactions if t.type.value == "Purchase")
    total_tx = len(transactions)
    
    dates = [t.transaction_date for t in transactions]
    unique_days = len(set(dates))
    total_days = (max(dates) - min(dates)).days + 1
    if total_days == 0: total_days = 1
    
    consistency = min((unique_days / total_days) * 100, 100)
    frequency = min((total_tx / (total_days * 5)) * 100, 100) # baseline 5 tx/day
    revenue_score = min((float(total_revenue) / 50000) * 100, 100) # baseline 50k
    
    stability = 100
    if total_revenue > 0:
        expense_ratio = float(total_expenses) / float(total_revenue)
        purchase_ratio = float(total_purchases) / float(total_revenue)
        
        # Operational expenses reduce stability directly (1x penalty)
        # Inventory purchases are business investments (0.2x penalty)
        weighted_expense_impact = (expense_ratio * 100) + (purchase_ratio * 20)
        
        stability = max(100 - weighted_expense_impact, 0)
    else:
        stability = 0
        
    # Weights: Revenue Stability = 40%, Transaction Frequency = 30%, Monthly Revenue = 20%, Business Consistency = 10%
    weighted_pts = (stability * 0.40) + (frequency * 0.30) + (revenue_score * 0.20) + (consistency * 0.10)
    
    # Scale from 300 to 850
    final_score = int(300 + (weighted_pts * 5.5))
    final_score = min(max(final_score, 300), 850)
    
    cs = CreditScore(
        vendor_id=current_vendor.id,
        score=final_score,
        stability_score=int(stability),
        frequency_score=int(frequency),
        growth_score=int(revenue_score),
        risk_score=int(100 - consistency)
    )
    db.add(cs)
    db.commit()
    db.refresh(cs)
    return cs

@router.get("/score", response_model=CreditScoreResponse)
def get_score(
    db: Session = Depends(get_db),
    current_vendor: Vendor = Depends(get_current_vendor)
):
    # Always recalculate for MVP demo purposes to show dynamic changes instantly
    return calculate_score(db, current_vendor)

@router.get("/loan-eligibility", response_model=LoanEligibilityResponse)
def get_loan_eligibility(
    db: Session = Depends(get_db),
    current_vendor: Vendor = Depends(get_current_vendor)
):
    score_obj = calculate_score(db, current_vendor)
    
    transactions = db.query(Transaction).filter(Transaction.vendor_id == current_vendor.id).all()
    total_revenue = sum(t.amount for t in transactions if t.type.value == "Sale")
    
    max_loan = 0
    prob = 0
    if score_obj.score > 600:
        max_loan = float(total_revenue) * 2.5 # 2.5x revenue
        prob = min(int((score_obj.score / 850) * 100), 98)
    elif score_obj.score > 400:
        max_loan = float(total_revenue) * 1.0
        prob = 50
    else:
        max_loan = 0
        prob = 10
        
    eligibility = LoanEligibility(
        vendor_id=current_vendor.id,
        max_eligible_amount=max_loan,
        approval_probability=prob,
        kyc_completion_pct=100 if current_vendor.aadhaar_hash and current_vendor.pan_hash else 50
    )
    db.add(eligibility)
    db.commit()
    db.refresh(eligibility)
    return eligibility
