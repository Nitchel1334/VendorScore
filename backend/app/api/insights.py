from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_vendor
from app.models.all_models import VendorInsight, Vendor, Transaction, Product, InsightType
from app.schemas.all_schemas import VendorInsightResponse
from collections import defaultdict
from datetime import datetime

router = APIRouter()

@router.get("/", response_model=List[VendorInsightResponse])
def list_insights(
    db: Session = Depends(get_db),
    current_vendor: Vendor = Depends(get_current_vendor),
):
    """Return vendor-specific dynamic insights based on transactions."""
    transactions = db.query(Transaction).filter(Transaction.vendor_id == current_vendor.id).all()
    
    if not transactions:
        return []
        
    insights = []
    
    # 1. Most Sold Product
    product_sales = defaultdict(int)
    for t in transactions:
        if t.type.value == "Sale" and t.product_id:
            product_sales[t.product_id] += float(t.quantity or 1)
            
    if product_sales:
        top_product_id = max(product_sales, key=product_sales.get)
        top_product = db.query(Product).filter(Product.id == top_product_id).first()
        if top_product:
            insights.append(VendorInsightResponse(
                id=1,
                type=InsightType.INSIGHT,
                title="Top Performing Product",
                body=f"{top_product.icon or ''} {top_product.name} is your best seller with {int(product_sales[top_product_id])} units sold.",
                created_at=datetime.now()
            ))

    # 2. Best Sales Day
    day_sales = defaultdict(float)
    for t in transactions:
        if t.type.value == "Sale":
            day_name = t.transaction_date.strftime("%A")
            day_sales[day_name] += float(t.amount)
            
    if day_sales:
        best_day = max(day_sales, key=day_sales.get)
        insights.append(VendorInsightResponse(
            id=2,
            type=InsightType.OPPORTUNITY,
            title=f"Peak Sales on {best_day}s",
            body=f"{best_day} is your most profitable day. Stocking up early could prevent stockouts.",
            created_at=datetime.now()
        ))
        
    # 3. Digital Payments Tip
    digital_tx = sum(1 for t in transactions if t.payment_mode.value in ["UPI", "Card", "Bank Transfer"])
    if len(transactions) > 0:
        digital_pct = (digital_tx / len(transactions)) * 100
        if digital_pct < 60:
            insights.append(VendorInsightResponse(
                id=3,
                type=InsightType.TIP,
                title="Switch to Digital Payments",
                body=f"You're at {int(digital_pct)}% digital transactions. High digital volume boosts your credit score.",
                created_at=datetime.now()
            ))
            
    # 4. Expense Alert
    total_sales = sum(t.amount for t in transactions if t.type.value == "Sale")
    total_exp = sum(t.amount for t in transactions if t.type.value == "Expense")
    if total_sales > 0 and (total_exp / total_sales) > 0.4:
        insights.append(VendorInsightResponse(
            id=4,
            type=InsightType.ALERT,
            title="High Expenses Detected",
            body=f"Your expenses are {int((total_exp/total_sales)*100)}% of your sales. Review to maintain healthy margins.",
            created_at=datetime.now()
        ))

    return insights
