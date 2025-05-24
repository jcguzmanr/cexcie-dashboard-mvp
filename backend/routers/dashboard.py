from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models import get_db, Prospect, Interaction, Test, Advisory, Center, Device

router = APIRouter()

@router.get("/metrics")
async def get_dashboard_metrics(db: Session = Depends(get_db)):
    """
    Obtener métricas principales del dashboard
    """
    total_prospects = db.query(Prospect).count()
    total_interactions = db.query(Interaction).count()
    completed_tests = db.query(Test).count()
    total_advisories = db.query(Advisory).count()
    active_centers = db.query(Center).filter(Center.is_active == True).count()
    total_devices = db.query(Device).count()
    
    return {
        "total_prospects": total_prospects,
        "total_interactions": total_interactions,
        "completed_tests": completed_tests,
        "total_advisories": total_advisories,
        "active_centers": active_centers,
        "total_devices": total_devices,
        "growth_percentage": 12.5  # Mock data
    }

@router.get("/interactions-chart")
async def get_interactions_chart(db: Session = Depends(get_db)):
    """
    Obtener datos para gráfico de interacciones por día
    """
    # TODO: Implementar query real con agrupación por fecha
    mock_data = [
        {"date": "2024-05-01", "count": 12},
        {"date": "2024-05-02", "count": 15},
        {"date": "2024-05-03", "count": 8},
        {"date": "2024-05-04", "count": 22},
        {"date": "2024-05-05", "count": 18}
    ]
    
    return {"data": mock_data}

@router.get("/cities-chart")
async def get_cities_chart(db: Session = Depends(get_db)):
    """
    Obtener top 5 ciudades con más prospectos
    """
    # TODO: Implementar query real con GROUP BY
    mock_data = [
        {"city": "Lima", "count": 67},
        {"city": "Huancayo", "count": 35},
        {"city": "Junín", "count": 15},
        {"city": "Arequipa", "count": 8},
        {"city": "Cusco", "count": 5}
    ]
    
    return {"data": mock_data} 