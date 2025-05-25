import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
  ScatterChart,
  Scatter,
  Cell
} from 'recharts';
import { Award, AlertTriangle, Star } from 'lucide-react';

interface ChannelsChartProps {
  data: any[];
}

const ChannelsChart: React.FC<ChannelsChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No hay datos de canales disponibles</p>
      </div>
    );
  }

  // Ordenar datos por score de calidad
  const sortedData = [...data].sort((a, b) => b.score_calidad - a.score_calidad);
  
  // Clasificar canales por rendimiento
  const excellent = sortedData.filter(ch => ch.score_calidad >= 30);
  const good = sortedData.filter(ch => ch.score_calidad >= 20 && ch.score_calidad < 30);
  const needsImprovement = sortedData.filter(ch => ch.score_calidad < 20);

  // Preparar datos para gráfico de dispersión (volumen vs conversión)
  const scatterData = data.map(channel => ({
    x: channel.total_leads,
    y: channel.tasa_conversion,
    canal: channel.canal,
    score: channel.score_calidad
  }));

  // Colores por rendimiento
  const getChannelColor = (score: number) => {
    if (score >= 30) return '#10B981'; // Verde
    if (score >= 20) return '#F59E0B'; // Amarillo
    return '#EF4444'; // Rojo
  };

  const getChannelBadge = (score: number) => {
    if (score >= 30) return { icon: Award, text: 'Excelente', color: 'text-green-600 bg-green-100' };
    if (score >= 20) return { icon: Star, text: 'Bueno', color: 'text-yellow-600 bg-yellow-100' };
    return { icon: AlertTriangle, text: 'Mejorar', color: 'text-red-600 bg-red-100' };
  };

  // Calcular totales
  const totalLeads = data.reduce((sum, ch) => sum + ch.total_leads, 0);
  const totalMatriculados = data.reduce((sum, ch) => sum + ch.matriculados, 0);
  const avgConversion = data.reduce((sum, ch) => sum + ch.tasa_conversion, 0) / data.length;

  return (
    <div className="space-y-8">
      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="text-sm font-medium text-blue-900">Total Leads</h3>
          <p className="text-2xl font-bold text-blue-600">{totalLeads}</p>
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
          <h3 className="text-sm font-medium text-orange-900">Canales Activos</h3>
          <p className="text-2xl font-bold text-orange-600">{data.length}</p>
        </div>
      </div>

      {/* Ranking de canales */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ranking de Efectividad (Score de Calidad)</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={sortedData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="canal" type="category" width={100} fontSize={12} />
            <Tooltip 
              formatter={(value, name) => [
                `${value}${name === 'score_calidad' ? ' pts' : '%'}`, 
                name === 'score_calidad' ? 'Score de Calidad' : 'Tasa Conversión'
              ]}
            />
            <Bar dataKey="score_calidad" name="Score de Calidad">
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getChannelColor(entry.score_calidad)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Análisis de volumen vs conversión */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Volumen vs Tasa de Conversión</h3>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart data={scatterData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="x" 
              name="Total Leads" 
              type="number"
              label={{ value: 'Total Leads', position: 'insideBottom', offset: -10 }}
            />
            <YAxis 
              dataKey="y" 
              name="Tasa Conversión (%)" 
              type="number"
              label={{ value: 'Tasa Conversión (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value, name, props) => [
                `${value}${name === 'x' ? ' leads' : '%'}`,
                name === 'x' ? 'Total Leads' : 'Tasa Conversión',
                `Canal: ${props.payload.canal}`
              ]}
            />
            <Scatter dataKey="y" fill="#3B82F6">
              {scatterData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getChannelColor(entry.score)} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        <div className="mt-4 text-sm text-gray-600">
          <p>💡 <strong>Interpretación:</strong> Los canales en la esquina superior derecha son ideales (alto volumen + alta conversión). 
          Los de la esquina superior izquierda tienen buena conversión pero bajo volumen.</p>
        </div>
      </div>

      {/* Comparativa detallada */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasas de conversión */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tasa de Conversión</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="canal" angle={-45} textAnchor="end" height={80} fontSize={10} />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}%`, 'Conversión']} />
              <Bar dataKey="tasa_conversion" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tasa de contacto */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tasa de Contacto</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="canal" angle={-45} textAnchor="end" height={80} fontSize={10} />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}%`, 'Contacto']} />
              <Bar dataKey="tasa_contacto" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Volumen total */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Volumen de Leads</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="canal" angle={-45} textAnchor="end" height={80} fontSize={10} />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}`, 'Leads']} />
              <Bar dataKey="total_leads" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Clasificación por rendimiento */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Canales excelentes */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <Award className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Canales Excelentes</h3>
          </div>
          {excellent.length > 0 ? (
            <div className="space-y-3">
              {excellent.map((channel, index) => (
                <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{channel.canal}</p>
                      <p className="text-sm text-gray-600">
                        {channel.matriculados}/{channel.total_leads} conversiones
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">{channel.score_calidad}</p>
                      <p className="text-xs text-green-500">pts</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No hay canales en esta categoría</p>
          )}
        </div>

        {/* Canales buenos */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <Star className="w-5 h-5 text-yellow-600" />
            <h3 className="text-lg font-semibold text-gray-900">Canales Buenos</h3>
          </div>
          {good.length > 0 ? (
            <div className="space-y-3">
              {good.map((channel, index) => (
                <div key={index} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{channel.canal}</p>
                      <p className="text-sm text-gray-600">
                        {channel.matriculados}/{channel.total_leads} conversiones
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-yellow-600">{channel.score_calidad}</p>
                      <p className="text-xs text-yellow-500">pts</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No hay canales en esta categoría</p>
          )}
        </div>

        {/* Canales por mejorar */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900">Por Mejorar</h3>
          </div>
          {needsImprovement.length > 0 ? (
            <div className="space-y-3">
              {needsImprovement.map((channel, index) => (
                <div key={index} className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{channel.canal}</p>
                      <p className="text-sm text-gray-600">
                        {channel.matriculados}/{channel.total_leads} conversiones
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-red-600">{channel.score_calidad}</p>
                      <p className="text-xs text-red-500">pts</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No hay canales en esta categoría</p>
          )}
        </div>
      </div>

      {/* Tabla detallada */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalle Completo por Canal</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Canal</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total Leads</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Contactados</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Matriculados</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tasa Contacto</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tasa Conversión</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Score Calidad</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nivel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedData.map((channel, index) => {
                const badge = getChannelBadge(channel.score_calidad);
                const IconComponent = badge.icon;
                
                return (
                  <tr key={index}>
                    <td className="px-4 py-2 text-sm font-medium text-gray-900">{channel.canal}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{channel.total_leads}</td>
                    <td className="px-4 py-2 text-sm text-blue-600">{channel.contactados}</td>
                    <td className="px-4 py-2 text-sm text-green-600">{channel.matriculados}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{channel.tasa_contacto}%</td>
                    <td className="px-4 py-2 text-sm text-purple-600">{channel.tasa_conversion}%</td>
                    <td className="px-4 py-2 text-sm font-bold" style={{ color: getChannelColor(channel.score_calidad) }}>
                      {channel.score_calidad}
                    </td>
                    <td className="px-4 py-2">
                      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                        <IconComponent className="w-3 h-3" />
                        <span>{badge.text}</span>
                      </div>
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

export default ChannelsChart; 