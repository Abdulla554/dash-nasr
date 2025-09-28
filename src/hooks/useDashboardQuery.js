import { useQuery, useQueries } from "@tanstack/react-query";
import { api } from "../lib/axios.jsx";
import { queryKeys } from "../lib/queryClient.js";

// Individual dashboard queries
export const useDashboardStats = () => {
  return useQuery({
    queryKey: queryKeys.dashboard.stats(),
    queryFn: async () => {
      const response = await api.getDashboardStats();
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

export const useRevenueStats = () => {
  return useQuery({
    queryKey: queryKeys.dashboard.revenue(),
    queryFn: async () => {
      const response = await api.getRevenueStats();
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

export const useOrdersChart = () => {
  return useQuery({
    queryKey: queryKeys.dashboard.ordersChart(),
    queryFn: async () => {
      const response = await api.getOrdersChart();
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

export const useProductsChart = () => {
  return useQuery({
    queryKey: queryKeys.dashboard.productsChart(),
    queryFn: async () => {
      const response = await api.getProductsChart();
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

export const useVisitorsStats = () => {
  return useQuery({
    queryKey: queryKeys.dashboard.visitors(),
    queryFn: async () => {
      const response = await api.getVisitorsStats();
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

// Combined dashboard data hook
export const useDashboardData = () => {
  const queries = useQueries({
    queries: [
      {
        queryKey: queryKeys.dashboard.stats(),
        queryFn: async () => {
          const response = await api.getDashboardStats();
          return response.data.data;
        },
        staleTime: 5 * 60 * 1000,
        retry: (failureCount, error) => {
          if (error?.response?.status >= 400 && error?.response?.status < 500) {
            return false;
          }
          return failureCount < 2;
        },
      },
      {
        queryKey: queryKeys.dashboard.revenue(),
        queryFn: async () => {
          const response = await api.getRevenueStats();
          return response.data.data;
        },
        staleTime: 5 * 60 * 1000,
        retry: (failureCount, error) => {
          if (error?.response?.status >= 400 && error?.response?.status < 500) {
            return false;
          }
          return failureCount < 2;
        },
      },
      {
        queryKey: queryKeys.dashboard.ordersChart(),
        queryFn: async () => {
          const response = await api.getOrdersChart();
          return response.data.data;
        },
        staleTime: 5 * 60 * 1000,
        retry: (failureCount, error) => {
          if (error?.response?.status >= 400 && error?.response?.status < 500) {
            return false;
          }
          return failureCount < 2;
        },
      },
      {
        queryKey: queryKeys.dashboard.productsChart(),
        queryFn: async () => {
          const response = await api.getProductsChart();
          return response.data.data;
        },
        staleTime: 5 * 60 * 1000,
        retry: (failureCount, error) => {
          if (error?.response?.status >= 400 && error?.response?.status < 500) {
            return false;
          }
          return failureCount < 2;
        },
      },
      {
        queryKey: queryKeys.dashboard.visitors(),
        queryFn: async () => {
          const response = await api.getVisitorsStats();
          return response.data.data;
        },
        staleTime: 5 * 60 * 1000,
        retry: (failureCount, error) => {
          if (error?.response?.status >= 400 && error?.response?.status < 500) {
            return false;
          }
          return failureCount < 2;
        },
      },
    ],
  });

  const [
    statsQuery,
    revenueQuery,
    ordersChartQuery,
    productsChartQuery,
    visitorsQuery,
  ] = queries;

  return {
    dashboardData: {
      stats: statsQuery.data,
      revenue: revenueQuery.data,
      ordersChart: ordersChartQuery.data,
      productsChart: productsChartQuery.data,
      visitors: visitorsQuery.data,
    },
    loading: queries.some((query) => query.isLoading),
    error: queries.find((query) => query.error)?.error || null,
    isError: queries.some((query) => query.isError),
    refetch: () => {
      queries.forEach((query) => query.refetch());
    },
    // Individual query states
    queries: {
      stats: statsQuery,
      revenue: revenueQuery,
      ordersChart: ordersChartQuery,
      productsChart: productsChartQuery,
      visitors: visitorsQuery,
    },
  };
};
