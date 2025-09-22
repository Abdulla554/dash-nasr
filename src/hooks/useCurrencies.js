import { useState, useEffect } from "react";
import { api } from "../lib/axios.jsx";

export const useCurrencies = () => {
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCurrencies = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getCurrencies();
      setCurrencies(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ في جلب العملات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const createCurrency = async (currencyData) => {
    try {
      const response = await api.createCurrency(currencyData);
      setCurrencies((prev) => [response.data.data, ...prev]);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const updateCurrency = async (id, currencyData) => {
    try {
      const response = await api.updateCurrency(id, currencyData);
      setCurrencies((prev) =>
        prev.map((currency) =>
          currency.id === id ? response.data.data : currency
        )
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  return {
    currencies,
    loading,
    error,
    fetchCurrencies,
    createCurrency,
    updateCurrency,
  };
};
