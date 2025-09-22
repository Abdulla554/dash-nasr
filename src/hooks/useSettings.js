import { useState, useEffect } from "react";
import { api } from "../lib/axios.jsx";

export const useSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getSettings();
      setSettings(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ في جلب الإعدادات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSettings = async (settingsData) => {
    try {
      const response = await api.updateSettings(settingsData);
      setSettings(response.data.data);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  return {
    settings,
    loading,
    error,
    fetchSettings,
    updateSettings,
  };
};
