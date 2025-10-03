import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/axios.jsx";
import { queryKeys } from "../lib/queryClient.js";

// Categories list query
export const useCategories = () => {
  return useQuery({
    queryKey: queryKeys.categories.lists(),
    queryFn: async () => {
      const response = await api.getCategories();
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

// Single category query
export const useCategory = (id) => {
  return useQuery({
    queryKey: queryKeys.categories.detail(id),
    queryFn: async () => {
      const response = await api.getCategory(id);
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

// Create category mutation
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryData) => {
      console.log("Creating category:", categoryData);
      const response = await api.createCategory(categoryData);
      console.log("Category created successfully:", response.data);
      return response.data;
      
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.lists() });
      queryClient.setQueryData(queryKeys.categories.detail(data.id), data);
    },
    onError: (error) => {
      console.error("Failed to create category:", error);
    },
  });
};

// Update category mutation
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, categoryData }) => {
      console.log("Updating category:", id, categoryData);
      const response = await api.patchCategory(id, categoryData);
      console.log("Category updated successfully:", response.data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(queryKeys.categories.detail(variables.id), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.lists() });
    },
    onError: (error) => {
      console.error("Failed to update category:", error);
    },
  });
};

// Delete category mutation
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await api.deleteCategory(id);
      return id;
    },
    onSuccess: (id) => {
      queryClient.removeQueries({ queryKey: queryKeys.categories.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.lists() });
    },
    onError: (error) => {
      console.error("Failed to delete category:", error);
    },
  });
};
