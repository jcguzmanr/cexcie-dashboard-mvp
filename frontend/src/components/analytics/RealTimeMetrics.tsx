import React from 'react';
import { useRealTimeMetrics } from '../../hooks/useAnalytics';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, MinusIcon } from '@heroicons/react/24/outline';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon, color }) => {
  const getTrendIcon = () => {
    if (!change) return <MinusIcon className="w-4 h-4 text-gray-400" />;
    if (change > 0) return <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />;
    return <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />;
  };

  const getTrendColor = () => {
    if (!change) return 'text-gray-500';
    if (change > 0) return 'text-green-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${color}`}>
            {icon}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
          </div>
        </div>
        {change !== undefined && (
          <div className="flex items-center space-x-1">
            {getTrendIcon()}
            <span className={`text-sm font-medium ${getTrendColor()}`}>
              {Math.abs(change)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const RealTimeMetrics: React.FC = () => {
  const { data: metrics, isLoading, isError } = useRealTimeMetrics();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
              <div className="ml-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError || !metrics) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <p className="text-red-600 mb-2">Error al cargar métricas en tiempo real</p>
          <p className="text-sm text-gray-500">Verificar que el backend esté funcionando en http://localhost:8000</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Conversión General"
        value={`${metrics.conversion_rate}%`}
        change={metrics.trends?.conversion_trend}
        icon={<ArrowTrendingUpIcon className="w-8 h-8" />}
        color="text-blue-600"
      />
      
      <MetricCard
        title="Leads Totales"
        value={metrics.total_leads}
        change={metrics.trends?.leads_trend}
        icon={
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        }
        color="text-green-600"
      />
      
      <MetricCard
        title="Matriculados"
        value={metrics.total_enrolled}
        change={metrics.trends?.enrolled_trend}
        icon={
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        }
        color="text-purple-600"
      />
      
      <MetricCard
        title="Tiempo Prom. Conversión"
        value={`${metrics.avg_conversion_time_days}d`}
        change={metrics.trends?.time_trend}
        icon={
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        color="text-orange-600"
      />
    </div>
  );
};

export default RealTimeMetrics; 