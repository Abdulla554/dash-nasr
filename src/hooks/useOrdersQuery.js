import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/axios.jsx";
import { queryKeys } from "../lib/queryClient.js";

// Orders list query
export const useOrders = (params = {}) => {
  return useQuery({
    queryKey: queryKeys.orders.list(params),
    queryFn: async () => {
      console.log("Fetching orders with params:", params);
      const response = await api.getOrders(params);
      console.log("Orders API response:", response.data);

      // Handle different response structures
      let orders = [];
      if (Array.isArray(response.data)) {
        orders = response.data;
      } else if (response.data.data) {
        orders = response.data.data;
      } else if (response.data.orders) {
        orders = response.data.orders;
      } else {
        orders = response.data;
      }

      console.log("Extracted orders:", orders);

      return {
        data: orders,
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
      return response.data;
    },
    enabled: !!id,
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
      console.log("Creating order:", orderData);
      const response = await api.createOrder(orderData);
      console.log("Order created successfully:", response.data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() });
      queryClient.setQueryData(queryKeys.orders.detail(data.id), data);
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
      console.log("Updating order:", id, orderData);
      const response = await api.patchOrder(id, orderData);
      console.log("Order updated successfully:", response.data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(queryKeys.orders.detail(variables.id), data);
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
      console.log("Deleting order:", id);
      await api.deleteOrder(id);
      console.log("Order deleted successfully");
      return id;
    },
    onSuccess: (id) => {
      queryClient.removeQueries({ queryKey: queryKeys.orders.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() });
    },
    onError: (error) => {
      console.error("Failed to delete order:", error);
    },
  });
};

// Orders by status query
export const useOrdersByStatus = (status) => {
  return useQuery({
    queryKey: [...queryKeys.orders.all, "status", status],
    queryFn: async () => {
      const response = await api.getOrders({ status });
      return {
        data: response.data.data,
        pagination: response.data.pagination || {},
      };
    },
    enabled: !!status,
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: (failureCount, error) => {
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      return failureCount < 2;
    },
  });
};
