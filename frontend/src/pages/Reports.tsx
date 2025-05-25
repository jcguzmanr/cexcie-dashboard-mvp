import React, { useState } from 'react';
import { DocumentArrowDownIcon, CalendarIcon, ChartBarIcon, UsersIcon, FunnelIcon, MapPinIcon, EyeIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { reportsApi } from '../services/api';

// Import chart components
import ProspectsChart from '../components/reports/ProspectsChart';
import ConversionsChart from '../components/reports/ConversionsChart';
import ChannelsChart from '../components/reports/ChannelsChart';
import GeographicChart from '../components/reports/GeographicChart';
import InteractionsChart from '../components/reports/InteractionsChart';
import ExecutiveChart from '../components/reports/ExecutiveChart';

interface ReportFilter {
  startDate: string;
  endDate: string;
  city: string;
  channel: string;
  status: string;
}

interface ReportType {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  estimatedSize: string;
}

const Reports: React.FC = () => {
  const [selectedReportType, setSelectedReportType] = useState<string>('');
  const [filters, setFilters] = useState<ReportFilter>({
    startDate: '',
    endDate: '',
    city: '',
    channel: '',
    status: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'charts' | 'download'>('charts');

  const reportTypes: ReportType[] = [
    {
      id: 'prospects',
      title: 'Reporte de Prospectos',
      description: 'Lista completa de prospectos con información detallada, estado y datos de contacto',
      icon: <UsersIcon className="w-6 h-6" />,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      estimatedSize: '~2-5 MB'
    },
    {
      id: 'conversions',
      title: 'Reporte de Conversiones',
      description: 'Análisis detallado del embudo de conversión y tasas de éxito por período',
      icon: <FunnelIcon className="w-6 h-6" />,
      color: 'text-green-600 bg-green-50 border-green-200',
      estimatedSize: '~1-2 MB'
    },
    {
      id: 'channels',
      title: 'Efectividad de Canales',
      description: 'Análisis comparativo de rendimiento por canal de adquisición',
      icon: <ChartBarIcon className="w-6 h-6" />,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      estimatedSize: '~800 KB'
    },
    {
      id: 'geographic',
      title: 'Distribución Geográfica',
      description: 'Análisis por ciudades y regiones con mapas de calor',
      icon: <MapPinIcon className="w-6 h-6" />,
      color: 'text-orange-600 bg-orange-50 border-orange-200',
      estimatedSize: '~1-3 MB'
    },
    {
      id: 'interactions',
      title: 'Reporte de Interacciones',
      description: 'Detalle de todas las interacciones, tests y asesorías por prospecto',
      icon: <DocumentArrowDownIcon className="w-6 h-6" />,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      estimatedSize: '~3-8 MB'
    },
    {
      id: 'executive',
      title: 'Reporte Ejecutivo',
      description: 'Resumen ejecutivo con KPIs principales y tendencias',
      icon: <ChartBarIcon className="w-6 h-6" />,
      color: 'text-red-600 bg-red-50 border-red-200',
      estimatedSize: '~500 KB'
    }
  ];

  const cities = ['Todas', 'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena'];
  const channels = ['Todos', 'Facebook', 'Google Ads', 'Web', 'Referido', 'Llamada', 'Evento'];
  const statuses = ['Todos', 'Nuevo', 'Contactado', 'En proceso', 'Matriculado', 'No interesado'];

  const handleGenerateReport = async (downloadOnly: boolean = false) => {
    if (!selectedReportType) {
      alert('Por favor selecciona un tipo de reporte');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Preparar parámetros
      const params = {
        start_date: filters.startDate || undefined,
        end_date: filters.endDate || undefined,
        city: filters.city || undefined,
        channel: filters.channel || undefined,
        status: filters.status || undefined,
        format: 'json' as const
      };

      let reportData;
      
      // Llamar al API correspondiente según el tipo de reporte
      switch (selectedReportType) {
        case 'prospects':
          reportData = await reportsApi.generateProspectsReport(params);
          break;
        case 'conversions':
          reportData = await reportsApi.generateConversionsReport(params);
          break;
        case 'channels':
          reportData = await reportsApi.generateChannelsReport(params);
          break;
        case 'geographic':
          reportData = await reportsApi.generateGeographicReport(params);
          break;
        case 'interactions':
          reportData = await reportsApi.generateInteractionsReport(params);
          break;
        case 'executive':
          reportData = await reportsApi.generateExecutiveReport(params);
          break;
        default:
          throw new Error('Tipo de reporte no válido');
      }
      
      console.log('Reporte generado:', reportData);
      
      // Almacenar datos para visualización
      setReportData(reportData);
      
      if (downloadOnly) {
        // Generar descarga de JSON
        const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte-${selectedReportType}-${new Date().getTime()}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
      
      const recordCount = reportData.total_records || reportData.total_channels || reportData.total_cities || reportData.data?.length || 'N/A';
      alert(`Reporte generado exitosamente: ${recordCount} registros`);
      
    } catch (error) {
      console.error('Error generando reporte:', error);
      alert('Error al generar el reporte: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setIsGenerating(false);
    }
  };

  const renderReportChart = () => {
    if (!reportData || !selectedReportType) {
      return (
        <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">Genera un reporte para ver la visualización</p>
        </div>
      );
    }

    switch (selectedReportType) {
      case 'prospects':
        return <ProspectsChart data={reportData.data || []} />;
      case 'conversions':
        return <ConversionsChart data={reportData.data || reportData} />;
      case 'channels':
        return <ChannelsChart data={reportData.data || []} />;
      case 'geographic':
        return <GeographicChart data={reportData.data || []} />;
      case 'interactions':
        return <InteractionsChart data={reportData.data || []} />;
      case 'executive':
        return <ExecutiveChart data={reportData.data || reportData} />;
      default:
        return (
          <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">Tipo de reporte no soportado para visualización</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reportes</h2>
          <p className="text-gray-600 dark:text-gray-400">Generación y exportación de reportes personalizados</p>
        </div>
        <div className="mt-4 lg:mt-0 flex items-center space-x-3">
          {/* Toggle between charts and download */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('charts')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'charts'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <EyeIcon className="w-4 h-4 mr-1 inline" />
              Visualizar
            </button>
            <button
              onClick={() => setViewMode('download')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'download'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <ArrowDownTrayIcon className="w-4 h-4 mr-1 inline" />
              Descargar
            </button>
          </div>

          {/* Generate button */}
          <button
            onClick={() => handleGenerateReport(viewMode === 'download')}
            disabled={!selectedReportType || isGenerating}
            className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
              selectedReportType && !isGenerating
                ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            {viewMode === 'charts' ? (
              <ChartBarIcon className="w-4 h-4 mr-2" />
            ) : (
              <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
            )}
            {isGenerating ? 'Generando...' : (viewMode === 'charts' ? 'Ver Gráficos' : 'Descargar Reporte')}
          </button>
        </div>
      </div>

      {/* Report Type Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tipo de Reporte</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map((reportType) => (
            <div
              key={reportType.id}
              onClick={() => setSelectedReportType(reportType.id)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedReportType === reportType.id
                  ? `${reportType.color} dark:bg-opacity-20 dark:border-opacity-50`
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-800'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 ${reportType.color.split(' ')[0]}`}>
                  {reportType.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{reportType.title}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{reportType.description}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Tamaño estimado: {reportType.estimatedSize}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Date Range */}
          <div>
            <label className="label">Fecha Inicio</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({...filters, startDate: e.target.value})}
              className="input text-sm"
            />
          </div>
          
          <div>
            <label className="label">Fecha Fin</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({...filters, endDate: e.target.value})}
              className="input text-sm"
            />
          </div>

          {/* City Filter */}
          <div>
            <label className="label">Ciudad</label>
            <select
              value={filters.city}
              onChange={(e) => setFilters({...filters, city: e.target.value})}
              className="select text-sm"
            >
              {cities.map(city => (
                <option key={city} value={city === 'Todas' ? '' : city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Channel Filter */}
          <div>
            <label className="label">Canal</label>
            <select
              value={filters.channel}
              onChange={(e) => setFilters({...filters, channel: e.target.value})}
              className="select text-sm"
            >
              {channels.map(channel => (
                <option key={channel} value={channel === 'Todos' ? '' : channel}>{channel}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="label">Estado</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="select text-sm"
            >
              {statuses.map(status => (
                <option key={status} value={status === 'Todos' ? '' : status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Report Visualization */}
      {viewMode === 'charts' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Visualización del Reporte
              {selectedReportType && (
                <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                  ({reportTypes.find(rt => rt.id === selectedReportType)?.title})
                </span>
              )}
            </h3>
            {reportData && (
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                  ✓ Datos cargados
                </span>
                <span>
                  Generado: {new Date(reportData.generated_at || Date.now()).toLocaleString()}
                </span>
              </div>
            )}
          </div>
          {renderReportChart()}
        </div>
      )}

      {/* Recent Reports */}
      {viewMode === 'download' && (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Reportes Recientes</h3>
            <div className="space-y-3">
              {[
                { name: 'Reporte de Prospectos - Enero 2024', date: '2024-01-15', size: '2.3 MB', status: 'Completado' },
                { name: 'Análisis de Conversiones - Diciembre 2023', date: '2024-01-01', size: '1.8 MB', status: 'Completado' },
                { name: 'Efectividad de Canales - Q4 2023', date: '2023-12-30', size: '950 KB', status: 'Completado' }
              ].map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <DocumentArrowDownIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{report.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Generado el {report.date} • {report.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                      {report.status}
                    </span>
                    <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                      Descargar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Export Formats */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Formatos de Exportación</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded flex items-center justify-center">
              <span className="text-xs font-bold text-red-600 dark:text-red-400">PDF</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">PDF</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Formato ideal para presentaciones</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded flex items-center justify-center">
              <span className="text-xs font-bold text-green-600 dark:text-green-400">XLS</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Excel</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Para análisis de datos</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">CSV</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">CSV</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Datos en formato crudo</p>
            </div>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
};

export default Reports; 