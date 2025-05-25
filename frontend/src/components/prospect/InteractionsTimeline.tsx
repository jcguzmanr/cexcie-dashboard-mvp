import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Interaction {
  id: string;
  module: string;
  action: string;
  device_id: string;
  status: string;
  timestamp: string;
  flow_order: string;
}

interface InteractionsTimelineProps {
  interactions: Interaction[];
  isLoading?: boolean;
}

const InteractionsTimeline: React.FC<InteractionsTimelineProps> = ({
  interactions,
  isLoading = false
}) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: es });
    } catch {
      return dateString;
    }
  };

  const getModuleIcon = (module: string) => {
    const icons = {
      'test': '📝',
      'video': '🎥',
      'experiencia': '🎯',
      'navegacion': '🧭',
      'default': '💫'
    };
    return icons[module as keyof typeof icons] || icons.default;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'completado': 'bg-green-100 text-green-800',
      'en_progreso': 'bg-yellow-100 text-yellow-800',
      'iniciado': 'bg-blue-100 text-blue-800',
      'cancelado': 'bg-red-100 text-red-800',
      'default': 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || colors.default;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-start space-x-4">
              <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (interactions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">💬</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Sin interacciones</h3>
        <p className="text-gray-500">No hay interacciones registradas para este prospecto.</p>
      </div>
    );
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {interactions.map((interaction, index) => (
          <li key={interaction.id}>
            <div className="relative pb-8">
              {index !== interactions.length - 1 && (
                <span 
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" 
                  aria-hidden="true" 
                />
              )}
              <div className="relative flex space-x-3">
                <div>
                  <span className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center ring-8 ring-white">
                    <span className="text-lg">{getModuleIcon(interaction.module)}</span>
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {interaction.action || 'Acción no especificada'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Módulo: {interaction.module || 'No especificado'}
                      </p>
                      {interaction.device_id && (
                        <p className="text-xs text-gray-400">
                          Dispositivo: {interaction.device_id}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(interaction.status)}`}>
                        {interaction.status || 'Sin estado'}
                      </span>
                      <time className="text-xs text-gray-400">
                        {formatDate(interaction.timestamp)}
                      </time>
                    </div>
                  </div>
                  {interaction.flow_order && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                        Paso {interaction.flow_order}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InteractionsTimeline; 