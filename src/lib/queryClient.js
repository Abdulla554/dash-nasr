import { QueryClient } from "@tanstack/react-query";

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Time in milliseconds that data remains fresh
      staleTime: 5 * 60 * 1000, // 5 minutes
      // Time in milliseconds that data remains in cache
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      // Retry failed requests
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      // Retry delay
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus
      refetchOnWindowFocus: false,
      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry mutations once
      retry: 1,
    },
  },
});

// Query keys factory
export const queryKeys = {
  // Dashboard queries
  dashboard: {
    all: ["dashboard"],
    stats: () => [...queryKeys.dashboard.all, "stats"],
    revenue: () => [...queryKeys.dashboard.all, "revenue"],
    ordersChart: () => [...queryKeys.dashboard.all, "ordersChart"],
    productsChart: () => [...queryKeys.dashboard.all, "productsChart"],
  },
  // Orders queries
  orders: {
    all: ["orders"],
    lists: () => [...queryKeys.orders.all, "list"],
    list: (filters) => [...queryKeys.orders.lists(), { filters }],
    details: () => [...queryKeys.orders.all, "detail"],
    detail: (id) => [...queryKeys.orders.details(), id],
  },
  // Products queries
  products: {
    all: ["products"],
    lists: () => [...queryKeys.products.all, "list"],
    list: (filters) => [...queryKeys.products.lists(), { filters }],
    details: () => [...queryKeys.products.all, "detail"],
    detail: (id) => [...queryKeys.products.details(), id],
  },
  // Categories queries
  categories: {
    all: ["categories"],
    lists: () => [...queryKeys.categories.all, "list"],
    details: () => [...queryKeys.categories.all, "detail"],
    detail: (id) => [...queryKeys.categories.details(), id],
  },
  // Brands queries
  brands: {
    all: ["brands"],
    lists: () => [...queryKeys.brands.all, "list"],
    details: () => [...queryKeys.brands.all, "detail"],
    detail: (id) => [...queryKeys.brands.details(), id],
  },
  // Banners queries
  banners: {
    all: ["banners"],
    lists: () => [...queryKeys.banners.all, "list"],
    details: () => [...queryKeys.banners.all, "detail"],
    detail: (id) => [...queryKeys.banners.details(), id],
  },
};
