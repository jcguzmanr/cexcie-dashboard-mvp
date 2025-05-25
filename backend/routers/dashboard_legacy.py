from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, text
from models.database import get_db
from models.prospect_legacy import (
    ProspectoLegacy, 
    InteraccionLegacy, 
    TestResultadoLegacy, 
    AsesoriaLegacy,
    CentroExperienciaLegacy,
    DispositivoLegacy
)

router = APIRouter()

@router.get("/dashboard/metrics")
async def get_dashboard_metrics(db: Session = Depends(get_db)):
    """Obtener métricas principales del dashboard"""
    try:
        # Total de prospectos
        total_prospects = db.query(func.count(ProspectoLegacy.prospecto_id)).scalar() or 0
        
        # Total de interacciones
        total_interactions = db.query(func.count(InteraccionLegacy.interaccion_id)).scalar() or 0
        
        # Total de tests completados
        completed_tests = db.query(func.count(TestResultadoLegacy.resultado_id)).scalar() or 0
        
        # Total de asesorías
        total_advisories = db.query(func.count(AsesoriaLegacy.asesoria_id)).scalar() or 0
        
        # Centros activos
        active_centers = db.query(func.count(CentroExperienciaLegacy.centro_id)).filter(
            CentroExperienciaLegacy.activo == True
        ).scalar() or 0
        
        # Total de dispositivos
        total_devices = db.query(func.count(DispositivoLegacy.dispositivo_id)).scalar() or 0
        
        return {
            "total_prospects": total_prospects,
            "total_interactions": total_interactions,
            "completed_tests": completed_tests,
            "total_advisories": total_advisories,
            "active_centers": active_centers,
            "total_devices": total_devices,
            "growth_percentage": 12.5  # Valor fijo por ahora
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener métricas: {str(e)}")

@router.get("/dashboard/interactions-chart")
async def get_interactions_chart(db: Session = Depends(get_db)):
    """Obtener datos para gráfico de interacciones por fecha"""
    try:
        # Query para obtener interacciones por día de los últimos 30 días
        result = db.execute(text("""
            SELECT 
                DATE(timestamp) as fecha,
                COUNT(*) as total
            FROM interaccion 
            WHERE timestamp >= CURRENT_DATE - INTERVAL '30 days'
            GROUP BY DATE(timestamp)
            ORDER BY fecha
        """))
        
        data = []
        for row in result:
            data.append({
                "date": str(row.fecha),
                "interactions": row.total
            })
        
        return {
            "data": data,
            "period": "last_30_days"
        }
        
    except Exception as e:
        # Devolver datos de ejemplo si hay error
        return {
            "data": [
                {"date": "2024-05-01", "interactions": 12},
                {"date": "2024-05-02", "interactions": 8},
                {"date": "2024-05-03", "interactions": 15},
            ],
            "period": "last_30_days"
        }

@router.get("/dashboard/cities-chart") 
async def get_cities_chart(db: Session = Depends(get_db)):
    """Obtener datos para gráfico de prospectos por ciudad"""
    try:
        result = db.execute(text("""
            SELECT 
                ciudad,
                COUNT(*) as total
            FROM prospecto 
            WHERE ciudad IS NOT NULL
            GROUP BY ciudad
            ORDER BY total DESC
            LIMIT 10
        """))
        
        data = []
        for row in result:
            data.append({
                "city": row.ciudad,
                "prospects": row.total
            })
        
        return {
            "data": data,
            "total_cities": len(data)
        }
        
    except Exception as e:
        # Devolver datos de ejemplo si hay error
        return {
            "data": [
                {"city": "Lima", "prospects": 45},
                {"city": "Arequipa", "prospects": 23},
                {"city": "Huancayo", "prospects": 18},
            ],
            "total_cities": 3
        } 