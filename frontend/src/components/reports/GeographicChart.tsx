import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Treemap
} from 'recharts';
import { MapPin, TrendingUp, Users } from 'lucide-react';

interface GeographicChartProps {
  data: any[];
}

const GeographicChart: React.FC<GeographicChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No hay datos geográficos disponibles</p>
      </div>
    );
  }

  // Ordenar datos por total de prospectos
  const sortedData = [...data].sort((a, b) => b.total_prospectos - a.total_prospectos);
  
  // Top 5 ciudades
  const topCities = sortedData.slice(0, 5);
  
  // Calcular totales
  const totalProspectos = data.reduce((sum, city) => sum + city.total_prospectos, 0);
  const totalMatriculados = data.reduce((sum, city) => sum + city.matriculados, 0);
  const avgConversion = data.reduce((sum, city) => sum + city.tasa_conversion, 0) / data.length;

  // Preparar datos para TreeMap
  const treeMapData = data.map(city => ({
    name: city.ciudad,
    size: city.total_prospectos,
    conversion: city.tasa_conversion
  }));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

  const getColorByConversion = (rate: number) => {
    if (rate >= 30) return '#10B981'; // Verde
    if (rate >= 20) return '#F59E0B'; // Amarillo
    return '#EF4444'; // Rojo
  };

  return (
    <div className="space-y-8">
      {/* KPIs geográficos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="text-sm font-medium text-blue-900">Total Prospectos</h3>
          <p className="text-2xl font-bold text-blue-600">{totalProspectos}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="text-sm font-medium text-green-900">Total Matriculados</h3>
          <p className="text-2xl font-bold text-green-600">{totalMatriculados}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h3 className="text-sm font-medium text-purple-900">Conversión Promedio</h3>
          <p className="text-2xl font-bold text-purple-600">{avgConversion.toFixed(1)}%</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <h3 className="text-sm font-medium text-orange-900">Ciudades Activas</h3>
          <p className="text-2xl font-bold text-orange-600">{data.length}</p>
        </div>
      </div>

      {/* Distribución principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Volumen por ciudad */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Volumen de Prospectos por Ciudad</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={sortedData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="ciudad" type="category" width={100} fontSize={12} />
              <Tooltip />
              <Bar dataKey="total_prospectos" fill="#3B82F6" name="Total Prospectos" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribución circular */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución Porcentual</h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={topCities}
                dataKey="total_prospectos"
                nameKey="ciudad"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label={({ ciudad, total_prospectos }) => {
                  const percentage = ((total_prospectos / totalProspectos) * 100).toFixed(1);
                  return `${ciudad}: ${percentage}%`;
                }}
              >
                {topCities.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Conversión por ciudad */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tasa de Conversión por Ciudad</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={sortedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="ciudad" angle={-45} textAnchor="end" height={100} fontSize={12} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="tasa_conversion" name="Tasa Conversión (%)">
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColorByConversion(entry.tasa_conversion)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Comparativa detallada */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contactados vs Matriculados */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contactados vs Matriculados</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topCities}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ciudad" fontSize={12} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="contactados" fill="#3B82F6" name="Contactados" />
              <Bar dataKey="matriculados" fill="#10B981" name="Matriculados" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Análisis de rendimiento */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rendimiento por Ciudad</h3>
          <div className="space-y-4">
            {topCities.map((city, index) => {
              const conversionLevel = city.tasa_conversion >= 30 ? 'Excelente' : 
                                    city.tasa_conversion >= 20 ? 'Bueno' : 'Regular';
              const conversionColor = conversionLevel === 'Excelente' ? 'text-green-600' :
                                    conversionLevel === 'Bueno' ? 'text-yellow-600' : 'text-red-600';
              
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                      <MapPin className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{city.ciudad}</p>
                      <p className="text-sm text-gray-600">
                        {city.matriculados}/{city.total_prospectos} conversiones
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${conversionColor}`}>
                      {city.tasa_conversion}%
                    </p>
                    <p className="text-xs text-gray-500">{conversionLevel}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top performers geográficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mayor volumen */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Mayor Volumen</h3>
          </div>
          <div className="space-y-3">
            {sortedData.slice(0, 3).map((city, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">#{index + 1} {city.ciudad}</p>
                  <p className="text-sm text-gray-600">{city.total_prospectos} prospectos</p>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">{index + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mejor conversión */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Mejor Conversión</h3>
          </div>
          <div className="space-y-3">
            {[...data].sort((a, b) => b.tasa_conversion - a.tasa_conversion).slice(0, 3).map((city, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">#{index + 1} {city.ciudad}</p>
                  <p className="text-sm text-gray-600">{city.matriculados} matriculados</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">{city.tasa_conversion}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Oportunidades */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <MapPin className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">Oportunidades</h3>
          </div>
          <div className="space-y-3">
            {/* Ciudades con alto volumen pero baja conversión */}
            {sortedData
              .filter(city => city.total_prospectos >= 5 && city.tasa_conversion < 20)
              .slice(0, 3)
              .map((city, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{city.ciudad}</p>
                    <p className="text-sm text-gray-600">Alto volumen, baja conversión</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-orange-600">{city.total_prospectos} leads</p>
                    <p className="text-sm text-orange-600">{city.tasa_conversion}% conv.</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Tabla completa */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalle Completo por Ciudad</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ciudad</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total Prospectos</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Contactados</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Matriculados</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tasa Contacto</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tasa Conversión</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">% del Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedData.map((city, index) => {
                const percentage = ((city.total_prospectos / totalProspectos) * 100).toFixed(1);
                
                return (
                  <tr key={index}>
                    <td className="px-4 py-2 text-sm font-medium text-gray-900">{city.ciudad}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{city.total_prospectos}</td>
                    <td className="px-4 py-2 text-sm text-blue-600">{city.contactados}</td>
                    <td className="px-4 py-2 text-sm text-green-600">{city.matriculados}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{city.tasa_contacto}%</td>
                    <td className="px-4 py-2 text-sm text-purple-600">{city.tasa_conversion}%</td>
                    <td className="px-4 py-2 text-sm text-orange-600">{percentage}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GeographicChart; 