import React from 'react';
import { useConversionFunnel } from '../../hooks/useAnalytics';

interface FunnelStage {
  stage: string;
  count: number;
  percentage: number;
  conversion_rate: number;
}

interface ConversionFunnelProps {
  startDate?: string;
  endDate?: string;
}

const ConversionFunnel: React.FC<ConversionFunnelProps> = ({ startDate, endDate }) => {
  const { data, isLoading, isError } = useConversionFunnel({
    start_date: startDate,
    end_date: endDate
  });

  const getStageColor = (stage: string) => {
    const colors = {
      'Nuevo': 'bg-blue-500',
      'Contactado': 'bg-yellow-500',
      'En proceso': 'bg-orange-500',
      'Matriculado': 'bg-green-500',
      'No interesado': 'bg-red-500'
    };
    return colors[stage as keyof typeof colors] || 'bg-gray-500';
  };

  const getStageIcon = (stage: string) => {
    const icons = {
      'Nuevo': '👋',
      'Contactado': '📞',
      'En proceso': '⚡',
      'Matriculado': '🎓',
      'No interesado': '❌'
    };
    return icons[stage as keyof typeof icons] || '📊';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Embudo de Conversión</h3>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Embudo de Conversión</h3>
        <div className="text-center py-8">
          <p className="text-red-600">Error al cargar datos del embudo</p>
        </div>
      </div>
    );
  }

  const maxCount = Math.max(...data.funnel.map((stage: FunnelStage) => stage.count));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">📊 Embudo de Conversión</h3>
        <div className="text-sm text-gray-500">
          <span className="font-medium text-primary-600">{data.overall_conversion}%</span> conversión general
        </div>
      </div>

      <div className="space-y-4">
        {data.funnel.map((stage: FunnelStage, index: number) => {
          const width = (stage.count / maxCount) * 100;
          
          return (
            <div key={stage.stage} className="relative">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-sm">{getStageIcon(stage.stage)}</span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{stage.stage}</span>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600">{stage.count} prospects</span>
                      <span className="text-sm font-medium text-gray-900">{stage.percentage}%</span>
                      {index > 0 && (
                        <span className="text-xs text-gray-500">
                          ({stage.conversion_rate}% conversión)
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${getStageColor(stage.stage)} transition-all duration-500`}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Línea conectora */}
              {index < data.funnel.length - 1 && (
                <div className="ml-4 mt-2 mb-2">
                  <div className="w-0.5 h-4 bg-gray-300 ml-3.5"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-blue-600">{data.total_prospects}</div>
            <div className="text-xs text-gray-500">Total Prospectos</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-green-600">
              {data.funnel.find((s: FunnelStage) => s.stage === 'Matriculado')?.count || 0}
            </div>
            <div className="text-xs text-gray-500">Matriculados</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-primary-600">{data.overall_conversion}%</div>
            <div className="text-xs text-gray-500">Tasa Conversión</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversionFunnel; 