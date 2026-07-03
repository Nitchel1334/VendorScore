from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import date, datetime
from app.models.all_models import PaymentMode, TransactionType, VendorStatus, InsightType

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    phone: Optional[str] = None

class LoginRequest(BaseModel):
    phone: str = Field(..., pattern=r"^\d{10}$")

class AdminLoginRequest(BaseModel):
    phone: str = Field(..., pattern=r"^\d{10}$")
    password: str

class VendorCreate(BaseModel):
    phone: str = Field(..., pattern=r"^\d{10}$")
    vendor_name: str
    business_name: str
    category: Optional[str] = "Other"

class VendorResponse(BaseModel):
    id: int
    vendor_name: str
    business_name: str
    category: str
    address: str
    phone: str
    status: VendorStatus
    preferred_language: str

    class Config:
        from_attributes = True

class ProductCreate(BaseModel):
    name: str
    price: float
    category: str
    icon: Optional[str] = None

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    icon: Optional[str] = None

class ProductResponse(BaseModel):
    id: int
    name: str
    price: float
    category: str
    icon: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class TransactionCreate(BaseModel):
    type: TransactionType
    amount: float
    transaction_date: date
    payment_mode: PaymentMode
    category: str
    customer_name: Optional[str] = None
    notes: Optional[str] = None
    product_id: Optional[int] = None
    quantity: Optional[float] = 1.0

class TransactionUpdate(BaseModel):
    type: Optional[TransactionType] = None
    amount: Optional[float] = None
    transaction_date: Optional[date] = None
    payment_mode: Optional[PaymentMode] = None
    category: Optional[str] = None
    customer_name: Optional[str] = None
    notes: Optional[str] = None
    quantity: Optional[float] = None

class TransactionResponse(BaseModel):
    id: int
    type: TransactionType
    amount: float
    transaction_date: date
    payment_mode: PaymentMode
    category: str
    customer_name: Optional[str]
    notes: Optional[str]
    product_id: Optional[int]
    quantity: Optional[float]
    created_at: datetime

    class Config:
        from_attributes = True

class CreditScoreResponse(BaseModel):
    score: int
    stability_score: int
    frequency_score: int
    growth_score: int
    risk_score: int
    calculated_at: datetime

    class Config:
        from_attributes = True

class LoanEligibilityResponse(BaseModel):
    max_eligible_amount: float
    approval_probability: int
    kyc_completion_pct: int
    assessed_at: datetime

    class Config:
        from_attributes = True

class VendorInsightResponse(BaseModel):
    id: int
    type: InsightType
    title: str
    body: str
    created_at: datetime

    class Config:
        from_attributes = True

# Admin schemas
class AdminVendorSummary(BaseModel):
    id: int
    vendor_name: str
    business_name: str
    phone: str
    category: str
    status: VendorStatus
    created_at: datetime
    transaction_count: int
    total_revenue: float
    credit_score: Optional[int]

class AdminDashboardStats(BaseModel):
    total_vendors: int
    active_vendors: int
    total_transactions: int
    average_credit_score: float
    total_platform_revenue: float
