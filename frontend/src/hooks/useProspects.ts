import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { prospectsApi, type Prospect, type ProspectsResponse } from '../services/api';

interface UseProspectsParams {
  page?: number;
  limit?: number;
  search?: string;
  city?: string;
  status?: string;
  origin?: string;
}

export const useProspects = (params: UseProspectsParams = {}) => {
  const [filters, setFilters] = useState<UseProspectsParams>({
    page: 1,
    limit: 25,
    ...params,
  });

  const query = useQuery({
    queryKey: ['prospects', filters],
    queryFn: () => prospectsApi.getProspects(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  const updateFilters = (newFilters: Partial<UseProspectsParams>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: newFilters.page !== undefined ? newFilters.page : 1, // Reset page when other filters change
    }));
  };

  const resetFilters = () => {
    setFilters({
      page: 1,
      limit: 25,
    });
  };

  return {
    data: query.data,
    prospects: query.data?.data || [],
    pagination: query.data?.pagination,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    filters,
    updateFilters,
    resetFilters,
    refetch: query.refetch,
  };
};

export const useProspect = (id: string) => {
  return useQuery({
    queryKey: ['prospect', id],
    queryFn: () => prospectsApi.getProspect(id),
    enabled: !!id,
  });
};

export const useProspectInteractions = (id: string) => {
  return useQuery({
    queryKey: ['prospect-interactions', id],
    queryFn: () => prospectsApi.getProspectInteractions(id),
    enabled: !!id,
  });
};

export const useProspectTests = (id: string) => {
  return useQuery({
    queryKey: ['prospect-tests', id],
    queryFn: () => prospectsApi.getProspectTests(id),
    enabled: !!id,
  });
};

export const useProspectAdvisories = (id: string) => {
  return useQuery({
    queryKey: ['prospect-advisories', id],
    queryFn: () => prospectsApi.getProspectAdvisories(id),
    enabled: !!id,
  });
}; 