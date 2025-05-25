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
  Legend
} from 'recharts';

interface ProspectsChartProps {
  data: any[];
}

const ProspectsChart: React.FC<ProspectsChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No hay datos disponibles para mostrar</p>
      </div>
    );
  }

  // Procesar datos para gráficos
  const cityData = data.reduce((acc: any, prospect: any) => {
    const city = prospect.ciudad || 'No especificado';
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {});

  const statusData = data.reduce((acc: any, prospect: any) => {
    const status = prospect.estado || 'No especificado';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const channelData = data.reduce((acc: any, prospect: any) => {
    const channel = prospect.origen || 'Directo';
    acc[channel] = (acc[channel] || 0) + 1;
    return acc;
  }, {});

  // Convertir a arrays para gráficos
  const cityChartData = Object.entries(cityData).map(([city, count]) => ({
    ciudad: city,
    cantidad: count
  })).sort((a, b) => b.cantidad - a.cantidad).slice(0, 10);

  const statusChartData = Object.entries(statusData).map(([status, count]) => ({
    estado: status,
    cantidad: count,
    porcentaje: ((count as number) / data.length * 100).toFixed(1)
  }));

  const channelChartData = Object.entries(channelData).map(([channel, count]) => ({
    canal: channel,
    cantidad: count
  })).sort((a, b) => b.cantidad - a.cantidad);

  // Colores para gráficos
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];
  const STATUS_COLORS = {
    'Matriculado': '#10B981',
    'Contactado': '#3B82F6', 
    'Interesado': '#F59E0B',
    'Nuevo': '#6B7280',
    'Descartado': '#EF4444'
  };

  return (
    <div className="space-y-8">
      {/* Header con estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="text-sm font-medium text-blue-900">Total Prospectos</h3>
          <p className="text-2xl font-bold text-blue-600">{data.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="text-sm font-medium text-green-900">Matriculados</h3>
          <p className="text-2xl font-bold text-green-600">
            {data.filter(p => p.estado === 'Matriculado').length}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="text-sm font-medium text-yellow-900">En Proceso</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {data.filter(p => ['Contactado', 'Interesado'].includes(p.estado)).length}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h3 className="text-sm font-medium text-purple-900">Ciudades</h3>
          <p className="text-2xl font-bold text-purple-600">{Object.keys(cityData).length}</p>
        </div>
      </div>

      {/* Gráfico de distribución por ciudades */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Ciudades (Top 10)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={cityChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="ciudad" 
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="cantidad" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráficos de estado y canales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución por Estado */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Estado</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusChartData}
                dataKey="cantidad"
                nameKey="estado"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ estado, porcentaje }) => `${estado}: ${porcentaje}%`}
              >
                {statusChartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={STATUS_COLORS[entry.estado] || COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Distribución por Canal */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Canal</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={channelChartData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="canal" type="category" width={80} fontSize={12} />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla resumen */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen por Canal y Estado</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Canal</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Matriculados</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Contactados</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Conversión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {channelChartData.map((channel, index) => {
                const matriculados = data.filter(p => p.origen === channel.canal && p.estado === 'Matriculado').length;
                const contactados = data.filter(p => p.origen === channel.canal && p.estado === 'Contactado').length;
                const conversion = ((matriculados / channel.cantidad) * 100).toFixed(1);
                
                return (
                  <tr key={index}>
                    <td className="px-4 py-2 text-sm font-medium text-gray-900">{channel.canal}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{channel.cantidad}</td>
                    <td className="px-4 py-2 text-sm text-green-600">{matriculados}</td>
                    <td className="px-4 py-2 text-sm text-blue-600">{contactados}</td>
                    <td className="px-4 py-2 text-sm text-purple-600">{conversion}%</td>
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

export default ProspectsChart; 