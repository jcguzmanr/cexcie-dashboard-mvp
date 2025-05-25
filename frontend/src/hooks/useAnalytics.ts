import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../services/api';

export const useRealTimeMetrics = () => {
  return useQuery({
    queryKey: ['analytics', 'real-time-metrics'],
    queryFn: () => analyticsApi.getRealTimeMetrics(),
    staleTime: 2 * 60 * 1000, // 2 minutos para datos en tiempo real
    refetchInterval: 5 * 60 * 1000, // Actualizar cada 5 minutos automáticamente
  });
};

export const useConversionFunnel = (params?: { start_date?: string; end_date?: string }) => {
  return useQuery({
    queryKey: ['analytics', 'conversion-funnel', params],
    queryFn: () => analyticsApi.getConversionFunnel(params),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

export const useGeographicDistribution = () => {
  return useQuery({
    queryKey: ['analytics', 'geographic-distribution'],
    queryFn: () => analyticsApi.getGeographicDistribution(),
    staleTime: 30 * 60 * 1000, // 30 minutos
  });
};

export const useChannelEffectiveness = () => {
  return useQuery({
    queryKey: ['analytics', 'channel-effectiveness'],
    queryFn: () => analyticsApi.getChannelEffectiveness(),
    staleTime: 30 * 60 * 1000, // 30 minutos
  });
};

export const useInteractionPatterns = () => {
  return useQuery({
    queryKey: ['analytics', 'interaction-patterns'],
    queryFn: () => analyticsApi.getInteractionPatterns(),
    staleTime: 15 * 60 * 1000, // 15 minutos
  });
};

export const useTestPerformance = () => {
  return useQuery({
    queryKey: ['analytics', 'test-performance'],
    queryFn: () => analyticsApi.getTestPerformance(),
    staleTime: 30 * 60 * 1000, // 30 minutos
  });
};

export const useAdvisoryImpact = () => {
  return useQuery({
    queryKey: ['analytics', 'advisory-impact'],
    queryFn: () => analyticsApi.getAdvisoryImpact(),
    staleTime: 30 * 60 * 1000, // 30 minutos
  });
};

export const useTemporalTrends = (period: 'day' | 'week' | 'month' = 'month') => {
  return useQuery({
    queryKey: ['analytics', 'temporal-trends', period],
    queryFn: () => analyticsApi.getTemporalTrends(period),
    staleTime: 15 * 60 * 1000, // 15 minutos
  });
};

export const useOperationalKPIs = () => {
  return useQuery({
    queryKey: ['analytics', 'operational-kpis'],
    queryFn: () => analyticsApi.getOperationalKPIs(),
    staleTime: 2 * 60 * 1000, // 2 minutos para datos en tiempo real
    refetchInterval: 5 * 60 * 1000, // Actualizar cada 5 minutos automáticamente
  });
}; 