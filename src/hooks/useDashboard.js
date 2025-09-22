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
    try {
      const response = await api.getRevenueStats();
      return response.data.data;
    } catch (err) {
      throw err;
    }
  };

  const getOrdersChart = async () => {
    try {
      const response = await api.getOrdersChart();
      return response.data.data;
    } catch (err) {
      throw err;
    }
  };

  const getProductsChart = async () => {
    try {
      const response = await api.getProductsChart();
      return response.data.data;
    } catch (err) {
      throw err;
    }
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

      const [statsRes, revenueRes, ordersRes, productsRes] = await Promise.all([
        api.getDashboardStats(),
        api.getRevenueStats(),
        api.getOrdersChart(),
        api.getProductsChart(),
      ]);

      setDashboardData({
        stats: statsRes.data.data,
        revenue: revenueRes.data.data,
        ordersChart: ordersRes.data.data,
        productsChart: productsRes.data.data,
      });
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
    try {
      const response = await api.getSalesAnalytics();
      return response.data.data;
    } catch (err) {
      throw err;
    }
  };

  const getProductsAnalytics = async () => {
    try {
      const response = await api.getProductsAnalytics();
      return response.data.data;
    } catch (err) {
      throw err;
    }
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
