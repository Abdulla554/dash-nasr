import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/axios.jsx";
import { queryKeys } from "../lib/queryClient.js";

// Brands list query
export const useBrands = () => {
  return useQuery({
    queryKey: queryKeys.brands.lists(),
    queryFn: async () => {
      const response = await api.getBrands();
      return response.data.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

// Single brand query
export const useBrand = (id) => {
  return useQuery({
    queryKey: queryKeys.brands.detail(id),
    queryFn: async () => {
      const response = await api.getBrand(id);
      return response.data.data;
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

// Create brand mutation
export const useCreateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (brandData) => {
      const response = await api.createBrand(brandData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.lists() });
      queryClient.setQueryData(
        queryKeys.brands.detail(data.data.id),
        data.data
      );
    },
    onError: (error) => {
      console.error("Failed to create brand:", error);
    },
  });
};

// Update brand mutation
export const useUpdateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, brandData }) => {
      const response = await api.updateBrand(id, brandData);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        queryKeys.brands.detail(variables.id),
        data.data
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.lists() });
    },
    onError: (error) => {
      console.error("Failed to update brand:", error);
    },
  });
};

// Delete brand mutation
export const useDeleteBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await api.deleteBrand(id);
      return id;
    },
    onSuccess: (id) => {
      queryClient.removeQueries({ queryKey: queryKeys.brands.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.lists() });
    },
    onError: (error) => {
      console.error("Failed to delete brand:", error);
    },
  });
};
