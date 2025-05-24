from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class Interaction(Base):
    __tablename__ = "interactions"
    
    id = Column(Integer, primary_key=True, index=True)
    prospect_id = Column(Integer, ForeignKey("prospects.id"), nullable=False)
    type = Column(String(50), nullable=False)  # llamada, email, whatsapp, visita
    channel = Column(String(50))  # web, telefono, presencial
    description = Column(Text)
    outcome = Column(String(100))  # interesado, no_interesado, pendiente
    next_action = Column(String(255))
    next_action_date = Column(DateTime)
    created_by = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    prospect = relationship("Prospect", back_populates="interactions")
    
    def to_dict(self):
        return {
            "id": self.id,
            "type": self.type,
            "channel": self.channel,
            "description": self.description,
            "outcome": self.outcome,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "created_by": self.created_by
        } 