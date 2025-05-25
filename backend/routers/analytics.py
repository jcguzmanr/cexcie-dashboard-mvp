from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import text, func, case, extract
from typing import Optional, Dict, Any, List
from models.database import get_db
from models.prospect_legacy import ProspectoLegacy, InteraccionLegacy, TestResultadoLegacy, AsesoriaLegacy
from datetime import datetime, timedelta
import calendar

router = APIRouter()

@router.get("/analytics/real-time-metrics")
async def get_real_time_metrics(db: Session = Depends(get_db)):
    """Métricas en tiempo real para los KPI cards"""
    try:
        # Obtener totales
        total_prospects = db.query(func.count(ProspectoLegacy.prospecto_id)).scalar()
        total_enrolled = db.query(func.count(ProspectoLegacy.prospecto_id)).filter(
            ProspectoLegacy.estado == 'Matriculado'
        ).scalar()
        
        # Calcular tasa de conversión
        conversion_rate = (total_enrolled / total_prospects * 100) if total_prospects > 0 else 0
        
        # Tiempo promedio de conversión (simulado - en una implementación real usaríamos fecha de actualización)
        avg_conversion_time = 18.5  # Promedio estimado en días
        
        # Calcular tendencias (comparar con mes anterior)
        from datetime import datetime, timedelta
        current_month = datetime.now().replace(day=1)
        previous_month = (current_month - timedelta(days=1)).replace(day=1)
        
        # Leads este mes vs mes anterior
        current_month_leads = db.query(func.count(ProspectoLegacy.prospecto_id)).filter(
            ProspectoLegacy.fecha_registro >= current_month
        ).scalar()
        
        previous_month_leads = db.query(func.count(ProspectoLegacy.prospecto_id)).filter(
            ProspectoLegacy.fecha_registro >= previous_month,
            ProspectoLegacy.fecha_registro < current_month
        ).scalar()
        
        leads_trend = ((current_month_leads - previous_month_leads) / previous_month_leads * 100) if previous_month_leads > 0 else 0
        
        # Matriculados este mes vs mes anterior
        current_month_enrolled = db.query(func.count(ProspectoLegacy.prospecto_id)).filter(
            ProspectoLegacy.estado == 'Matriculado',
            ProspectoLegacy.fecha_registro >= current_month
        ).scalar()
        
        previous_month_enrolled = db.query(func.count(ProspectoLegacy.prospecto_id)).filter(
            ProspectoLegacy.estado == 'Matriculado',
            ProspectoLegacy.fecha_registro >= previous_month,
            ProspectoLegacy.fecha_registro < current_month
        ).scalar()
        
        enrolled_trend = ((current_month_enrolled - previous_month_enrolled) / previous_month_enrolled * 100) if previous_month_enrolled > 0 else 0
        
        # Calcular tendencia de conversión
        current_conversion = (current_month_enrolled / current_month_leads * 100) if current_month_leads > 0 else 0
        previous_conversion = (previous_month_enrolled / previous_month_leads * 100) if previous_month_leads > 0 else 0
        conversion_trend = current_conversion - previous_conversion
        
        return {
            'total_leads': total_prospects,
            'total_enrolled': total_enrolled,
            'conversion_rate': round(conversion_rate, 2),
            'avg_conversion_time_days': avg_conversion_time,
            'trends': {
                'leads_trend': round(leads_trend, 1),
                'enrolled_trend': round(enrolled_trend, 1),
                'conversion_trend': round(conversion_trend, 1),
                'time_trend': 0  # Para futura implementación
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en métricas en tiempo real: {str(e)}")

@router.get("/analytics/conversion-funnel")
async def get_conversion_funnel(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Análisis del embudo de conversión"""
    try:
        # Contar prospectos por estado
        query = db.query(
            ProspectoLegacy.estado,
            func.count(ProspectoLegacy.prospecto_id).label('count')
        )
        
        if start_date and end_date:
            query = query.filter(
                ProspectoLegacy.fecha_registro.between(start_date, end_date)
            )
        
        results = query.group_by(ProspectoLegacy.estado).all()
        
        # Preparar datos para el embudo
        states_order = ['Nuevo', 'Contactado', 'En proceso', 'Matriculado', 'No interesado']
        funnel_data = []
        
        state_counts = {result.estado: result.count for result in results}
        total = sum(state_counts.values())
        
        for i, state in enumerate(states_order):
            count = state_counts.get(state, 0)
            percentage = (count / total * 100) if total > 0 else 0
            
            # Calcular tasa de conversión desde el estado anterior
            conversion_rate = 0
            if i > 0:
                prev_count = sum(state_counts.get(s, 0) for s in states_order[:i+1])
                conversion_rate = (count / prev_count * 100) if prev_count > 0 else 0
            
            funnel_data.append({
                'stage': state,
                'count': count,
                'percentage': round(percentage, 2),
                'conversion_rate': round(conversion_rate, 2)
            })
        
        return {
            'funnel': funnel_data,
            'total_prospects': total,
            'overall_conversion': round((state_counts.get('Matriculado', 0) / total * 100), 2) if total > 0 else 0
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en análisis de embudo: {str(e)}")

@router.get("/analytics/geographic-distribution")
async def get_geographic_distribution(db: Session = Depends(get_db)):
    """Análisis de distribución geográfica"""
    try:
        # Distribución por ciudad
        city_stats = db.query(
            ProspectoLegacy.ciudad,
            func.count(ProspectoLegacy.prospecto_id).label('total'),
            func.sum(case((ProspectoLegacy.estado == 'Matriculado', 1), else_=0)).label('matriculados')
        ).group_by(ProspectoLegacy.ciudad).all()
        
        geographic_data = []
        for stat in city_stats:
            city = stat.ciudad or 'No especificado'
            total = stat.total
            matriculados = stat.matriculados
            conversion_rate = (matriculados / total * 100) if total > 0 else 0
            
            geographic_data.append({
                'city': city,
                'total_prospects': total,
                'enrolled': matriculados,
                'conversion_rate': round(conversion_rate, 2)
            })
        
        # Ordenar por total de prospectos
        geographic_data.sort(key=lambda x: x['total_prospects'], reverse=True)
        
        return {
            'cities': geographic_data,
            'top_cities': geographic_data[:5],
            'total_cities': len(geographic_data)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en análisis geográfico: {str(e)}")

@router.get("/analytics/channel-effectiveness")
async def get_channel_effectiveness(db: Session = Depends(get_db)):
    """Análisis de efectividad de canales"""
    try:
        # Efectividad por origen
        origin_stats = db.query(
            ProspectoLegacy.origen,
            func.count(ProspectoLegacy.prospecto_id).label('total'),
            func.sum(case((ProspectoLegacy.estado == 'Matriculado', 1), else_=0)).label('matriculados'),
            func.sum(case((ProspectoLegacy.estado == 'Contactado', 1), else_=0)).label('contactados')
        ).group_by(ProspectoLegacy.origen).all()
        
        channel_data = []
        for stat in origin_stats:
            origen = stat.origen or 'Directo'
            total = stat.total
            matriculados = stat.matriculados
            contactados = stat.contactados
            
            conversion_rate = (matriculados / total * 100) if total > 0 else 0
            contact_rate = (contactados / total * 100) if total > 0 else 0
            
            channel_data.append({
                'channel': origen,
                'total_leads': total,
                'contacted': contactados,
                'enrolled': matriculados,
                'contact_rate': round(contact_rate, 2),
                'conversion_rate': round(conversion_rate, 2),
                'quality_score': round((conversion_rate + contact_rate) / 2, 2)
            })
        
        # Ordenar por tasa de conversión
        channel_data.sort(key=lambda x: x['conversion_rate'], reverse=True)
        
        return {
            'channels': channel_data,
            'best_performing': channel_data[0] if channel_data else None,
            'total_channels': len(channel_data)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en análisis de canales: {str(e)}")

@router.get("/analytics/interaction-patterns")
async def get_interaction_patterns(db: Session = Depends(get_db)):
    """Análisis de patrones de interacción"""
    try:
        # Interacciones por módulo
        module_stats = db.query(
            InteraccionLegacy.modulo,
            func.count(InteraccionLegacy.interaccion_id).label('total_interactions'),
            func.count(func.distinct(InteraccionLegacy.prospecto_id)).label('unique_prospects')
        ).group_by(InteraccionLegacy.modulo).all()
        
        # Dispositivos más utilizados
        device_stats = db.query(
            InteraccionLegacy.dispositivo_id,
            func.count(InteraccionLegacy.interaccion_id).label('interactions')
        ).group_by(InteraccionLegacy.dispositivo_id).order_by(
            func.count(InteraccionLegacy.interaccion_id).desc()
        ).limit(10).all()
        
        # Estados de interacción
        status_stats = db.query(
            InteraccionLegacy.estado_interaccion,
            func.count(InteraccionLegacy.interaccion_id).label('count')
        ).group_by(InteraccionLegacy.estado_interaccion).all()
        
        modules = [{
            'module': stat.modulo,
            'total_interactions': stat.total_interactions,
            'unique_prospects': stat.unique_prospects,
            'avg_interactions_per_prospect': round(stat.total_interactions / stat.unique_prospects, 2) if stat.unique_prospects > 0 else 0
        } for stat in module_stats]
        
        devices = [{
            'device_id': stat.dispositivo_id,
            'interactions': stat.interactions
        } for stat in device_stats]
        
        statuses = [{
            'status': stat.estado_interaccion,
            'count': stat.count
        } for stat in status_stats]
        
        return {
            'modules': modules,
            'top_devices': devices,
            'interaction_statuses': statuses,
            'total_interactions': sum([m['total_interactions'] for m in modules])
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en análisis de interacciones: {str(e)}")

@router.get("/analytics/test-performance")
async def get_test_performance(db: Session = Depends(get_db)):
    """Análisis de rendimiento de tests"""
    try:
        # Estadísticas de puntajes
        score_stats = db.query(
            func.avg(func.cast(TestResultadoLegacy.puntaje, db.Integer)).label('avg_score'),
            func.min(func.cast(TestResultadoLegacy.puntaje, db.Integer)).label('min_score'),
            func.max(func.cast(TestResultadoLegacy.puntaje, db.Integer)).label('max_score'),
            func.count(TestResultadoLegacy.resultado_id).label('total_tests')
        ).first()
        
        # Distribución por clasificación
        classification_stats = db.query(
            TestResultadoLegacy.clasificacion,
            func.count(TestResultadoLegacy.resultado_id).label('count')
        ).group_by(TestResultadoLegacy.clasificacion).all()
        
        # Correlación con matriculación
        enrollment_correlation = db.query(
            func.avg(func.cast(TestResultadoLegacy.puntaje, db.Integer)).label('avg_score')
        ).join(
            ProspectoLegacy, TestResultadoLegacy.prospecto_id == ProspectoLegacy.prospecto_id
        ).filter(ProspectoLegacy.estado == 'Matriculado').first()
        
        classifications = [{
            'classification': stat.clasificacion,
            'count': stat.count,
            'percentage': round((stat.count / score_stats.total_tests * 100), 2) if score_stats.total_tests > 0 else 0
        } for stat in classification_stats]
        
        return {
            'overall_stats': {
                'average_score': round(float(score_stats.avg_score), 2) if score_stats.avg_score else 0,
                'min_score': int(score_stats.min_score) if score_stats.min_score else 0,
                'max_score': int(score_stats.max_score) if score_stats.max_score else 0,
                'total_tests': score_stats.total_tests
            },
            'classifications': classifications,
            'enrolled_avg_score': round(float(enrollment_correlation.avg_score), 2) if enrollment_correlation.avg_score else 0
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en análisis de tests: {str(e)}")

@router.get("/analytics/advisory-impact")
async def get_advisory_impact(db: Session = Depends(get_db)):
    """Análisis del impacto de asesorías"""
    try:
        # Prospectos con y sin asesoría
        prospects_with_advisory = db.query(
            func.count(func.distinct(AsesoriaLegacy.prospecto_id)).label('count')
        ).scalar()
        
        total_prospects = db.query(
            func.count(ProspectoLegacy.prospecto_id)
        ).scalar()
        
        prospects_without_advisory = total_prospects - prospects_with_advisory
        
        # Tasa de matriculación con asesoría
        enrolled_with_advisory = db.query(
            func.count(func.distinct(ProspectoLegacy.prospecto_id))
        ).join(
            AsesoriaLegacy, ProspectoLegacy.prospecto_id == AsesoriaLegacy.prospecto_id
        ).filter(ProspectoLegacy.estado == 'Matriculado').scalar()
        
        # Modalidades preferidas
        modality_stats = db.query(
            AsesoriaLegacy.modalidad_preferida,
            func.count(AsesoriaLegacy.asesoria_id).label('count')
        ).group_by(AsesoriaLegacy.modalidad_preferida).all()
        
        advisory_conversion = (enrolled_with_advisory / prospects_with_advisory * 100) if prospects_with_advisory > 0 else 0
        
        modalities = [{
            'modality': stat.modalidad_preferida or 'No especificado',
            'count': stat.count
        } for stat in modality_stats]
        
        return {
            'prospects_with_advisory': prospects_with_advisory,
            'prospects_without_advisory': prospects_without_advisory,
            'advisory_conversion_rate': round(advisory_conversion, 2),
            'enrolled_with_advisory': enrolled_with_advisory,
            'preferred_modalities': modalities,
            'advisory_coverage': round((prospects_with_advisory / total_prospects * 100), 2) if total_prospects > 0 else 0
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en análisis de asesorías: {str(e)}")

@router.get("/analytics/temporal-trends")
async def get_temporal_trends(
    period: str = Query('month', regex='^(day|week|month)$'),
    db: Session = Depends(get_db)
):
    """Análisis de tendencias temporales"""
    try:
        # Determinar el formato de fecha según el período
        if period == 'day':
            date_format = func.date(ProspectoLegacy.fecha_registro)
            days_back = 30
        elif period == 'week':
            date_format = func.date_trunc('week', ProspectoLegacy.fecha_registro)
            days_back = 84  # 12 weeks
        else:  # month
            date_format = func.date_trunc('month', ProspectoLegacy.fecha_registro)
            days_back = 365  # 12 months
        
        cutoff_date = datetime.now() - timedelta(days=days_back)
        
        # Tendencia de registros
        registration_trend = db.query(
            date_format.label('period'),
            func.count(ProspectoLegacy.prospecto_id).label('registrations'),
            func.sum(case((ProspectoLegacy.estado == 'Matriculado', 1), else_=0)).label('enrollments')
        ).filter(
            ProspectoLegacy.fecha_registro >= cutoff_date
        ).group_by(date_format).order_by(date_format).all()
        
        trends = [{
            'period': trend.period.isoformat() if trend.period else None,
            'registrations': trend.registrations,
            'enrollments': trend.enrollments,
            'conversion_rate': round((trend.enrollments / trend.registrations * 100), 2) if trend.registrations > 0 else 0
        } for trend in registration_trend]
        
        return {
            'period': period,
            'trends': trends,
            'total_periods': len(trends)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en análisis temporal: {str(e)}")

@router.get("/analytics/operational-kpis")
async def get_operational_kpis(db: Session = Depends(get_db)):
    """KPIs operacionales en tiempo real"""
    try:
        today = datetime.now().date()
        week_ago = today - timedelta(days=7)
        month_ago = today - timedelta(days=30)
        
        # KPIs principales
        total_prospects = db.query(func.count(ProspectoLegacy.prospecto_id)).scalar()
        new_this_week = db.query(func.count(ProspectoLegacy.prospecto_id)).filter(
            func.date(ProspectoLegacy.fecha_registro) >= week_ago
        ).scalar()
        enrolled_this_month = db.query(func.count(ProspectoLegacy.prospecto_id)).filter(
            ProspectoLegacy.estado == 'Matriculado',
            func.date(ProspectoLegacy.fecha_registro) >= month_ago
        ).scalar()
        
        # Prospectos en proceso
        in_process = db.query(func.count(ProspectoLegacy.prospecto_id)).filter(
            ProspectoLegacy.estado.in_(['Contactado', 'En proceso'])
        ).scalar()
        
        # Interacciones recientes
        recent_interactions = db.query(func.count(InteraccionLegacy.interaccion_id)).filter(
            func.date(InteraccionLegacy.timestamp) >= week_ago
        ).scalar()
        
        # Tests completados esta semana
        recent_tests = db.query(func.count(TestResultadoLegacy.resultado_id)).filter(
            func.date(TestResultadoLegacy.timestamp) >= week_ago
        ).scalar()
        
        # Asesorías programadas
        recent_advisories = db.query(func.count(AsesoriaLegacy.asesoria_id)).filter(
            func.date(AsesoriaLegacy.fecha_asesoria) >= week_ago
        ).scalar()
        
        return {
            'total_prospects': total_prospects,
            'new_prospects_week': new_this_week,
            'enrollments_month': enrolled_this_month,
            'prospects_in_process': in_process,
            'recent_interactions': recent_interactions,
            'recent_tests': recent_tests,
            'recent_advisories': recent_advisories,
            'weekly_conversion': round((enrolled_this_month / new_this_week * 100), 2) if new_this_week > 0 else 0
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en KPIs operacionales: {str(e)}")
