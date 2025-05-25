import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  FunnelChart,
  Funnel,
  LabelList
} from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ConversionsChartProps {
  data: {
    funnel_data: any[];
    channel_conversion: any[];
  };
}

const ConversionsChart: React.FC<ConversionsChartProps> = ({ data }) => {
  if (!data || !data.funnel_data || !data.channel_conversion) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No hay datos de conversión disponibles</p>
      </div>
    );
  }

  // Crear datos del embudo de conversión
  const funnelSteps = [
    { name: 'Nuevo', value: 0, color: '#6B7280' },
    { name: 'Contactado', value: 0, color: '#3B82F6' },
    { name: 'Interesado', value: 0, color: '#F59E0B' },
    { name: 'Matriculado', value: 0, color: '#10B981' }
  ];

  // Procesar datos del embudo
  data.funnel_data.forEach(item => {
    const step = funnelSteps.find(s => s.name === item.estado);
    if (step) {
      step.value += item.cantidad;
    }
  });

  // Ordenar embudo por valor descendente
  funnelSteps.sort((a, b) => b.value - a.value);

  // Calcular tasas de conversión entre pasos
  const conversionRates = [];
  for (let i = 1; i < funnelSteps.length; i++) {
    const current = funnelSteps[i].value;
    const previous = funnelSteps[i - 1].value;
    const rate = previous > 0 ? ((current / previous) * 100).toFixed(1) : '0';
    conversionRates.push({
      from: funnelSteps[i - 1].name,
      to: funnelSteps[i].name,
      rate: parseFloat(rate)
    });
  }

  // Datos temporales (agrupar por período)
  const temporalData = data.funnel_data.reduce((acc: any, item) => {
    if (!acc[item.periodo]) {
      acc[item.periodo] = { periodo: item.periodo, total: 0, matriculados: 0 };
    }
    acc[item.periodo].total += item.cantidad;
    if (item.estado === 'Matriculado') {
      acc[item.periodo].matriculados += item.cantidad;
    }
    return acc;
  }, {});

  const timelineData = Object.values(temporalData).map((item: any) => ({
    ...item,
    conversion_rate: item.total > 0 ? ((item.matriculados / item.total) * 100).toFixed(1) : 0
  })).sort((a: any, b: any) => a.periodo.localeCompare(b.periodo));

  // Mejores y peores canales
  const sortedChannels = [...data.channel_conversion].sort((a, b) => b.tasa_conversion - a.tasa_conversion);
  const bestChannels = sortedChannels.slice(0, 3);
  const worstChannels = sortedChannels.slice(-3).reverse();

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  return (
    <div className="space-y-8">
      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="text-sm font-medium text-blue-900">Total Leads</h3>
          <p className="text-2xl font-bold text-blue-600">
            {data.channel_conversion.reduce((sum, ch) => sum + ch.total_leads, 0)}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="text-sm font-medium text-green-900">Total Matriculados</h3>
          <p className="text-2xl font-bold text-green-600">
            {data.channel_conversion.reduce((sum, ch) => sum + ch.matriculados, 0)}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h3 className="text-sm font-medium text-purple-900">Tasa Conversión Promedio</h3>
          <p className="text-2xl font-bold text-purple-600">
            {(data.channel_conversion.reduce((sum, ch) => sum + ch.tasa_conversion, 0) / data.channel_conversion.length).toFixed(1)}%
          </p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <h3 className="text-sm font-medium text-orange-900">Canales Activos</h3>
          <p className="text-2xl font-bold text-orange-600">{data.channel_conversion.length}</p>
        </div>
      </div>

      {/* Embudo de conversión */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Embudo de Conversión</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de embudo */}
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={funnelSteps} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Tasas de conversión entre pasos */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Tasas de Conversión</h4>
            {conversionRates.map((rate, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-sm text-gray-600">{rate.from} → {rate.to}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {rate.rate > 25 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : rate.rate > 15 ? (
                    <Minus className="w-4 h-4 text-yellow-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`font-semibold ${
                    rate.rate > 25 ? 'text-green-600' : 
                    rate.rate > 15 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {rate.rate}%
                  </span>
                </div>
              </div>
            ))}
            
            {/* Distribución por estado */}
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-3">Distribución por Estado</h4>
              <div className="space-y-2">
                {funnelSteps.map((step, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: step.color }}
                      ></div>
                      <span className="text-sm text-gray-600">{step.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{step.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Evolución temporal */}
      {timelineData.length > 1 && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolución Temporal</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="periodo" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="total" fill="#3B82F6" name="Total Leads" />
              <Bar yAxisId="left" dataKey="matriculados" fill="#10B981" name="Matriculados" />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="conversion_rate" 
                stroke="#F59E0B" 
                strokeWidth={3}
                name="Tasa Conversión (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Análisis por canal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversión por canal */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversión por Canal</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.channel_conversion}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="canal" angle={-45} textAnchor="end" height={80} fontSize={12} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="tasa_conversion" fill="#8B5CF6" name="Tasa Conversión (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Volumen por canal */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Volumen por Canal</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.channel_conversion}
                dataKey="total_leads"
                nameKey="canal"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ canal, total_leads }) => `${canal}: ${total_leads}`}
              >
                {data.channel_conversion.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mejores canales */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🏆 Mejores Canales</h3>
          <div className="space-y-3">
            {bestChannels.map((channel, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div>
                  <p className="font-medium text-gray-900">{channel.canal}</p>
                  <p className="text-sm text-gray-600">{channel.matriculados} de {channel.total_leads} leads</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">{channel.tasa_conversion}%</p>
                  <div className="flex items-center text-green-500">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Canales por mejorar */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">⚠️ Canales por Mejorar</h3>
          <div className="space-y-3">
            {worstChannels.map((channel, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <p className="font-medium text-gray-900">{channel.canal}</p>
                  <p className="text-sm text-gray-600">{channel.matriculados} de {channel.total_leads} leads</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-red-600">{channel.tasa_conversion}%</p>
                  <div className="flex items-center text-red-500">
                    <TrendingDown className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversionsChart; 