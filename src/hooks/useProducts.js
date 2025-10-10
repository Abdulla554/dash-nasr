/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { api } from "../lib/axios.jsx";

export const useProducts = (params = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  const fetchProducts = async (newParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getProducts({ ...params, ...newParams });
      setProducts(response.data.data);
      setPagination(response.data.pagination || {});
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ في جلب المنتجات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []); // جلب المنتجات مرة واحدة فقط

  const createProduct = async (productData) => {
    const response = await api.createProduct(productData);
    setProducts((prev) => [response.data.data, ...prev]);
    return response.data;
  };

  const updateProduct = async (id, productData) => {
    const response = await api.updateProduct(id, productData);
    setProducts((prev) =>
      prev.map((product) => (product.id === id ? response.data.data : product))
    );
    return response.data;
  };

  const deleteProduct = async (id) => {
    const response = await api.deleteProduct(id);
    setProducts((prev) => prev.filter((product) => product.id !== id));
    return response.data;
  };

  const searchProducts = async (params = {}) => {
    try {
      setLoading(true);
      const response = await api.searchProducts(params);
      setProducts(response.data.data);
      setPagination(response.data.pagination || {});
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ في البحث");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getProductStats = async () => {
    const response = await api.getProductStats();
    return response.data.data;
  };

  const getFeaturedProducts = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await api.getFeaturedProducts();
      return response.data.data;
    } catch (err) {
      throw err;
    }
  };

  const getBestsellers = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await api.getBestsellers();
      return response.data.data;
    } catch (err) {
      throw err;
    }
  };

  const getNewProducts = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await api.getNewProducts();
      return response.data.data;
    } catch (err) {
      throw err;
    }
  };

  const getLowStockProducts = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await api.getLowStockProducts();
      return response.data.data;
    } catch (err) {
      throw err;
    }
  };

  const getProductsByCategory = async (categoryId) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await api.getProductsByCategory(categoryId);
      return response.data.data;
    } catch (err) {
      throw err;
    }
  };

  const getProductsByBrand = async (brandId) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await api.getProductsByBrand(brandId);
      return response.data.data;
    } catch (err) {
      throw err;
    }
  };

  return {
    products,
    loading,
    error,
    pagination,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    getProductStats,
    getFeaturedProducts,
    getBestsellers,
    getNewProducts,
    getLowStockProducts,
    getProductsByCategory,
    getProductsByBrand,
  };
};

export const useProduct = (id) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProduct = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const response = await api.getProduct(id);
      setProduct(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ في جلب المنتج");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct, id]);

  const updateProduct = async (productData) => {
    const response = await api.updateProduct(id, productData);
    setProduct(response.data.data);
    return response.data;
  };

  const updateStock = async (stock) => {
    const response = await api.updateProductStock(id, stock);
    setProduct((prev) => ({ ...prev, stock }));
    return response.data;
  };

  return {
    product,
    loading,
    error,
    fetchProduct,
    updateProduct,
    updateStock,
  };
};
