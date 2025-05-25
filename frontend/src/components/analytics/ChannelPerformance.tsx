import React from 'react';
import { useChannelEffectiveness } from '../../hooks/useAnalytics';

interface ChannelData {
  channel: string;
  total_leads: number;
  contacted: number;
  enrolled: number;
  contact_rate: number;
  conversion_rate: number;
  quality_score: number;
}

const ChannelPerformance: React.FC = () => {
  const { data, isLoading, isError } = useChannelEffectiveness();

  const getChannelIcon = (channel: string) => {
    const icons: { [key: string]: string } = {
      'facebook': '📘',
      'instagram': '📷',
      'google': '🔍',
      'website': '🌐',
      'referido': '🤝',
      'directo': '📞',
      'whatsapp': '💬',
      'email': '📧'
    };
    return icons[channel.toLowerCase()] || '📊';
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 70) return 'text-green-600 bg-green-50';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50';
    if (score >= 30) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getPerformanceLabel = (score: number) => {
    if (score >= 70) return 'Excelente';
    if (score >= 50) return 'Bueno';
    if (score >= 30) return 'Regular';
    return 'Bajo';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Efectividad de Canales</h3>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-20 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Efectividad de Canales</h3>
        <div className="text-center py-8">
          <p className="text-red-600">Error al cargar datos de canales</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">📈 Efectividad de Canales</h3>
        <div className="text-sm text-gray-500">
          {data.total_channels} canales activos
        </div>
      </div>

      {/* Mejor canal */}
      {data.best_performing && (
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{getChannelIcon(data.best_performing.channel)}</div>
            <div>
              <h4 className="font-medium text-green-900">Mejor Canal: {data.best_performing.channel}</h4>
              <p className="text-sm text-green-700">
                {data.best_performing.conversion_rate}% de conversión • {data.best_performing.total_leads} leads
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lista de canales */}
      <div className="space-y-4">
        {data.channels.map((channel: ChannelData) => (
          <div key={channel.channel} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="text-xl">{getChannelIcon(channel.channel)}</div>
                <div>
                  <h4 className="font-medium text-gray-900 capitalize">{channel.channel}</h4>
                  <p className="text-sm text-gray-500">{channel.total_leads} leads generados</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPerformanceColor(channel.quality_score)}`}>
                  {getPerformanceLabel(channel.quality_score)}
                </div>
                <div className="text-lg font-bold text-gray-900">{channel.quality_score}</div>
              </div>
            </div>

            {/* Métricas */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-600">{channel.contacted}</div>
                <div className="text-xs text-gray-500">Contactados</div>
                <div className="text-xs text-blue-600">{channel.contact_rate}%</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">{channel.enrolled}</div>
                <div className="text-xs text-gray-500">Matriculados</div>
                <div className="text-xs text-green-600">{channel.conversion_rate}%</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-semibold text-purple-600">{channel.total_leads}</div>
                <div className="text-xs text-gray-500">Total Leads</div>
                <div className="text-xs text-purple-600">100%</div>
              </div>
            </div>

            {/* Barras de progreso */}
            <div className="mt-3 space-y-2">
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Tasa de Contacto</span>
                  <span>{channel.contact_rate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(channel.contact_rate, 100)}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Tasa de Conversión</span>
                  <span>{channel.conversion_rate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(channel.conversion_rate, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Resumen */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-blue-600">
              {data.channels.reduce((sum: number, ch: ChannelData) => sum + ch.total_leads, 0)}
            </div>
            <div className="text-xs text-gray-500">Total Leads</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-green-600">
              {data.channels.reduce((sum: number, ch: ChannelData) => sum + ch.enrolled, 0)}
            </div>
            <div className="text-xs text-gray-500">Total Conversiones</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-purple-600">
              {Math.round(data.channels.reduce((sum: number, ch: ChannelData) => sum + ch.quality_score, 0) / data.channels.length)}
            </div>
            <div className="text-xs text-gray-500">Score Promedio</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelPerformance; 