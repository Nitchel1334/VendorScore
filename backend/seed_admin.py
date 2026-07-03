from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine, Base
from app.models.all_models import Admin, AdminRole
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def seed():
    db = SessionLocal()
    existing_admin = db.query(Admin).filter(Admin.email == "admin@vendordash.com").first()
    if not existing_admin:
        hashed_pw = pwd_context.hash("admin123")
        admin = Admin(
            email="admin@vendordash.com",
            password_hash=hashed_pw,
            role=AdminRole.ADMIN
        )
        db.add(admin)
        db.commit()
        print("Admin user created: admin@vendordash.com / admin123")
    else:
        print("Admin user already exists.")
    db.close()

if __name__ == "__main__":
    seed()
