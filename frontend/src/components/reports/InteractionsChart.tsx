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
import { Activity, Clock, MousePointerClick, Smartphone } from 'lucide-react';

interface InteractionsChartProps {
  data: any[];
}

const InteractionsChart: React.FC<InteractionsChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No hay datos de interacciones disponibles</p>
      </div>
    );
  }

  // Procesar datos para análisis
  const moduleData = data.reduce((acc: any, interaction: any) => {
    const module = interaction.modulo || 'Sin módulo';
    acc[module] = (acc[module] || 0) + 1;
    return acc;
  }, {});

  const actionData = data.reduce((acc: any, interaction: any) => {
    const action = interaction.accion || 'Sin acción';
    acc[action] = (acc[action] || 0) + 1;
    return acc;
  }, {});

  const deviceData = data.reduce((acc: any, interaction: any) => {
    const device = interaction.dispositivo_id || 'Desconocido';
    acc[device] = (acc[device] || 0) + 1;
    return acc;
  }, {});

  const statusData = data.reduce((acc: any, interaction: any) => {
    const status = interaction.estado || 'Sin estado';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Convertir a arrays para gráficos
  const moduleChartData = Object.entries(moduleData).map(([module, count]) => ({
    modulo: module,
    cantidad: count
  })).sort((a, b) => b.cantidad - a.cantidad);

  const actionChartData = Object.entries(actionData).map(([action, count]) => ({
    accion: action,
    cantidad: count
  })).sort((a, b) => b.cantidad - a.cantidad);

  const deviceChartData = Object.entries(deviceData).map(([device, count]) => ({
    dispositivo: device,
    cantidad: count
  })).sort((a, b) => b.cantidad - a.cantidad);

  const statusChartData = Object.entries(statusData).map(([status, count]) => ({
    estado: status,
    cantidad: count
  }));

  // Análisis temporal (agrupar por día)
  const temporalData = data.reduce((acc: any, interaction: any) => {
    if (interaction.timestamp) {
      const date = new Date(interaction.timestamp).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
    }
    return acc;
  }, {});

  const timelineData = Object.entries(temporalData)
    .map(([date, count]) => ({
      fecha: date,
      interacciones: count
    }))
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .slice(-30); // Últimos 30 días

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

  // Calcular estadísticas
  const uniqueProspects = new Set(data.map(i => i.prospecto_id)).size;
  const avgInteractionsPerProspect = (data.length / uniqueProspects).toFixed(1);

  return (
    <div className="space-y-8">
      {/* KPIs de interacciones */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-900">Total Interacciones</h3>
              <p className="text-2xl font-bold text-blue-600">{data.length}</p>
            </div>
            <Activity className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-green-900">Prospectos Únicos</h3>
              <p className="text-2xl font-bold text-green-600">{uniqueProspects}</p>
            </div>
            <MousePointerClick className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-purple-900">Promedio por Prospecto</h3>
              <p className="text-2xl font-bold text-purple-600">{avgInteractionsPerProspect}</p>
            </div>
            <Clock className="w-8 h-8 text-purple-400" />
          </div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-orange-900">Módulos Activos</h3>
              <p className="text-2xl font-bold text-orange-600">{moduleChartData.length}</p>
            </div>
            <Smartphone className="w-8 h-8 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Tendencia temporal */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencia de Interacciones (Últimos 30 días)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" fontSize={12} />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="interacciones" 
              stroke="#3B82F6" 
              strokeWidth={2}
              name="Interacciones"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Análisis por módulos y acciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Interacciones por módulo */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Interacciones por Módulo</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={moduleChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="modulo" fontSize={12} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Interacciones por acción */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tipos de Acción</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={actionChartData.slice(0, 6)}
                dataKey="cantidad"
                nameKey="accion"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ accion, cantidad }) => `${accion}: ${cantidad}`}
              >
                {actionChartData.slice(0, 6).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Análisis de dispositivos y estados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Distribución por dispositivos */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Dispositivos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={deviceChartData.slice(0, 10)} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="dispositivo" type="category" width={100} fontSize={10} />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Estados de interacciones */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Estados de Interacciones</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusChartData}
                dataKey="cantidad"
                nameKey="estado"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ estado, cantidad }) => `${estado}: ${cantidad}`}
              >
                {statusChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top módulos y acciones */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top módulos */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📱 Top Módulos</h3>
          <div className="space-y-3">
            {moduleChartData.slice(0, 5).map((module, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{module.modulo}</p>
                  <p className="text-sm text-gray-600">
                    {((module.cantidad / data.length) * 100).toFixed(1)}% del total
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">{module.cantidad}</p>
                  <p className="text-xs text-blue-500">interacciones</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top acciones */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Top Acciones</h3>
          <div className="space-y-3">
            {actionChartData.slice(0, 5).map((action, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{action.accion}</p>
                  <p className="text-sm text-gray-600">
                    {((action.cantidad / data.length) * 100).toFixed(1)}% del total
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">{action.cantidad}</p>
                  <p className="text-xs text-green-500">veces</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights de comportamiento */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🔍 Insights</h3>
          <div className="space-y-4">
            {/* Módulo más popular */}
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">📱 Módulo más usado</p>
                  <p className="text-xs text-gray-600">
                    {moduleChartData[0]?.modulo}: {moduleChartData[0]?.cantidad} interacciones
                  </p>
                </div>
              </div>
            </div>

            {/* Acción más común */}
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">⚡ Acción más común</p>
                  <p className="text-xs text-gray-600">
                    {actionChartData[0]?.accion}: {actionChartData[0]?.cantidad} veces
                  </p>
                </div>
              </div>
            </div>

            {/* Engagement promedio */}
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">📊 Engagement</p>
                  <p className="text-xs text-gray-600">
                    {avgInteractionsPerProspect} interacciones por prospecto
                  </p>
                </div>
              </div>
            </div>

            {/* Actividad recent */}
            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">🕒 Actividad reciente</p>
                  <p className="text-xs text-gray-600">
                    {timelineData.slice(-7).reduce((sum, day) => sum + day.interacciones, 0)} interacciones últimos 7 días
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla detallada */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen Detallado</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tabla de módulos */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-3">Interacciones por Módulo</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Módulo</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {moduleChartData.map((module, index) => (
                    <tr key={index}>
                      <td className="px-3 py-2 text-sm font-medium text-gray-900">{module.modulo}</td>
                      <td className="px-3 py-2 text-sm text-blue-600">{module.cantidad}</td>
                      <td className="px-3 py-2 text-sm text-gray-600">
                        {((module.cantidad / data.length) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tabla de acciones */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-3">Tipos de Acción</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Acción</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {actionChartData.map((action, index) => (
                    <tr key={index}>
                      <td className="px-3 py-2 text-sm font-medium text-gray-900">{action.accion}</td>
                      <td className="px-3 py-2 text-sm text-green-600">{action.cantidad}</td>
                      <td className="px-3 py-2 text-sm text-gray-600">
                        {((action.cantidad / data.length) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractionsChart; 