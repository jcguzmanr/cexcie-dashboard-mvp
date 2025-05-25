import React, { useState } from 'react';
import { CalendarIcon, FunnelIcon, MapPinIcon, TagIcon } from '@heroicons/react/24/outline';

interface AnalyticsFiltersProps {
  onFiltersChange: (filters: AnalyticsFilters) => void;
  initialFilters?: AnalyticsFilters;
}

export interface AnalyticsFilters {
  dateRange: {
    start: string;
    end: string;
  };
  period: 'day' | 'week' | 'month';
  channels: string[];
  cities: string[];
  status: string[];
}

const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({ 
  onFiltersChange, 
  initialFilters 
}) => {
  const [filters, setFilters] = useState<AnalyticsFilters>(
    initialFilters || {
      dateRange: { start: '', end: '' },
      period: 'month',
      channels: [],
      cities: [],
      status: []
    }
  );

  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof AnalyticsFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleArrayFilterChange = (key: 'channels' | 'cities' | 'status', value: string) => {
    const currentArray = filters[key];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    handleFilterChange(key, newArray);
  };

  const clearFilters = () => {
    const clearedFilters: AnalyticsFilters = {
      dateRange: { start: '', end: '' },
      period: 'month',
      channels: [],
      cities: [],
      status: []
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const availableChannels = [
    'Facebook', 'Instagram', 'Google', 'Website', 
    'Referido', 'Directo', 'WhatsApp', 'Email'
  ];

  const availableCities = [
    'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 
    'Cartagena', 'Bucaramanga', 'Pereira', 'Manizales'
  ];

  const availableStatus = [
    'Nuevo', 'Contactado', 'En proceso', 'Matriculado', 'No interesado'
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FunnelIcon className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900">Filtros de Análisis</h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          {isExpanded ? 'Ocultar filtros' : 'Mostrar filtros'}
        </button>
      </div>

      {/* Filtros básicos - siempre visibles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <CalendarIcon className="w-4 h-4 inline mr-1" />
            Período
          </label>
          <select
            value={filters.period}
            onChange={(e) => handleFilterChange('period', e.target.value as 'day' | 'week' | 'month')}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="day">Últimos 30 días</option>
            <option value="week">Últimas 12 semanas</option>
            <option value="month">Últimos 12 meses</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha inicio
          </label>
          <input
            type="date"
            value={filters.dateRange.start}
            onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, start: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha fin
          </label>
          <input
            type="date"
            value={filters.dateRange.end}
            onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, end: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Filtros avanzados - expandibles */}
      {isExpanded && (
        <div className="space-y-6 pt-4 border-t border-gray-200">
          {/* Canales */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <TagIcon className="w-4 h-4 inline mr-1" />
              Canales de Origen
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {availableChannels.map((channel) => (
                <label key={channel} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.channels.includes(channel)}
                    onChange={() => handleArrayFilterChange('channels', channel)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{channel}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Ciudades */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <MapPinIcon className="w-4 h-4 inline mr-1" />
              Ciudades
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {availableCities.map((city) => (
                <label key={city} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.cities.includes(city)}
                    onChange={() => handleArrayFilterChange('cities', city)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{city}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Estados */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Estado del Prospecto
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {availableStatus.map((status) => (
                <label key={status} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.status.includes(status)}
                    onChange={() => handleArrayFilterChange('status', status)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{status}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Acciones */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Limpiar Filtros
            </button>
            <button
              onClick={() => setIsExpanded(false)}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      )}

      {/* Resumen de filtros activos */}
      {(filters.channels.length > 0 || filters.cities.length > 0 || filters.status.length > 0) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {filters.channels.map((channel) => (
              <span
                key={`channel-${channel}`}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {channel}
                <button
                  onClick={() => handleArrayFilterChange('channels', channel)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
            {filters.cities.map((city) => (
              <span
                key={`city-${city}`}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
              >
                {city}
                <button
                  onClick={() => handleArrayFilterChange('cities', city)}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            ))}
            {filters.status.map((status) => (
              <span
                key={`status-${status}`}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
              >
                {status}
                <button
                  onClick={() => handleArrayFilterChange('status', status)}
                  className="ml-1 text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsFilters; 