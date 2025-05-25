import React from 'react';
import { 
  DocumentChartBarIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  CalendarDaysIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { useOperationalKPIs, useChannelEffectiveness, useConversionFunnel } from '../../hooks/useAnalytics';

interface SummaryMetricProps {
  title: string;
  value: string | number;
  change?: number;
  period: string;
  icon: React.ReactNode;
  color: string;
}

const SummaryMetric: React.FC<SummaryMetricProps> = ({ 
  title, 
  value, 
  change, 
  period, 
  icon, 
  color 
}) => {
  const getTrendIcon = () => {
    if (change === undefined) return null;
    return change >= 0 ? 
      <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" /> : 
      <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />;
  };

  const getTrendColor = () => {
    if (change === undefined) return '';
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-lg ${color}`}>
          {icon}
        </div>
        {change !== undefined && (
          <div className="flex items-center space-x-1">
            {getTrendIcon()}
            <span className={`text-sm font-medium ${getTrendColor()}`}>
              {change > 0 ? '+' : ''}{change}%
            </span>
          </div>
        )}
      </div>
      <div className="mt-3">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-400 mt-1">{period}</p>
      </div>
    </div>
  );
};

const ExecutiveSummary: React.FC = () => {
  const { data: kpiData, isLoading: kpiLoading } = useOperationalKPIs();
  const { data: channelData, isLoading: channelLoading } = useChannelEffectiveness();
  const { data: funnelData, isLoading: funnelLoading } = useConversionFunnel();

  if (kpiLoading || channelLoading || funnelLoading) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-blue-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-white rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getCurrentPeriod = () => {
    const now = new Date();
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
  };

  const getTopChannel = () => {
    if (!channelData?.best_performing) return 'N/A';
    return channelData.best_performing.channel;
  };

  const getFunnelEfficiency = () => {
    if (!funnelData?.overall_conversion) return 0;
    return funnelData.overall_conversion;
  };

  const getTotalLeads = () => {
    if (!kpiData?.total_leads) return 0;
    return kpiData.total_leads;
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <DocumentChartBarIcon className="w-6 h-6 text-blue-600" />
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Resumen Ejecutivo</h2>
          <p className="text-sm text-gray-600">Métricas clave del período actual</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryMetric
          title="Tasa de Conversión"
          value={`${kpiData?.overall_conversion_rate || 0}%`}
          change={kpiData?.conversion_change}
          period={getCurrentPeriod()}
          icon={<ArrowTrendingUpIcon className="w-5 h-5 text-white" />}
          color="bg-blue-500"
        />

        <SummaryMetric
          title="Leads Generados"
          value={getTotalLeads().toLocaleString()}
          change={kpiData?.leads_change}
          period={getCurrentPeriod()}
          icon={<UserGroupIcon className="w-5 h-5 text-white" />}
          color="bg-green-500"
        />

        <SummaryMetric
          title="Canal Principal"
          value={getTopChannel()}
          period="Mejor rendimiento"
          icon={<DocumentChartBarIcon className="w-5 h-5 text-white" />}
          color="bg-purple-500"
        />

        <SummaryMetric
          title="Eficiencia del Embudo"
          value={`${getFunnelEfficiency()}%`}
          period="Conversión general"
          icon={<CalendarDaysIcon className="w-5 h-5 text-white" />}
          color="bg-orange-500"
        />
      </div>

      {/* Resumen textual */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Resumen del Período</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            • <strong>Rendimiento General:</strong> {
              kpiData?.overall_conversion_rate && kpiData.overall_conversion_rate > 15 
                ? 'Excelente' 
                : kpiData?.overall_conversion_rate && kpiData.overall_conversion_rate > 10 
                ? 'Bueno' 
                : 'Necesita mejora'
            } con una tasa de conversión del {kpiData?.overall_conversion_rate || 0}%
          </p>
          <p>
            • <strong>Canal Destacado:</strong> {getTopChannel()} está generando los mejores resultados
          </p>
          <p>
            • <strong>Volumen de Leads:</strong> {getTotalLeads().toLocaleString()} prospectos procesados en el período
          </p>
          <p>
            • <strong>Tiempo de Conversión:</strong> Promedio de {kpiData?.avg_conversion_time || 0} días
          </p>
        </div>
      </div>

      {/* Acciones recomendadas */}
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          📊 Análisis Completo
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          ✅ Datos Actualizados
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          🎯 Insights Disponibles
        </span>
      </div>
    </div>
  );
};

export default ExecutiveSummary; 