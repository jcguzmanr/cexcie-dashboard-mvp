from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import text, func
from typing import Optional, Dict, Any
from models.database import get_db
from models.prospect_legacy import ProspectoLegacy, InteraccionLegacy, TestResultadoLegacy, AsesoriaLegacy
from pydantic import BaseModel, EmailStr
from datetime import datetime
import uuid
import math

router = APIRouter()

# Pydantic models for request/response
class ProspectCreate(BaseModel):
    tipo_documento: str = "DNI"
    dni: str
    nombre: str
    correo: EmailStr
    celular: Optional[str] = None
    ciudad: Optional[str] = None
    origen: Optional[str] = "Web"
    consentimiento_datos: bool = False
    estado: Optional[str] = "Nuevo"

class ProspectUpdate(BaseModel):
    tipo_documento: Optional[str] = None
    dni: Optional[str] = None
    nombre: Optional[str] = None
    correo: Optional[EmailStr] = None
    celular: Optional[str] = None
    ciudad: Optional[str] = None
    origen: Optional[str] = None
    consentimiento_datos: Optional[bool] = None
    estado: Optional[str] = None

@router.get("/prospects")
async def get_prospects(
    page: int = Query(1, ge=1),
    limit: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    city: Optional[str] = None,
    status: Optional[str] = None,
    origin: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Obtener lista de prospectos con filtros y paginación"""
    try:
        # Construir query base
        query = db.query(ProspectoLegacy)
        
        # Aplicar filtros
        if search:
            search_filter = f"%{search}%"
            query = query.filter(
                (ProspectoLegacy.nombre.ilike(search_filter)) |
                (ProspectoLegacy.dni.ilike(search_filter)) |
                (ProspectoLegacy.correo.ilike(search_filter))
            )
        
        if city:
            query = query.filter(ProspectoLegacy.ciudad.ilike(f"%{city}%"))
            
        if status:
            # Mapear estados del frontend al backend
            status_mapping = {
                "nuevo": "Nuevo",
                "contactado": "Contactado", 
                "en_proceso": "En proceso",
                "matriculado": "Matriculado",
                "no_interesado": "No interesado"
            }
            backend_status = status_mapping.get(status.lower(), status)
            query = query.filter(ProspectoLegacy.estado.ilike(f"%{backend_status}%"))
            
        if origin:
            query = query.filter(ProspectoLegacy.origen.ilike(f"%{origin}%"))
        
        # Obtener total de registros para paginación
        total = query.count()
        
        # Aplicar paginación
        offset = (page - 1) * limit
        prospects = query.offset(offset).limit(limit).all()
        
        # Calcular información de paginación
        total_pages = math.ceil(total / limit) if total > 0 else 1
        
        # Convertir a formato esperado por el frontend
        prospects_data = []
        for prospect in prospects:
            prospect_dict = prospect.to_dict()
            prospects_data.append(prospect_dict)
        
        return {
            "data": prospects_data,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total,
                "pages": total_pages
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener prospectos: {str(e)}")

@router.get("/prospects/{prospect_id}")
async def get_prospect(prospect_id: str, db: Session = Depends(get_db)):
    """Obtener un prospecto específico por ID"""
    try:
        # Evitar que "new" sea tratado como un ID
        if prospect_id.lower() in ['new', 'edit']:
            raise HTTPException(status_code=404, detail="Prospecto no encontrado")
            
        prospect = db.query(ProspectoLegacy).filter(
            ProspectoLegacy.prospecto_id == prospect_id
        ).first()
        
        if not prospect:
            raise HTTPException(status_code=404, detail="Prospecto no encontrado")
        
        return prospect.to_dict()
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener prospecto: {str(e)}")

@router.post("/prospects")
async def create_prospect(prospect_data: ProspectCreate, db: Session = Depends(get_db)):
    """Crear un nuevo prospecto"""
    try:
        # Verificar si ya existe un prospecto con el mismo DNI o correo
        existing_prospect = db.query(ProspectoLegacy).filter(
            (ProspectoLegacy.dni == prospect_data.dni) | 
            (ProspectoLegacy.correo == prospect_data.correo)
        ).first()
        
        if existing_prospect:
            if existing_prospect.dni == prospect_data.dni:
                raise HTTPException(status_code=400, detail="Ya existe un prospecto con este DNI")
            else:
                raise HTTPException(status_code=400, detail="Ya existe un prospecto con este correo electrónico")
        
        # Crear nuevo prospecto
        new_prospect = ProspectoLegacy(
            prospecto_id=uuid.uuid4(),
            tipo_documento=prospect_data.tipo_documento,
            dni=prospect_data.dni,
            nombre=prospect_data.nombre,
            correo=prospect_data.correo,
            celular=prospect_data.celular,
            ciudad=prospect_data.ciudad,
            origen=prospect_data.origen,
            consentimiento_datos=prospect_data.consentimiento_datos,
            estado=prospect_data.estado,
            fecha_registro=datetime.utcnow()
        )
        
        db.add(new_prospect)
        db.commit()
        db.refresh(new_prospect)
        
        return {
            "message": "Prospecto creado exitosamente",
            "prospect": new_prospect.to_dict()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al crear prospecto: {str(e)}")

@router.put("/prospects/{prospect_id}")
async def update_prospect(prospect_id: str, prospect_data: ProspectUpdate, db: Session = Depends(get_db)):
    """Actualizar un prospecto existente"""
    try:
        # Buscar el prospecto
        prospect = db.query(ProspectoLegacy).filter(
            ProspectoLegacy.prospecto_id == prospect_id
        ).first()
        
        if not prospect:
            raise HTTPException(status_code=404, detail="Prospecto no encontrado")
        
        # Actualizar solo los campos proporcionados
        update_data = prospect_data.dict(exclude_unset=True)
        
        for field, value in update_data.items():
            setattr(prospect, field, value)
        
        db.commit()
        db.refresh(prospect)
        
        return {
            "message": "Prospecto actualizado exitosamente",
            "prospect": prospect.to_dict()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al actualizar prospecto: {str(e)}")

@router.delete("/prospects/{prospect_id}")
async def delete_prospect(prospect_id: str, db: Session = Depends(get_db)):
    """Eliminar un prospecto"""
    try:
        # Buscar el prospecto
        prospect = db.query(ProspectoLegacy).filter(
            ProspectoLegacy.prospecto_id == prospect_id
        ).first()
        
        if not prospect:
            raise HTTPException(status_code=404, detail="Prospecto no encontrado")
        
        # Eliminar el prospecto
        db.delete(prospect)
        db.commit()
        
        return {"message": "Prospecto eliminado exitosamente"}
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al eliminar prospecto: {str(e)}")

@router.get("/prospects/{prospect_id}/interactions")
async def get_prospect_interactions(prospect_id: str, db: Session = Depends(get_db)):
    """Obtener interacciones de un prospecto específico"""
    try:
        # Verificar que el prospecto existe
        prospect = db.query(ProspectoLegacy).filter(
            ProspectoLegacy.prospecto_id == prospect_id
        ).first()
        
        if not prospect:
            raise HTTPException(status_code=404, detail="Prospecto no encontrado")
        
        # Obtener interacciones del prospecto
        interactions = db.query(InteraccionLegacy).filter(
            InteraccionLegacy.prospecto_id == prospect_id
        ).order_by(InteraccionLegacy.timestamp.desc()).all()
        
        interactions_data = []
        for interaction in interactions:
            interactions_data.append({
                "id": str(interaction.interaccion_id),
                "module": interaction.modulo,
                "action": interaction.accion,
                "device_id": interaction.dispositivo_id,
                "status": interaction.estado_interaccion,
                "timestamp": interaction.timestamp.isoformat() if interaction.timestamp else None,
                "flow_order": interaction.orden_en_flujo
            })
        
        return {
            "prospect_id": prospect_id,
            "interactions": interactions_data,
            "total": len(interactions_data)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener interacciones: {str(e)}")

@router.get("/prospects/{prospect_id}/tests")
async def get_prospect_tests(prospect_id: str, db: Session = Depends(get_db)):
    """Obtener tests de un prospecto específico"""
    try:
        # Verificar que el prospecto existe
        prospect = db.query(ProspectoLegacy).filter(
            ProspectoLegacy.prospecto_id == prospect_id
        ).first()
        
        if not prospect:
            raise HTTPException(status_code=404, detail="Prospecto no encontrado")
        
        # Obtener tests del prospecto
        tests = db.query(TestResultadoLegacy).filter(
            TestResultadoLegacy.prospecto_id == prospect_id
        ).order_by(TestResultadoLegacy.timestamp.desc()).all()
        
        tests_data = []
        for test in tests:
            tests_data.append({
                "id": str(test.resultado_id),
                "test_id": str(test.test_id),
                "score": test.puntaje,
                "classification": test.clasificacion,
                "timestamp": test.timestamp.isoformat() if test.timestamp else None
            })
        
        return {
            "prospect_id": prospect_id,
            "tests": tests_data,
            "total": len(tests_data)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener tests: {str(e)}")

@router.get("/prospects/{prospect_id}/advisories")
async def get_prospect_advisories(prospect_id: str, db: Session = Depends(get_db)):
    """Obtener asesorías de un prospecto específico"""
    try:
        # Verificar que el prospecto existe
        prospect = db.query(ProspectoLegacy).filter(
            ProspectoLegacy.prospecto_id == prospect_id
        ).first()
        
        if not prospect:
            raise HTTPException(status_code=404, detail="Prospecto no encontrado")
        
        # Obtener asesorías del prospecto
        advisories = db.query(AsesoriaLegacy).filter(
            AsesoriaLegacy.prospecto_id == prospect_id
        ).order_by(AsesoriaLegacy.fecha_asesoria.desc()).all()
        
        advisories_data = []
        for advisory in advisories:
            advisories_data.append({
                "id": str(advisory.asesoria_id),
                "advisor_id": advisory.asesor_id,
                "motivations": advisory.motivaciones,
                "barriers": advisory.barreras,
                "preferred_modality": advisory.modalidad_preferida,
                "observations": advisory.observaciones,
                "date": advisory.fecha_asesoria.isoformat() if advisory.fecha_asesoria else None
            })
        
        return {
            "prospect_id": prospect_id,
            "advisories": advisories_data,
            "total": len(advisories_data)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener asesorías: {str(e)}") 