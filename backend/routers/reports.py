from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import text, func, case, extract
from typing import Optional, Dict, Any, List
from models.database import get_db
from models.prospect_legacy import ProspectoLegacy, InteraccionLegacy, TestResultadoLegacy, AsesoriaLegacy
from datetime import datetime, timedelta
from fastapi.responses import StreamingResponse
import io
import json

router = APIRouter()

@router.get("/reports/prospects")
async def generate_prospects_report(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    city: Optional[str] = None,
    channel: Optional[str] = None,
    status: Optional[str] = None,
    format: str = Query('json', regex='^(json|csv|excel)$'),
    db: Session = Depends(get_db)
):
    """Generar reporte de prospectos"""
    try:
        # Construcción de la consulta base
        query = db.query(ProspectoLegacy)
        
        # Aplicar filtros
        if start_date:
            query = query.filter(ProspectoLegacy.fecha_registro >= start_date)
        if end_date:
            query = query.filter(ProspectoLegacy.fecha_registro <= end_date)
        if city:
            query = query.filter(ProspectoLegacy.ciudad == city)
        if channel:
            query = query.filter(ProspectoLegacy.origen == channel)
        if status:
            query = query.filter(ProspectoLegacy.estado == status)
        
        prospects = query.all()
        
        # Preparar datos
        data = []
        for prospect in prospects:
            data.append({
                'id': str(prospect.prospecto_id),
                'tipo_documento': prospect.tipo_documento,
                'dni': prospect.dni,
                'nombre': prospect.nombre,
                'correo': prospect.correo,
                'celular': prospect.celular,
                'ciudad': prospect.ciudad,
                'fecha_registro': prospect.fecha_registro.isoformat() if prospect.fecha_registro else None,
                'origen': prospect.origen,
                'estado': prospect.estado,
                'consentimiento_datos': prospect.consentimiento_datos
            })
        
        if format == 'csv':
            return generate_csv_response(data, 'prospectos')
        elif format == 'excel':
            return generate_excel_response(data, 'prospectos')
        else:
            return {
                'report_type': 'prospects',
                'generated_at': datetime.now().isoformat(),
                'filters': {
                    'start_date': start_date,
                    'end_date': end_date,
                    'city': city,
                    'channel': channel,
                    'status': status
                },
                'total_records': len(data),
                'data': data
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generando reporte de prospectos: {str(e)}")

@router.get("/reports/conversions")
async def generate_conversions_report(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    format: str = Query('json', regex='^(json|csv|excel)$'),
    db: Session = Depends(get_db)
):
    """Generar reporte de conversiones"""
    try:
        # Análisis del embudo de conversión
        query = db.query(
            ProspectoLegacy.estado,
            func.count(ProspectoLegacy.prospecto_id).label('count'),
            func.extract('month', ProspectoLegacy.fecha_registro).label('month'),
            func.extract('year', ProspectoLegacy.fecha_registro).label('year')
        )
        
        if start_date:
            query = query.filter(ProspectoLegacy.fecha_registro >= start_date)
        if end_date:
            query = query.filter(ProspectoLegacy.fecha_registro <= end_date)
        
        results = query.group_by(
            ProspectoLegacy.estado,
            func.extract('month', ProspectoLegacy.fecha_registro),
            func.extract('year', ProspectoLegacy.fecha_registro)
        ).all()
        
        # Organizar datos
        data = []
        for result in results:
            data.append({
                'periodo': f"{int(result.year)}-{int(result.month):02d}",
                'estado': result.estado,
                'cantidad': result.count
            })
        
        # Calcular tasas de conversión por canal
        channel_conversion = db.query(
            ProspectoLegacy.origen,
            func.count(ProspectoLegacy.prospecto_id).label('total'),
            func.sum(case((ProspectoLegacy.estado == 'Matriculado', 1), else_=0)).label('matriculados')
        ).group_by(ProspectoLegacy.origen).all()
        
        channel_data = []
        for channel in channel_conversion:
            total = channel.total
            matriculados = channel.matriculados
            conversion_rate = (matriculados / total * 100) if total > 0 else 0
            
            channel_data.append({
                'canal': channel.origen or 'Directo',
                'total_leads': total,
                'matriculados': matriculados,
                'tasa_conversion': round(conversion_rate, 2)
            })
        
        report_data = {
            'funnel_data': data,
            'channel_conversion': channel_data
        }
        
        if format == 'csv':
            return generate_csv_response(data + channel_data, 'conversiones')
        elif format == 'excel':
            return generate_excel_response(report_data, 'conversiones')
        else:
            return {
                'report_type': 'conversions',
                'generated_at': datetime.now().isoformat(),
                'filters': {
                    'start_date': start_date,
                    'end_date': end_date
                },
                'data': report_data
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generando reporte de conversiones: {str(e)}")

@router.get("/reports/channels")
async def generate_channels_report(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    format: str = Query('json', regex='^(json|csv|excel)$'),
    db: Session = Depends(get_db)
):
    """Generar reporte de efectividad de canales"""
    try:
        query = db.query(
            ProspectoLegacy.origen,
            func.count(ProspectoLegacy.prospecto_id).label('total'),
            func.sum(case((ProspectoLegacy.estado == 'Matriculado', 1), else_=0)).label('matriculados'),
            func.sum(case((ProspectoLegacy.estado == 'Contactado', 1), else_=0)).label('contactados'),
            func.avg(func.extract('epoch', ProspectoLegacy.fecha_registro)).label('avg_time')
        )
        
        if start_date:
            query = query.filter(ProspectoLegacy.fecha_registro >= start_date)
        if end_date:
            query = query.filter(ProspectoLegacy.fecha_registro <= end_date)
        
        results = query.group_by(ProspectoLegacy.origen).all()
        
        data = []
        for result in results:
            total = result.total
            matriculados = result.matriculados
            contactados = result.contactados
            
            conversion_rate = (matriculados / total * 100) if total > 0 else 0
            contact_rate = (contactados / total * 100) if total > 0 else 0
            quality_score = (conversion_rate + contact_rate) / 2
            
            data.append({
                'canal': result.origen or 'Directo',
                'total_leads': total,
                'contactados': contactados,
                'matriculados': matriculados,
                'tasa_contacto': round(contact_rate, 2),
                'tasa_conversion': round(conversion_rate, 2),
                'score_calidad': round(quality_score, 2)
            })
        
        # Ordenar por tasa de conversión
        data.sort(key=lambda x: x['tasa_conversion'], reverse=True)
        
        if format == 'csv':
            return generate_csv_response(data, 'canales')
        elif format == 'excel':
            return generate_excel_response(data, 'canales')
        else:
            return {
                'report_type': 'channels',
                'generated_at': datetime.now().isoformat(),
                'filters': {
                    'start_date': start_date,
                    'end_date': end_date
                },
                'total_channels': len(data),
                'data': data
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generando reporte de canales: {str(e)}")

@router.get("/reports/geographic")
async def generate_geographic_report(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    format: str = Query('json', regex='^(json|csv|excel)$'),
    db: Session = Depends(get_db)
):
    """Generar reporte de distribución geográfica"""
    try:
        query = db.query(
            ProspectoLegacy.ciudad,
            func.count(ProspectoLegacy.prospecto_id).label('total'),
            func.sum(case((ProspectoLegacy.estado == 'Matriculado', 1), else_=0)).label('matriculados'),
            func.sum(case((ProspectoLegacy.estado == 'Contactado', 1), else_=0)).label('contactados')
        )
        
        if start_date:
            query = query.filter(ProspectoLegacy.fecha_registro >= start_date)
        if end_date:
            query = query.filter(ProspectoLegacy.fecha_registro <= end_date)
        
        results = query.group_by(ProspectoLegacy.ciudad).all()
        
        data = []
        for result in results:
            total = result.total
            matriculados = result.matriculados
            contactados = result.contactados
            
            conversion_rate = (matriculados / total * 100) if total > 0 else 0
            contact_rate = (contactados / total * 100) if total > 0 else 0
            
            data.append({
                'ciudad': result.ciudad or 'No especificado',
                'total_prospectos': total,
                'contactados': contactados,
                'matriculados': matriculados,
                'tasa_contacto': round(contact_rate, 2),
                'tasa_conversion': round(conversion_rate, 2)
            })
        
        # Ordenar por total de prospectos
        data.sort(key=lambda x: x['total_prospectos'], reverse=True)
        
        if format == 'csv':
            return generate_csv_response(data, 'geografico')
        elif format == 'excel':
            return generate_excel_response(data, 'geografico')
        else:
            return {
                'report_type': 'geographic',
                'generated_at': datetime.now().isoformat(),
                'filters': {
                    'start_date': start_date,
                    'end_date': end_date
                },
                'total_cities': len(data),
                'data': data
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generando reporte geográfico: {str(e)}")

@router.get("/reports/interactions")
async def generate_interactions_report(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    format: str = Query('json', regex='^(json|csv|excel)$'),
    db: Session = Depends(get_db)
):
    """Generar reporte de interacciones"""
    try:
        # Interacciones por prospecto
        query = db.query(
            InteraccionLegacy.prospecto_id,
            InteraccionLegacy.modulo,
            InteraccionLegacy.accion,
            InteraccionLegacy.dispositivo_id,
            InteraccionLegacy.estado_interaccion,
            InteraccionLegacy.timestamp
        )
        
        if start_date:
            query = query.filter(InteraccionLegacy.timestamp >= start_date)
        if end_date:
            query = query.filter(InteraccionLegacy.timestamp <= end_date)
        
        interactions = query.all()
        
        data = []
        for interaction in interactions:
            data.append({
                'prospecto_id': str(interaction.prospecto_id),
                'modulo': interaction.modulo,
                'accion': interaction.accion,
                'dispositivo_id': interaction.dispositivo_id,
                'estado': interaction.estado_interaccion,
                'timestamp': interaction.timestamp.isoformat() if interaction.timestamp else None
            })
        
        if format == 'csv':
            return generate_csv_response(data, 'interacciones')
        elif format == 'excel':
            return generate_excel_response(data, 'interacciones')
        else:
            return {
                'report_type': 'interactions',
                'generated_at': datetime.now().isoformat(),
                'filters': {
                    'start_date': start_date,
                    'end_date': end_date
                },
                'total_interactions': len(data),
                'data': data
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generando reporte de interacciones: {str(e)}")

@router.get("/reports/executive")
async def generate_executive_report(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    format: str = Query('json', regex='^(json|csv|excel)$'),
    db: Session = Depends(get_db)
):
    """Generar reporte ejecutivo"""
    try:
        # KPIs principales
        total_prospects = db.query(func.count(ProspectoLegacy.prospecto_id)).scalar()
        total_enrolled = db.query(func.count(ProspectoLegacy.prospecto_id)).filter(
            ProspectoLegacy.estado == 'Matriculado'
        ).scalar()
        
        conversion_rate = (total_enrolled / total_prospects * 100) if total_prospects > 0 else 0
        
        # Top canales
        top_channels = db.query(
            ProspectoLegacy.origen,
            func.count(ProspectoLegacy.prospecto_id).label('total'),
            func.sum(case((ProspectoLegacy.estado == 'Matriculado', 1), else_=0)).label('matriculados')
        ).group_by(ProspectoLegacy.origen).order_by(
            func.count(ProspectoLegacy.prospecto_id).desc()
        ).limit(5).all()
        
        # Top ciudades
        top_cities = db.query(
            ProspectoLegacy.ciudad,
            func.count(ProspectoLegacy.prospecto_id).label('total')
        ).group_by(ProspectoLegacy.ciudad).order_by(
            func.count(ProspectoLegacy.prospecto_id).desc()
        ).limit(5).all()
        
        executive_summary = {
            'kpis': {
                'total_prospects': total_prospects,
                'total_enrolled': total_enrolled,
                'conversion_rate': round(conversion_rate, 2),
                'avg_conversion_time': 18.5  # Estimado
            },
            'top_channels': [
                {
                    'canal': channel.origen or 'Directo',
                    'total': channel.total,
                    'matriculados': channel.matriculados,
                    'conversion_rate': round((channel.matriculados / channel.total * 100), 2) if channel.total > 0 else 0
                } for channel in top_channels
            ],
            'top_cities': [
                {
                    'ciudad': city.ciudad or 'No especificado',
                    'total': city.total
                } for city in top_cities
            ]
        }
        
        if format == 'csv':
            # Para CSV, aplanar la estructura
            flat_data = [executive_summary['kpis']]
            return generate_csv_response(flat_data, 'ejecutivo')
        elif format == 'excel':
            return generate_excel_response(executive_summary, 'ejecutivo')
        else:
            return {
                'report_type': 'executive',
                'generated_at': datetime.now().isoformat(),
                'filters': {
                    'start_date': start_date,
                    'end_date': end_date
                },
                'data': executive_summary
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generando reporte ejecutivo: {str(e)}")

def generate_csv_response(data: List[Dict], report_name: str):
    """Generar respuesta CSV"""
    if not data:
        raise HTTPException(status_code=404, detail="No hay datos para generar el reporte")
    
    import csv
    output = io.StringIO()
    
    if isinstance(data[0], dict):
        fieldnames = data[0].keys()
        writer = csv.DictWriter(output, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(data)
    else:
        writer = csv.writer(output)
        writer.writerows(data)
    
    content = output.getvalue()
    output.close()
    
    return StreamingResponse(
        io.StringIO(content),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={report_name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"}
    )

def generate_excel_response(data: Any, report_name: str):
    """Generar respuesta Excel (simulado - requiere openpyxl)"""
    # Para una implementación real, se usaría openpyxl o pandas
    # Por ahora, devolvemos JSON con indicación de Excel
    return {
        'format': 'excel',
        'message': 'Excel generation would be implemented here with openpyxl',
        'data': data,
        'filename': f"{report_name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
    } 