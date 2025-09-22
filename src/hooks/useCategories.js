import { useState, useEffect } from 'react';
import { api } from '../lib/axios.jsx';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getCategories();
      setCategories(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ في جلب الفئات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const createCategory = async (categoryData) => {
    try {
      const response = await api.createCategory(categoryData);
      setCategories(prev => [response.data.data, ...prev]);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const updateCategory = async (id, categoryData) => {
    try {
      const response = await api.updateCategory(id, categoryData);
      setCategories(prev => prev.map(category => 
        category.id === id ? response.data.data : category
      ));
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const deleteCategory = async (id) => {
    try {
      await api.deleteCategory(id);
      setCategories(prev => prev.filter(category => category.id !== id));
    } catch (err) {
      throw err;
    }
  };

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory
  };
};

export const useCategory = (id) => {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategory = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await api.getCategory(id);
      setCategory(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ في جلب الفئة');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [id]);

  const getCategoryProducts = async () => {
    try {
      const response = await api.getCategoryProducts(id);
      return response.data.data;
    } catch (err) {
      throw err;
    }
  };

  return {
    category,
    loading,
    error,
    fetchCategory,
    getCategoryProducts
  };
};
