import { useState, useEffect } from 'react';
import { api } from '../lib/axios.jsx';

export const useOrders = (params = {}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  const fetchOrders = async (newParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getOrders({ ...params, ...newParams });
      setOrders(response.data.data);
      setPagination(response.data.pagination || {});
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ في جلب الطلبات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const createOrder = async (orderData) => {
    try {
      const response = await api.createOrder(orderData);
      setOrders(prev => [response.data.data, ...prev]);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const updateOrder = async (id, orderData) => {
    try {
      const response = await api.updateOrder(id, orderData);
      setOrders(prev => prev.map(order => 
        order.id === id ? response.data.data : order
      ));
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const deleteOrder = async (id) => {
    try {
      await api.deleteOrder(id);
      setOrders(prev => prev.filter(order => order.id !== id));
    } catch (err) {
      throw err;
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      const response = await api.updateOrderStatus(id, status);
      setOrders(prev => prev.map(order => 
        order.id === id ? { ...order, status } : order
      ));
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const getOrderStats = async () => {
    try {
      const response = await api.getOrderStats();
      return response.data.data;
    } catch (err) {
      throw err;
    }
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
    getOrderStats
  };
};

export const useOrder = (id) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrder = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await api.getOrder(id);
      setOrder(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ في جلب الطلب');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const updateOrder = async (orderData) => {
    try {
      const response = await api.updateOrder(id, orderData);
      setOrder(response.data.data);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const updateStatus = async (status) => {
    try {
      const response = await api.updateOrderStatus(id, status);
      setOrder(prev => ({ ...prev, status }));
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  return {
    order,
    loading,
    error,
    fetchOrder,
    updateOrder,
    updateStatus
  };
};
