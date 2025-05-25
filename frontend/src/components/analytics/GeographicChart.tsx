import React from 'react';
import { useGeographicDistribution } from '../../hooks/useAnalytics';

interface CityData {
  city: string;
  total_prospects: number;
  enrolled: number;
  conversion_rate: number;
}

const GeographicChart: React.FC = () => {
  const { data, isLoading, isError } = useGeographicDistribution();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🌎 Distribución Geográfica</h3>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🌎 Distribución Geográfica</h3>
        <div className="text-center py-8">
          <p className="text-red-600">Error al cargar datos geográficos</p>
        </div>
      </div>
    );
  }

  const maxProspects = Math.max(...data.cities.map((city: CityData) => city.total_prospects));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">🌎 Distribución Geográfica</h3>
        <div className="text-sm text-gray-500">
          {data.total_cities} ciudades registradas
        </div>
      </div>

      {/* Top 5 ciudades */}
      <div className="space-y-4 mb-6">
        <h4 className="text-sm font-medium text-gray-700">Top 5 Ciudades</h4>
        {data.top_cities.map((city: CityData, index: number) => {
          const widthPercentage = (city.total_prospects / maxProspects) * 100;
          
          return (
            <div key={city.city} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">
                    #{index + 1} {city.city}
                  </span>
                  <span className="text-xs text-gray-500">
                    {city.conversion_rate}% conversión
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-green-600 font-medium">
                    {city.enrolled} matriculados
                  </span>
                  <span className="text-sm text-gray-600">
                    {city.total_prospects} prospects
                  </span>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${widthPercentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Estadísticas generales */}
      <div className="border-t border-gray-200 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {data.cities.reduce((sum: number, city: CityData) => sum + city.total_prospects, 0)}
            </div>
            <div className="text-xs text-gray-500">Total Prospectos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {data.cities.reduce((sum: number, city: CityData) => sum + city.enrolled, 0)}
            </div>
            <div className="text-xs text-gray-500">Total Matriculados</div>
          </div>
        </div>
      </div>

      {/* Lista completa (si hay más de 5) */}
      {data.cities.length > 5 && (
        <div className="mt-6">
          <details className="group">
            <summary className="cursor-pointer text-sm text-primary-600 hover:text-primary-700">
              Ver todas las ciudades ({data.cities.length - 5} más)
            </summary>
            <div className="mt-3 space-y-2 text-sm">
              {data.cities.slice(5).map((city: CityData) => (
                <div key={city.city} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0">
                  <span className="text-gray-700">{city.city}</span>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>{city.enrolled}/{city.total_prospects}</span>
                    <span>({city.conversion_rate}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </details>
        </div>
      )}
    </div>
  );
};

export default GeographicChart; 