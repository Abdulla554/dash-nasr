import { useState, useEffect, useCallback } from "react";
import { api } from "../lib/axios.jsx";

export const useOrders = (params = {}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  const fetchOrders = useCallback(
    async (newParams = {}) => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.getOrders({ ...params, ...newParams });
        setOrders(response.data.data);
        setPagination(response.data.pagination || {});
      } catch (err) {
        // Don't set error for network issues, let fallback data handle it
        if (
          err.code === "NETWORK_ERROR" ||
          err.message.includes("Network Error")
        ) {
          console.warn("Network error - using fallback data");
          setError(null);
        } else {
          setError(err.response?.data?.message || "حدث خطأ في جلب الطلبات");
        }
      } finally {
        setLoading(false);
      }
    },
    [params]
  );

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const createOrder = useCallback(async (orderData) => {
    const response = await api.createOrder(orderData);
    setOrders((prev) => [response.data.data, ...prev]);
    return response.data;
  }, []);

  const updateOrder = useCallback(async (id, orderData) => {
    const response = await api.updateOrder(id, orderData);
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? response.data.data : order))
    );
    return response.data;
  }, []);

  const deleteOrder = useCallback(async (id) => {
    await api.deleteOrder(id);
    setOrders((prev) => prev.filter((order) => order.id !== id));
  }, []);

  const updateOrderStatus = async (id, status) => {
    const response = await api.updateOrderStatus(id, status);
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status } : order))
    );
    return response.data;
  };

  const getOrderStats = async () => {
    const response = await api.getOrderStats();
    return response.data.data;
  };

  return {
    orders,
    loading,
    error,
    pagination,
    fetchOrders,
    createOrder,
    updateOrder,
    deleteOrder,
    updateOrderStatus,
    getOrderStats,
  };
};

export const useOrder = (id) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrder = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const response = await api.getOrder(id);
      setOrder(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ في جلب الطلب");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const updateOrder = async (orderData) => {
    const response = await api.updateOrder(id, orderData);
    setOrder(response.data.data);
    return response.data;
  };

  const updateStatus = async (status) => {
    const response = await api.updateOrderStatus(id, status);
    setOrder((prev) => ({ ...prev, status }));
    return response.data;
  };

  return {
    order,
    loading,
    error,
    fetchOrder,
    updateOrder,
    updateStatus,
  };
};
