import { useState, useEffect } from "react";
import { api } from "../lib/axios.jsx";

export const useDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getDashboardStats();
      setStats(response.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "حدث خطأ في جلب إحصائيات الداشبورد"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const getRevenueStats = async () => {
    const response = await api.getRevenueStats();
    return response.data.data;
  };

  const getOrdersChart = async () => {
    const response = await api.getOrdersChart();
    return response.data.data;
  };

  const getProductsChart = async () => {
    const response = await api.getProductsChart();
    return response.data.data;
  };

  return {
    stats,
    loading,
    error,
    fetchDashboardStats,
    getRevenueStats,
    getOrdersChart,
    getProductsChart,
  };
};

// Hook for real-time dashboard data
export const useDashboardData = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: null,
    revenue: null,
    ordersChart: null,
    productsChart: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use Promise.allSettled to handle partial failures gracefully
      const [statsRes, revenueRes, ordersRes, productsRes] =
        await Promise.allSettled([
          api.getDashboardStats(),
          api.getRevenueStats(),
          api.getOrdersChart(),
          api.getProductsChart(),
        ]);

      // Process results and handle partial failures
      const dashboardData = {
        stats:
          statsRes.status === "fulfilled" ? statsRes.value.data.data : null,
        revenue:
          revenueRes.status === "fulfilled" ? revenueRes.value.data.data : null,
        ordersChart:
          ordersRes.status === "fulfilled" ? ordersRes.value.data.data : null,
        productsChart:
          productsRes.status === "fulfilled"
            ? productsRes.value.data.data
            : null,
      };

      setDashboardData(dashboardData);

      // Only set error if all requests failed
      const failedRequests = [
        statsRes,
        revenueRes,
        ordersRes,
        productsRes,
      ].filter((result) => result.status === "rejected");

      if (failedRequests.length === 4) {
        setError("فشل في تحميل جميع البيانات");
      } else if (failedRequests.length > 0) {
        // Some requests failed, but we have partial data
        console.warn(
          `${failedRequests.length} من الطلبات فشلت، سيتم استخدام البيانات المتاحة`
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "حدث خطأ في جلب بيانات الداشبورد"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDashboardData();
  }, []);

  return {
    dashboardData,
    loading,
    error,
    refetch: fetchAllDashboardData,
  };
};

export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getAnalyticsOverview();
      setAnalytics(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ في جلب التحليلات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const getSalesAnalytics = async () => {
    const response = await api.getSalesAnalytics();
    return response.data.data;
  };

  const getProductsAnalytics = async () => {
    const response = await api.getProductsAnalytics();
    return response.data.data;
  };

  return {
    analytics,
    loading,
    error,
    fetchAnalytics,
    getSalesAnalytics,
    getProductsAnalytics,
  };
};
