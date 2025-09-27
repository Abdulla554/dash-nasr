import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL:  import.meta.env.VITE_API_URL || "http://localhost:3000",
  timeout: 10000, // 10 seconds timeout (reduced for faster fallback)
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
  // Add retry configuration
  retry: 1,
  retryDelay: 1000,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('Making API request:', config.method?.toUpperCase(), config.url, config.params);

    // Debug FormData requests
    if (config.data instanceof FormData) {
      console.log('FormData request detected:', {
        url: config.url,
        method: config.method,
        formDataEntries: Array.from(config.data.entries())
      });
      delete config.headers["Content-Type"];
    }

    // Add timestamp to prevent caching
    if (config.method === 'get') {
      config.params = {
        ...config.params, _t: Date.now()
      };
    }

    // Add loading indicator
    if (config.showLoading !== false) {
      // You can add a global loading state here
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('API response received:', response.status, response.config.url, response.data);
    // Handle successful responses
    if (response.data && response.data.message) {
      // Show success message if needed
      // if (response.config.showSuccessMessage !== false) {
      //   toast.success(response.data.message, {
      //     position: "top-right",
      //     autoClose: 3000,
      //   });
      // }
    }
    return response;
  },
  (error) => {
    // Handle errors
    let errorMessage = "حدث خطأ غير متوقع";
    let isNetworkError = false;

    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 400:
          errorMessage = data.message || "بيانات غير صحيحة";
          break;
        case 401:
          errorMessage = "غير مصرح لك بالوصول";
          break;
        case 403:
          errorMessage = "ممنوع الوصول";
          break;
        case 404:
          errorMessage = "المورد غير موجود";
          break;
        case 409:
          errorMessage = data.message || "تضارب في البيانات";
          break;
        case 422:
          errorMessage = data.message || "بيانات غير صالحة";
          break;
        case 500:
          errorMessage = "خطأ في الخادم";
          isNetworkError = true;
          break;
        default:
          errorMessage = data.message || `خطأ ${status}`;
      }
    } else if (error.request) {
      // Network error - Backend not available
      errorMessage = "الخادم غير متاح";
      isNetworkError = true;
    } else {
      // Other error
      errorMessage = error.message || "حدث خطأ غير متوقع";
    }

    // Show error message only for non-network errors
    if (error.config?.showErrorMessage !== false && !isNetworkError) {
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    }

    // For network errors, show a less intrusive notification
    if (isNetworkError) {
      toast.info("الخادم غير متاح - لا توجد بيانات متاحة", {
        position: "top-right",
        autoClose: 2000,
      });
    }

    return Promise.reject(error);
  }
);

// API methods
export const api = {
  // Products - Complete API
  getProducts: (params = {}) => axiosInstance.get('/products', { params }),
  getProduct: (id) => axiosInstance.get(`/products/${id}`),
  createProduct: (data) => axiosInstance.post('/products', data),
  updateProduct: (id, data) => axiosInstance.put(`/products/${id}`, data),
  patchProduct: (id, data) => axiosInstance.patch(`/products/${id}`, data),
  deleteProduct: (id) => axiosInstance.delete(`/products/${id}`),
  searchProducts: (params = {}) => axiosInstance.get('/products/search', { params }),
  getFeaturedProducts: () => axiosInstance.get('/products/featured'),
  getBestsellers: () => axiosInstance.get('/products/bestsellers'),
  getNewProducts: () => axiosInstance.get('/products/new'),
  getProductsByCategory: (id) => axiosInstance.get(`/products/category/${id}`),
  getProductsByBrand: (id) => axiosInstance.get(`/products/brand/${id}`),
  getProductStats: () => axiosInstance.get('/products/stats'),
  getLowStockProducts: () => axiosInstance.get('/products/low-stock'),
  updateProductStock: (id, stock) => axiosInstance.put(`/products/${id}/stock`, { stock }),

  // Categories - Complete API
  getCategories: () => axiosInstance.get('/categories'),
  getCategory: (id) => axiosInstance.get(`/categories/${id}`),
  createCategory: (data) => axiosInstance.post('/categories', data),
  updateCategory: (id, data) => axiosInstance.put(`/categories/${id}`, data),
  patchCategory: (id, data) => axiosInstance.patch(`/categories/${id}`, data),
  deleteCategory: (id) => axiosInstance.delete(`/categories/${id}`),

  // Brands - Complete API
  getBrands: () => axiosInstance.get('/brands'),
  getBrand: (id) => axiosInstance.get(`/brands/${id}`),
  createBrand: (data) => axiosInstance.post('/brands', data),
  updateBrand: (id, data) => axiosInstance.put(`/brands/${id}`, data),
  patchBrand: (id, data) => axiosInstance.patch(`/brands/${id}`, data),
  deleteBrand: (id) => axiosInstance.delete(`/brands/${id}`),

  // Orders - Updated to match backend endpoints
  getOrders: (params = {}) => axiosInstance.get('/orders', { params }),
  getOrder: (id) => axiosInstance.get(`/orders/${id}`),
  createOrder: (data) => axiosInstance.post('/orders', data),
  updateOrder: (id, data) => axiosInstance.put(`/orders/${id}`, data),
  patchOrder: (id, data) => axiosInstance.patch(`/orders/${id}`, data),
  deleteOrder: (id) => axiosInstance.delete(`/orders/${id}`),

  // Banners - Updated to match backend endpoints
  getBanners: () => axiosInstance.get('/banners'),
  getActiveBanners: () => axiosInstance.get('/banners/active'),
  getBanner: (id) => axiosInstance.get(`/banners/${id}`),
  createBanner: (data) => axiosInstance.post('/banners', data),
  updateBanner: (id, data) => axiosInstance.put(`/banners/${id}`, data),
  patchBanner: (id, data) => axiosInstance.patch(`/banners/${id}`, data),
  deleteBanner: (id) => axiosInstance.delete(`/banners/${id}`),

  // Upload - Updated to match backend endpoints
  uploadImage: (formData, config = {}) => axiosInstance.post('/upload/image', formData, {
    ...config,
    headers: {
      ...config.headers,
      // Let axios set the Content-Type automatically for FormData
    }
  }),
  uploadImages: (formData, config = {}) => axiosInstance.post('/upload/images', formData, {
    ...config,
    headers: {
      ...config.headers,
      // Let axios set the Content-Type automatically for FormData
    }
  }),
  uploadProductImages: (formData, config = {}) => axiosInstance.post('/upload/product-images', formData, {
    ...config,
    headers: {
      ...config.headers,
      // Let axios set the Content-Type automatically for FormData
    }
  }),
  deleteImage: (imageId) => axiosInstance.delete(`/upload/${imageId}`),

  // Specific upload endpoints for different content types
  uploadCategoryImage: (formData, config = {}) => axiosInstance.post('/upload/category-image', formData, {
    ...config,
    headers: {
      ...config.headers,
    }
  }),
  uploadBrandImage: (formData, config = {}) => axiosInstance.post('/upload/brand-image', formData, {
    ...config,
    headers: {
      ...config.headers,
    }
  }),
  uploadBannerImage: (formData, config = {}) => axiosInstance.post('/upload/banner-image', formData, {
    ...config,
    headers: {
      ...config.headers,
    }
  }),
  uploadProductImage: (formData, config = {}) => axiosInstance.post('/upload/product-image', formData, {
    ...config,
    headers: {
      ...config.headers,
    }
  }),

  // Cloud Storage endpoints
  uploadToCloud: (formData, config = {}) => axiosInstance.post('/upload/cloud', formData, {
    ...config,
    headers: {
      ...config.headers,
    }
  }),
  getCloudImageUrl: (imageId, options = {}) => axiosInstance.get(`/upload/cloud/${imageId}/url`, {
    params: options
  }),
  deleteCloudImage: (imageId) => axiosInstance.delete(`/upload/cloud/${imageId}`),

  // Dashboard - Updated to match backend endpoints
  getDashboardStats: () => axiosInstance.get('/dashboard/stats'),
  getRevenueStats: () => axiosInstance.get('/dashboard/revenue'),
  getOrdersChart: () => axiosInstance.get('/dashboard/orders-chart'),
  getProductsChart: () => axiosInstance.get('/dashboard/products-chart'),

  // Analytics - Updated to match backend endpoints
  getAnalyticsOverview: () => axiosInstance.get('/analytics/overview'),
  getSalesAnalytics: () => axiosInstance.get('/analytics/sales'),
  getProductsAnalytics: () => axiosInstance.get('/analytics/products'),

  // Utilities - Updated to match backend endpoints
  healthCheck: () => axiosInstance.get('/health'),
  getCurrencies: () => axiosInstance.get('/currencies'),
  createCurrency: (data) => axiosInstance.post('/currencies', data),
  updateCurrency: (id, data) => axiosInstance.put(`/currencies/${id}`, data),
  getSettings: () => axiosInstance.get('/settings'),
  updateSettings: (data) => axiosInstance.put('/settings', data),
};

export default axiosInstance;
