from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class Prospect(Base):
    __tablename__ = "prospects"
    
    id = Column(Integer, primary_key=True, index=True)
    dni = Column(String(8), unique=True, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True)
    phone = Column(String(20))
    city = Column(String(100))
    address = Column(Text)
    birth_date = Column(DateTime)
    gender = Column(String(20))
    education_level = Column(String(100))
    current_institution = Column(String(255))
    career_interest = Column(String(255))
    status = Column(String(50), default="nuevo")
    origin = Column(String(100))
    campaign = Column(String(100))
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    interactions = relationship("Interaction", back_populates="prospect", cascade="all, delete-orphan")
    tests = relationship("Test", back_populates="prospect", cascade="all, delete-orphan")
    advisories = relationship("Advisory", back_populates="prospect", cascade="all, delete-orphan")
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    def to_dict(self):
        return {
            "id": self.id,
            "dni": self.dni,
            "full_name": self.full_name,
            "email": self.email,
            "phone": self.phone,
            "city": self.city,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None
        } 