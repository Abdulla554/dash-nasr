import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/axios.jsx";
import { queryKeys } from "../lib/queryClient.js";

// Products list query
export const useProducts = (params = {}) => {
  return useQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: async () => {
      const response = await api.getProducts(params);
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

// Single product query
export const useProduct = (id) => {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: async () => {
      const response = await api.getProduct(id);
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

// Create product mutation
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productData) => {
      const response = await api.createProduct(productData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
      queryClient.setQueryData(
        queryKeys.products.detail(data.data.id),
        data.data
      );
    },
    onError: (error) => {
      console.error("Failed to create product:", error);
    },
  });
};

// Update product mutation
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, productData }) => {
      const response = await api.updateProduct(id, productData);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        queryKeys.products.detail(variables.id),
        data.data
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
    },
    onError: (error) => {
      console.error("Failed to update product:", error);
    },
  });
};

// Delete product mutation
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await api.deleteProduct(id);
      return id;
    },
    onSuccess: (id) => {
      queryClient.removeQueries({ queryKey: queryKeys.products.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
    },
    onError: (error) => {
      console.error("Failed to delete product:", error);
    },
  });
};

// Search products query
export const useSearchProducts = (searchParams) => {
  return useQuery({
    queryKey: [...queryKeys.products.all, "search", searchParams],
    queryFn: async () => {
      const response = await api.searchProducts(searchParams);
      return {
        data: response.data.data,
        pagination: response.data.pagination || {},
      };
    },
    enabled:
      !!searchParams.search || !!searchParams.category || !!searchParams.brand,
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: (failureCount, error) => {
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

// Featured products query
export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: [...queryKeys.products.all, "featured"],
    queryFn: async () => {
      const response = await api.getFeaturedProducts();
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

// Bestsellers query
export const useBestsellers = () => {
  return useQuery({
    queryKey: [...queryKeys.products.all, "bestsellers"],
    queryFn: async () => {
      const response = await api.getBestsellers();
      return response.data.data;
    },
    staleTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

// New products query
export const useNewProducts = () => {
  return useQuery({
    queryKey: [...queryKeys.products.all, "new"],
    queryFn: async () => {
      const response = await api.getNewProducts();
      return response.data.data;
    },
    staleTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

// Products by category query
export const useProductsByCategory = (categoryId) => {
  return useQuery({
    queryKey: [...queryKeys.products.all, "category", categoryId],
    queryFn: async () => {
      const response = await api.getProductsByCategory(categoryId);
      return response.data.data;
    },
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

// Products by brand query
export const useProductsByBrand = (brandId) => {
  return useQuery({
    queryKey: [...queryKeys.products.all, "brand", brandId],
    queryFn: async () => {
      const response = await api.getProductsByBrand(brandId);
      return response.data.data;
    },
    enabled: !!brandId,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

// Low stock products query
export const useLowStockProducts = () => {
  return useQuery({
    queryKey: [...queryKeys.products.all, "low-stock"],
    queryFn: async () => {
      const response = await api.getLowStockProducts();
      return response.data.data;
    },
    staleTime: 2 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

// Update product stock mutation
export const useUpdateProductStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, stock }) => {
      const response = await api.updateProductStock(id, stock);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        queryKeys.products.detail(variables.id),
        (oldData) =>
          oldData ? { ...oldData, stock: variables.stock } : oldData
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
    },
    onError: (error) => {
      console.error("Failed to update product stock:", error);
    },
  });
};
