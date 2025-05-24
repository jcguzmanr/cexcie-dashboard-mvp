from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from .database import Base

class Device(Base):
    __tablename__ = "devices"
    
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String(50), nullable=False)  # desktop, mobile, tablet
    browser = Column(String(100))
    os = Column(String(100))
    user_agent = Column(String(500))
    created_at = Column(DateTime, default=datetime.utcnow) 