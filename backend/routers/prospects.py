from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from models import get_db, Prospect
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class ProspectResponse(BaseModel):
    id: int
    dni: str
    full_name: str
    email: str
    phone: Optional[str]
    city: Optional[str]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

@router.get("/", response_model=dict)
async def get_prospects(
    page: int = Query(1, ge=1),
    limit: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    city: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Obtener lista paginada de prospectos con filtros
    """
    # TODO: Implementar filtros y paginación
    prospects = db.query(Prospect).limit(10).all()
    
    return {
        "data": [prospect.to_dict() for prospect in prospects],
        "pagination": {
            "page": page,
            "limit": limit,
            "total": len(prospects),
            "pages": 1
        }
    }

@router.get("/{prospect_id}")
async def get_prospect(prospect_id: int, db: Session = Depends(get_db)):
    """
    Obtener detalle de un prospecto
    """
    prospect = db.query(Prospect).filter(Prospect.id == prospect_id).first()
    if not prospect:
        raise HTTPException(status_code=404, detail="Prospecto no encontrado")
    
    return prospect.to_dict() 