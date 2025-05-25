import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interfaces
export interface Prospect {
  id: string;
  dni: string;
  full_name: string;
  email: string;
  phone?: string;
  city?: string;
  status: string;
  origin?: string;
  created_at: string;
}

export interface ProspectsResponse {
  data: Prospect[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface DashboardMetrics {
  total_prospects: number;
  total_interactions: number;
  completed_tests: number;
  total_advisories: number;
  active_centers: number;
  total_devices: number;
  growth_percentage: number;
}

// API Functions
export const prospectsApi = {
  // Obtener lista de prospectos
  getProspects: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    city?: string;
    status?: string;
    origin?: string;
  }): Promise<ProspectsResponse> => {
    const response = await api.get('/api/v1/prospects', { params });
    return response.data;
  },

  // Obtener prospecto por ID
  getProspect: async (id: string): Promise<Prospect> => {
    const response = await api.get(`/api/v1/prospects/${id}`);
    return response.data;
  },

  // Crear nuevo prospecto
  createProspect: async (prospect: any): Promise<any> => {
    const response = await api.post('/api/v1/prospects', prospect);
    return response.data;
  },

  // Actualizar prospecto
  updateProspect: async (id: string, prospect: any): Promise<any> => {
    const response = await api.put(`/api/v1/prospects/${id}`, prospect);
    return response.data;
  },

  // Eliminar prospecto
  deleteProspect: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/prospects/${id}`);
  },

  // Obtener interacciones de un prospecto
  getProspectInteractions: async (id: string): Promise<any> => {
    const response = await api.get(`/api/v1/prospects/${id}/interactions`);
    return response.data;
  },

  // Obtener tests de un prospecto
  getProspectTests: async (id: string): Promise<any> => {
    const response = await api.get(`/api/v1/prospects/${id}/tests`);
    return response.data;
  },

  // Obtener asesorías de un prospecto
  getProspectAdvisories: async (id: string): Promise<any> => {
    const response = await api.get(`/api/v1/prospects/${id}/advisories`);
    return response.data;
  },
};

export const dashboardApi = {
  // Obtener métricas del dashboard
  getMetrics: async (): Promise<DashboardMetrics> => {
    const response = await api.get('/api/v1/dashboard/metrics');
    return response.data;
  },

  // Obtener datos para gráfico de interacciones
  getInteractionsChart: async (): Promise<any> => {
    const response = await api.get('/api/v1/dashboard/interactions-chart');
    return response.data;
  },

  // Obtener datos para gráfico de ciudades
  getCitiesChart: async (): Promise<any> => {
    const response = await api.get('/api/v1/dashboard/cities-chart');
    return response.data;
  },
};

export const analyticsApi = {
  // Obtener métricas en tiempo real
  getRealTimeMetrics: async (): Promise<any> => {
    const response = await api.get('/api/v1/analytics/real-time-metrics');
    return response.data;
  },

  // Obtener embudo de conversión
  getConversionFunnel: async (params?: { start_date?: string; end_date?: string }): Promise<any> => {
    const response = await api.get('/api/v1/analytics/conversion-funnel', { params });
    return response.data;
  },

  // Obtener distribución geográfica
  getGeographicDistribution: async (): Promise<any> => {
    const response = await api.get('/api/v1/analytics/geographic-distribution');
    return response.data;
  },

  // Obtener efectividad de canales
  getChannelEffectiveness: async (): Promise<any> => {
    const response = await api.get('/api/v1/analytics/channel-effectiveness');
    return response.data;
  },

  // Obtener patrones de interacción
  getInteractionPatterns: async (): Promise<any> => {
    const response = await api.get('/api/v1/analytics/interaction-patterns');
    return response.data;
  },

  // Obtener rendimiento de pruebas
  getTestPerformance: async (): Promise<any> => {
    const response = await api.get('/api/v1/analytics/test-performance');
    return response.data;
  },

  // Obtener impacto de asesorías
  getAdvisoryImpact: async (): Promise<any> => {
    const response = await api.get('/api/v1/analytics/advisory-impact');
    return response.data;
  },

  // Obtener tendencias temporales
  getTemporalTrends: async (period: 'day' | 'week' | 'month' = 'month'): Promise<any> => {
    const response = await api.get(`/api/v1/analytics/temporal-trends?period=${period}`);
    return response.data;
  },

  // Obtener KPIs operacionales
  getOperationalKPIs: async (): Promise<any> => {
    const response = await api.get('/api/v1/analytics/operational-kpis');
    return response.data;
  },
};

export const reportsApi = {
  // Generar reporte de prospectos
  generateProspectsReport: async (params?: {
    start_date?: string;
    end_date?: string;
    city?: string;
    channel?: string;
    status?: string;
    format?: 'json' | 'csv' | 'excel';
  }): Promise<any> => {
    const response = await api.get('/api/v1/reports/prospects', { params });
    return response.data;
  },

  // Generar reporte de conversiones
  generateConversionsReport: async (params?: {
    start_date?: string;
    end_date?: string;
    format?: 'json' | 'csv' | 'excel';
  }): Promise<any> => {
    const response = await api.get('/api/v1/reports/conversions', { params });
    return response.data;
  },

  // Generar reporte de canales
  generateChannelsReport: async (params?: {
    start_date?: string;
    end_date?: string;
    format?: 'json' | 'csv' | 'excel';
  }): Promise<any> => {
    const response = await api.get('/api/v1/reports/channels', { params });
    return response.data;
  },

  // Generar reporte geográfico
  generateGeographicReport: async (params?: {
    start_date?: string;
    end_date?: string;
    format?: 'json' | 'csv' | 'excel';
  }): Promise<any> => {
    const response = await api.get('/api/v1/reports/geographic', { params });
    return response.data;
  },

  // Generar reporte de interacciones
  generateInteractionsReport: async (params?: {
    start_date?: string;
    end_date?: string;
    format?: 'json' | 'csv' | 'excel';
  }): Promise<any> => {
    const response = await api.get('/api/v1/reports/interactions', { params });
    return response.data;
  },

  // Generar reporte ejecutivo
  generateExecutiveReport: async (params?: {
    start_date?: string;
    end_date?: string;
    format?: 'json' | 'csv' | 'excel';
  }): Promise<any> => {
    const response = await api.get('/api/v1/reports/executive', { params });
    return response.data;
  },
};

export default api; 