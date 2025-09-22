import { useState, useEffect } from 'react';
import { api } from '../lib/axios.jsx';

export const useBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getBanners();
      setBanners(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ في جلب البانرات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const createBanner = async (bannerData) => {
    try {
      const response = await api.createBanner(bannerData);
      setBanners(prev => [response.data.data, ...prev]);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const updateBanner = async (id, bannerData) => {
    try {
      const response = await api.updateBanner(id, bannerData);
      setBanners(prev => prev.map(banner => 
        banner.id === id ? response.data.data : banner
      ));
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const deleteBanner = async (id) => {
    try {
      await api.deleteBanner(id);
      setBanners(prev => prev.filter(banner => banner.id !== id));
    } catch (err) {
      throw err;
    }
  };

  const updateBannerStatus = async (id, status) => {
    try {
      const response = await api.updateBannerStatus(id, status);
      setBanners(prev => prev.map(banner => 
        banner.id === id ? { ...banner, status } : banner
      ));
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const getActiveBanners = async () => {
    try {
      const response = await api.getActiveBanners();
      return response.data.data;
    } catch (err) {
      throw err;
    }
  };

  return {
    banners,
    loading,
    error,
    fetchBanners,
    createBanner,
    updateBanner,
    deleteBanner,
    updateBannerStatus,
    getActiveBanners
  };
};

export const useBanner = (id) => {
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBanner = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await api.getBanner(id);
      setBanner(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ في جلب البانر');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanner();
  }, [id]);

  return {
    banner,
    loading,
    error,
    fetchBanner
  };
};
