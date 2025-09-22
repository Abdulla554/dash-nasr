import { useState, useEffect } from 'react';
import { api } from '../lib/axios.jsx';

export const useBrands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getBrands();
      setBrands(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ في جلب العلامات التجارية');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const createBrand = async (brandData) => {
    try {
      const response = await api.createBrand(brandData);
      setBrands(prev => [response.data.data, ...prev]);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const updateBrand = async (id, brandData) => {
    try {
      const response = await api.updateBrand(id, brandData);
      setBrands(prev => prev.map(brand => 
        brand.id === id ? response.data.data : brand
      ));
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const deleteBrand = async (id) => {
    try {
      await api.deleteBrand(id);
      setBrands(prev => prev.filter(brand => brand.id !== id));
    } catch (err) {
      throw err;
    }
  };

  return {
    brands,
    loading,
    error,
    fetchBrands,
    createBrand,
    updateBrand,
    deleteBrand
  };
};

export const useBrand = (id) => {
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBrand = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await api.getBrand(id);
      setBrand(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ في جلب العلامة التجارية');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrand();
  }, [id]);

  const getBrandProducts = async () => {
    try {
      const response = await api.getBrandProducts(id);
      return response.data.data;
    } catch (err) {
      throw err;
    }
  };

  return {
    brand,
    loading,
    error,
    fetchBrand,
    getBrandProducts
  };
};
