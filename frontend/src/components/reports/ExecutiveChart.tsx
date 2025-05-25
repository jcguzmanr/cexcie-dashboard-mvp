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
  LineChart,
  Line,
  Legend
} from 'recharts';
import { TrendingUp, Users, Target, Globe } from 'lucide-react';

interface ExecutiveChartProps {
  data: {
    kpis: {
      total_prospects: number;
      total_enrolled: number;
      conversion_rate: number;
      avg_conversion_time: number;
    };
    top_channels: Array<{
      canal: string;
      total: number;
      matriculados: number;
      conversion_rate: number;
    }>;
    top_cities: Array<{
      ciudad: string;
      total: number;
    }>;
  };
}

const ExecutiveChart: React.FC<ExecutiveChartProps> = ({ data }) => {
  if (!data || !data.kpis) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No hay datos ejecutivos disponibles</p>
      </div>
    );
  }

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  // Simular tendencia temporal para el dashboard ejecutivo
  const trendData = [
    { mes: 'Ene', prospects: 12, matriculados: 3 },
    { mes: 'Feb', prospects: 18, matriculados: 4 },
    { mes: 'Mar', prospects: 22, matriculados: 6 },
    { mes: 'Abr', prospects: 28, matriculados: 7 },
    { mes: 'May', prospects: 20, matriculados: 4 }
  ];

  return (
    <div className="space-y-8">
      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Prospectos</p>
              <p className="text-3xl font-bold">{data.kpis.total_prospects}</p>
            </div>
            <Users className="w-8 h-8 text-blue-200" />
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
            <span className="text-sm text-blue-100">+12% vs mes anterior</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Matriculados</p>
              <p className="text-3xl font-bold">{data.kpis.total_enrolled}</p>
            </div>
            <Target className="w-8 h-8 text-green-200" />
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
            <span className="text-sm text-green-100">+8% vs mes anterior</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Tasa Conversión</p>
              <p className="text-3xl font-bold">{data.kpis.conversion_rate}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-200" />
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-purple-300 mr-1" />
            <span className="text-sm text-purple-100">Meta: 25%</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Tiempo Conversión</p>
              <p className="text-3xl font-bold">{data.kpis.avg_conversion_time}</p>
              <p className="text-orange-100 text-xs">días promedio</p>
            </div>
            <Globe className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Rendimiento por canales */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Canales de Adquisición</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.top_channels}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="canal" fontSize={12} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#3B82F6" name="Total Leads" />
              <Bar dataKey="matriculados" fill="#10B981" name="Matriculados" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribución por ciudades */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución Geográfica</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.top_cities}
                dataKey="total"
                nameKey="ciudad"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ ciudad, total }) => `${ciudad}: ${total}`}
              >
                {data.top_cities.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tendencia temporal */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencia de Adquisición y Conversión</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="prospects" 
              stroke="#3B82F6" 
              strokeWidth={3}
              name="Nuevos Prospectos"
            />
            <Line 
              type="monotone" 
              dataKey="matriculados" 
              stroke="#10B981" 
              strokeWidth={3}
              name="Matriculados"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Métricas detalladas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resumen de conversión por canal */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversión por Canal</h3>
          <div className="space-y-3">
            {data.top_channels.map((channel, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">{channel.canal}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{channel.conversion_rate}%</p>
                  <p className="text-xs text-gray-500">{channel.matriculados}/{channel.total}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top ciudades */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Principales Ciudades</h3>
          <div className="space-y-3">
            {data.top_cities.slice(0, 5).map((city, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-gray-600">{index + 1}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{city.ciudad}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{city.total}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alertas y insights */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights Clave</h3>
          <div className="space-y-4">
            {/* Alerta de conversión */}
            <div className={`p-3 rounded-lg ${
              data.kpis.conversion_rate >= 25 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-yellow-50 border border-yellow-200'
            }`}>
              <div className="flex items-start space-x-2">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  data.kpis.conversion_rate >= 25 ? 'bg-green-500' : 'bg-yellow-500'
                }`}></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {data.kpis.conversion_rate >= 25 ? '✅ Meta alcanzada' : '⚠️ Meta no alcanzada'}
                  </p>
                  <p className="text-xs text-gray-600">
                    Conversión actual: {data.kpis.conversion_rate}% (Meta: 25%)
                  </p>
                </div>
              </div>
            </div>

            {/* Mejor canal */}
            {data.top_channels.length > 0 && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">🏆 Mejor canal</p>
                    <p className="text-xs text-gray-600">
                      {data.top_channels[0].canal}: {data.top_channels[0].conversion_rate}% conversión
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Velocidad de conversión */}
            <div className={`p-3 rounded-lg ${
              data.kpis.avg_conversion_time <= 20 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-orange-50 border border-orange-200'
            }`}>
              <div className="flex items-start space-x-2">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  data.kpis.avg_conversion_time <= 20 ? 'bg-green-500' : 'bg-orange-500'
                }`}></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {data.kpis.avg_conversion_time <= 20 ? '⚡ Conversión rápida' : '🐌 Conversión lenta'}
                  </p>
                  <p className="text-xs text-gray-600">
                    Promedio: {data.kpis.avg_conversion_time} días
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla ejecutiva */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen Ejecutivo por Canal</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Canal</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total Leads</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Matriculados</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tasa Conversión</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ROI Estimado</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.top_channels.map((channel, index) => {
                const roi = (channel.matriculados * 1500) / (channel.total * 50); // Estimación simple
                const status = channel.conversion_rate >= 25 ? 'Excelente' : 
                             channel.conversion_rate >= 15 ? 'Bueno' : 'Mejorar';
                const statusColor = status === 'Excelente' ? 'text-green-600 bg-green-100' :
                                  status === 'Bueno' ? 'text-yellow-600 bg-yellow-100' :
                                  'text-red-600 bg-red-100';

                return (
                  <tr key={index}>
                    <td className="px-4 py-2 text-sm font-medium text-gray-900">{channel.canal}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{channel.total}</td>
                    <td className="px-4 py-2 text-sm text-green-600">{channel.matriculados}</td>
                    <td className="px-4 py-2 text-sm text-purple-600">{channel.conversion_rate}%</td>
                    <td className="px-4 py-2 text-sm text-blue-600">{roi.toFixed(1)}x</td>
                    <td className="px-4 py-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColor}`}>
                        {status}
                      </span>
                    </td>
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

export default ExecutiveChart; 