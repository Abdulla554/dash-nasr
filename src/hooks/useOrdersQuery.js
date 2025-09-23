import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/axios.jsx";
import { queryKeys } from "../lib/queryClient.js";

// Orders list query
export const useOrders = (params = {}) => {
  return useQuery({
    queryKey: queryKeys.orders.list(params),
    queryFn: async () => {
      const response = await api.getOrders(params);
      return {
        data: response.data.data,
        pagination: response.data.pagination || {},
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error) => {
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

// Single order query
export const useOrder = (id) => {
  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: async () => {
      const response = await api.getOrder(id);
      return response.data.data;
    },
    enabled: !!id, // Only run query if id exists
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

// Create order mutation
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData) => {
      const response = await api.createOrder(orderData);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate and refetch orders list
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() });

      // Add the new order to the cache
      queryClient.setQueryData(
        queryKeys.orders.detail(data.data.id),
        data.data
      );
    },
    onError: (error) => {
      console.error("Failed to create order:", error);
    },
  });
};

// Update order mutation
export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, orderData }) => {
      const response = await api.updateOrder(id, orderData);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Update the specific order in cache
      queryClient.setQueryData(
        queryKeys.orders.detail(variables.id),
        data.data
      );

      // Invalidate orders list to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() });
    },
    onError: (error) => {
      console.error("Failed to update order:", error);
    },
  });
};

// Delete order mutation
export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await api.deleteOrder(id);
      return id;
    },
    onSuccess: (id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.orders.detail(id) });

      // Invalidate orders list
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() });
    },
    onError: (error) => {
      console.error("Failed to delete order:", error);
    },
  });
};

// Update order status mutation
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await api.updateOrderStatus(id, status);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Update the specific order in cache
      queryClient.setQueryData(
        queryKeys.orders.detail(variables.id),
        (oldData) =>
          oldData ? { ...oldData, status: variables.status } : oldData
      );

      // Invalidate orders list
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() });
    },
    onError: (error) => {
      console.error("Failed to update order status:", error);
    },
  });
};

// Order stats query
export const useOrderStats = () => {
  return useQuery({
    queryKey: [...queryKeys.orders.all, "stats"],
    queryFn: async () => {
      const response = await api.getOrderStats();
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
