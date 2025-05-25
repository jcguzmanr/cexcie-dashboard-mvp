import React from 'react';
import { 
  LightBulbIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import { useChannelEffectiveness, useConversionFunnel, useOperationalKPIs } from '../../hooks/useAnalytics';

interface InsightCardProps {
  type: 'success' | 'warning' | 'info' | 'danger';
  title: string;
  description: string;
  recommendation?: string;
  metric?: string;
}

const InsightCard: React.FC<InsightCardProps> = ({ 
  type, 
  title, 
  description, 
  recommendation, 
  metric 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-6 h-6 text-green-600" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />;
      case 'danger':
        return <ArrowTrendingDownIcon className="w-6 h-6 text-red-600" />;
      default:
        return <LightBulbIcon className="w-6 h-6 text-blue-600" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'danger':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className={`rounded-lg border p-4 ${getBackgroundColor()}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
          <p className="text-sm text-gray-700 mt-1">{description}</p>
          {metric && (
            <div className="mt-2 text-lg font-bold text-gray-900">{metric}</div>
          )}
          {recommendation && (
            <div className="mt-3 p-3 bg-white rounded-md border border-gray-200">
              <p className="text-sm text-gray-800">
                <strong>Recomendación:</strong> {recommendation}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AnalyticsInsights: React.FC = () => {
  const { data: channelData } = useChannelEffectiveness();
  const { data: funnelData } = useConversionFunnel();
  const { data: kpiData } = useOperationalKPIs();

  const generateInsights = () => {
    const insights: InsightCardProps[] = [];

    // Análisis de canales
    if (channelData?.channels) {
      const bestChannel = channelData.best_performing;
      const worstChannel = channelData.channels.reduce((worst: any, current: any) => 
        current.conversion_rate < worst.conversion_rate ? current : worst
      );

      if (bestChannel) {
        insights.push({
          type: 'success',
          title: 'Canal de Mayor Rendimiento',
          description: `${bestChannel.channel} está generando los mejores resultados con una tasa de conversión del ${bestChannel.conversion_rate}%.`,
          recommendation: `Considera aumentar la inversión en ${bestChannel.channel} y replicar las estrategias exitosas en otros canales.`,
          metric: `${bestChannel.conversion_rate}% conversión`
        });
      }

      if (worstChannel && worstChannel.conversion_rate < 10) {
        insights.push({
          type: 'warning',
          title: 'Canal con Bajo Rendimiento',
          description: `${worstChannel.channel} tiene una tasa de conversión muy baja del ${worstChannel.conversion_rate}%.`,
          recommendation: `Revisa la estrategia de ${worstChannel.channel}, optimiza el contenido o considera reasignar recursos a canales más efectivos.`,
          metric: `${worstChannel.conversion_rate}% conversión`
        });
      }
    }

    // Análisis del embudo de conversión
    if (funnelData?.funnel) {
      const contactedStage = funnelData.funnel.find((stage: any) => stage.stage === 'Contactado');
      const processStage = funnelData.funnel.find((stage: any) => stage.stage === 'En proceso');
      
      if (contactedStage && contactedStage.conversion_rate < 50) {
        insights.push({
          type: 'danger',
          title: 'Baja Tasa de Contacto',
          description: `Solo el ${contactedStage.conversion_rate}% de los nuevos prospectos están siendo contactados efectivamente.`,
          recommendation: 'Implementa un sistema de seguimiento automático y asegúrate de que el equipo de ventas tenga suficiente capacidad para contactar a todos los leads.',
          metric: `${contactedStage.conversion_rate}% contactados`
        });
      }

      if (processStage && processStage.conversion_rate < 30) {
        insights.push({
          type: 'warning',
          title: 'Pérdida en Proceso de Conversión',
          description: `El ${100 - processStage.conversion_rate}% de los prospectos contactados no avanzan en el proceso.`,
          recommendation: 'Revisa el script de ventas, mejora la capacitación del equipo y considera implementar un proceso de nurturing más efectivo.',
          metric: `${processStage.conversion_rate}% avanzan`
        });
      }
    }

    // Análisis de KPIs
    if (kpiData) {
      if (kpiData.overall_conversion_rate > 15) {
        insights.push({
          type: 'success',
          title: 'Excelente Tasa de Conversión',
          description: `La tasa de conversión general del ${kpiData.overall_conversion_rate}% está por encima del promedio de la industria.`,
          recommendation: 'Mantén las estrategias actuales y documenta las mejores prácticas para escalar el éxito.',
          metric: `${kpiData.overall_conversion_rate}% conversión`
        });
      }

      if (kpiData.avg_conversion_time > 30) {
        insights.push({
          type: 'warning',
          title: 'Tiempo de Conversión Elevado',
          description: `El tiempo promedio de conversión de ${kpiData.avg_conversion_time} días es alto.`,
          recommendation: 'Implementa estrategias para acelerar el proceso de decisión, como ofertas por tiempo limitado o seguimiento más frecuente.',
          metric: `${kpiData.avg_conversion_time} días promedio`
        });
      }
    }

    // Insight general si no hay datos suficientes
    if (insights.length === 0) {
      insights.push({
        type: 'info',
        title: 'Recopilando Datos',
        description: 'Estamos analizando tus datos para generar insights personalizados.',
        recommendation: 'Asegúrate de que todos los canales estén configurados correctamente para obtener análisis más detallados.'
      });
    }

    return insights;
  };

  const insights = generateInsights();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <LightBulbIcon className="w-6 h-6 text-yellow-500" />
        <h3 className="text-lg font-semibold text-gray-900">Insights y Recomendaciones</h3>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => (
          <InsightCard
            key={index}
            type={insight.type}
            title={insight.title}
            description={insight.description}
            recommendation={insight.recommendation}
            metric={insight.metric}
          />
        ))}
      </div>

      {/* Acciones rápidas */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Acciones Recomendadas</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button className="flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <ArrowTrendingUpIcon className="w-4 h-4 mr-2" />
            Optimizar Canales
          </button>
          <button className="flex items-center justify-center px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500">
            <CheckCircleIcon className="w-4 h-4 mr-2" />
            Mejorar Proceso
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsInsights; 