from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class Test(Base):
    __tablename__ = "tests"
    
    id = Column(Integer, primary_key=True, index=True)
    prospect_id = Column(Integer, ForeignKey("prospects.id"), nullable=False)
    test_type = Column(String(100), nullable=False)
    score = Column(Float)
    max_score = Column(Float, default=100)
    passed = Column(String(10))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    prospect = relationship("Prospect", back_populates="tests") 