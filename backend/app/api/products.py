from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.all_models import Product, Vendor
from app.schemas.all_schemas import ProductCreate, ProductResponse
from app.api.deps import get_current_vendor

router = APIRouter()

BUSINESS_TEMPLATES = {
    "Vegetable Vendor": [
        {"name": "Tomato", "price": 40.0, "category": "Vegetables", "icon": "🍅"},
        {"name": "Onion", "price": 30.0, "category": "Vegetables", "icon": "🧅"},
        {"name": "Potato", "price": 25.0, "category": "Vegetables", "icon": "🥔"}
    ],
    "Fruit Vendor": [
        {"name": "Apple", "price": 120.0, "category": "Fruits", "icon": "🍎"},
        {"name": "Banana", "price": 50.0, "category": "Fruits", "icon": "🍌"},
        {"name": "Orange", "price": 60.0, "category": "Fruits", "icon": "🍊"}
    ],
    "Tea Stall": [
        {"name": "Tea", "price": 10.0, "category": "Beverages", "icon": "☕"},
        {"name": "Coffee", "price": 20.0, "category": "Beverages", "icon": "🍵"},
        {"name": "Biscuit", "price": 5.0, "category": "Snacks", "icon": "🍪"}
    ],
    "General Store": [
        {"name": "Rice", "price": 60.0, "category": "Groceries", "icon": "🍚"},
        {"name": "Sugar", "price": 45.0, "category": "Groceries", "icon": "🍬"},
        {"name": "Oil", "price": 150.0, "category": "Groceries", "icon": "🛢️"},
        {"name": "Milk", "price": 30.0, "category": "Dairy", "icon": "🥛"}
    ],
    "Pharmacy": [
        {"name": "Paracetamol", "price": 20.0, "category": "Medicine", "icon": "💊"},
        {"name": "Cough Syrup", "price": 80.0, "category": "Medicine", "icon": "🧪"},
        {"name": "Band-Aid", "price": 5.0, "category": "First Aid", "icon": "🩹"}
    ]
}

@router.get("/", response_model=List[ProductResponse])
def get_products(db: Session = Depends(get_db), current_vendor: Vendor = Depends(get_current_vendor)):
    return db.query(Product).filter(Product.vendor_id == current_vendor.id).all()

@router.post("/", response_model=ProductResponse)
def create_product(product: ProductCreate, db: Session = Depends(get_db), current_vendor: Vendor = Depends(get_current_vendor)):
    db_product = Product(
        vendor_id=current_vendor.id,
        name=product.name,
        price=product.price,
        category=product.category,
        icon=product.icon
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.post("/template/{template_name}")
def apply_template(template_name: str, db: Session = Depends(get_db), current_vendor: Vendor = Depends(get_current_vendor)):
    if template_name not in BUSINESS_TEMPLATES:
        raise HTTPException(status_code=404, detail="Template not found")
        
    template_items = BUSINESS_TEMPLATES[template_name]
    added_products = []
    for item in template_items:
        db_product = Product(
            vendor_id=current_vendor.id,
            name=item["name"],
            price=item["price"],
            category=item["category"],
            icon=item["icon"]
        )
        db.add(db_product)
        added_products.append(db_product)
        
    db.commit()
    return {"status": "success", "message": f"{len(added_products)} products added"}
