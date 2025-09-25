import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/axios.jsx";
import { queryKeys } from "../lib/queryClient.js";

// Brands list query
export const useBrands = () => {
  return useQuery({
    queryKey: queryKeys.brands.lists(),
    queryFn: async () => {
      const response = await api.getBrands();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
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

// Create brand mutation
export const useCreateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (brandData) => {
      console.log("Creating brand:", brandData);
      const response = await api.createBrand(brandData);
      console.log("Brand created successfully:", response.data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.lists() });
      queryClient.setQueryData(queryKeys.brands.detail(data.id), data);
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
      console.log("Updating brand:", id, brandData);
      const response = await api.patchBrand(id, brandData);
      console.log("Brand updated successfully:", response.data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(queryKeys.brands.detail(variables.id), data);
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
