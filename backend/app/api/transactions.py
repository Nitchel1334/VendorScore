from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.all_models import Transaction, Vendor
from app.schemas.all_schemas import TransactionCreate, TransactionResponse
from app.api.deps import get_current_vendor

router = APIRouter()

@router.post("/", response_model=TransactionResponse)
def create_transaction(
    req: TransactionCreate, 
    db: Session = Depends(get_db),
    current_vendor: Vendor = Depends(get_current_vendor)
):
    new_tx = Transaction(
        vendor_id=current_vendor.id,
        type=req.type,
        amount=req.amount,
        transaction_date=req.transaction_date,
        payment_mode=req.payment_mode,
        category=req.category,
        customer_name=req.customer_name,
        notes=req.notes,
        product_id=req.product_id,
        quantity=req.quantity
    )
    db.add(new_tx)
    db.commit()
    db.refresh(new_tx)
    return new_tx

@router.get("/", response_model=List[TransactionResponse])
def get_transactions(
    db: Session = Depends(get_db),
    current_vendor: Vendor = Depends(get_current_vendor)
):
    return db.query(Transaction).filter(Transaction.vendor_id == current_vendor.id).order_by(Transaction.transaction_date.desc()).all()
