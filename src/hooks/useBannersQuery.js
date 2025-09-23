import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/axios.jsx";
import { queryKeys } from "../lib/queryClient.js";

// Banners list query
export const useBanners = () => {
  return useQuery({
    queryKey: queryKeys.banners.lists(),
    queryFn: async () => {
      const response = await api.getBanners();
      return response.data.data;
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

// Active banners query
export const useActiveBanners = () => {
  return useQuery({
    queryKey: [...queryKeys.banners.all, "active"],
    queryFn: async () => {
      const response = await api.getActiveBanners();
      return response.data.data;
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

// Single banner query
export const useBanner = (id) => {
  return useQuery({
    queryKey: queryKeys.banners.detail(id),
    queryFn: async () => {
      const response = await api.getBanner(id);
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

// Create banner mutation
export const useCreateBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bannerData) => {
      const response = await api.createBanner(bannerData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.banners.lists() });
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.banners.all, "active"],
      });
      queryClient.setQueryData(
        queryKeys.banners.detail(data.data.id),
        data.data
      );
    },
    onError: (error) => {
      console.error("Failed to create banner:", error);
    },
  });
};

// Update banner mutation
export const useUpdateBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, bannerData }) => {
      const response = await api.updateBanner(id, bannerData);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        queryKeys.banners.detail(variables.id),
        data.data
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.banners.lists() });
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.banners.all, "active"],
      });
    },
    onError: (error) => {
      console.error("Failed to update banner:", error);
    },
  });
};

// Delete banner mutation
export const useDeleteBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await api.deleteBanner(id);
      return id;
    },
    onSuccess: (id) => {
      queryClient.removeQueries({ queryKey: queryKeys.banners.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.banners.lists() });
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.banners.all, "active"],
      });
    },
    onError: (error) => {
      console.error("Failed to delete banner:", error);
    },
  });
};
