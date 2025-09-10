/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  FaBox,
  FaLayerGroup,
  FaTrademark,
  FaChartLine,
  FaFilter,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";

export default function Home() {
  const [timeFilter, setTimeFilter] = useState("monthly");
  const [chartFilter, setChartFilter] = useState("sales");

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/categories");
        return response.data;
      } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
      }
    },
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
  const { data: demoProducts } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/products");
        return response.data;
      } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
    },
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const { data: demoBrands } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/brands");
        return response.data;
      } catch (error) {
        console.error("Error fetching certificates:", error);
        throw error;
      }
    },
  });
  // Static demo data
  const statsData = [
    { title: "Total Products", value: demoProducts?.length, icon: <FaBox /> },
    { title: "Total Categories", value: categories?.length, icon: <FaLayerGroup /> },
    { title: "Total Brands", value: demoBrands?.length, icon: <FaTrademark /> },
    { title: "Active Products", value: demoProducts?.length, icon: <FaChartLine /> },
  ];

  const productTrends = [
    { month: "January", products: 980, categories: 42, brands: 65 },
    { month: "February", products: 1050, categories: 44, brands: 68 },
    { month: "March", products: 1150, categories: 46, brands: 70 },
    { month: "April", products: 1250, categories: 48, brands: 75 },
  ];

  const categoryDistribution = [
    { name: "Electronics", value: 320, fill: "#ECB774" },
    { name: "Clothing", value: 280, fill: "#87CEEB" },
    { name: "Furniture", value: 220, fill: "#1e4b6b" },
    { name: "Home Essentials", value: 180, fill: "#8B6B43" },
    { name: "Others", value: 250, fill: "#634927" },
  ];

  const brandPerformance = [
    { name: "Samsung", sales: 450, revenue: 125000 },
    { name: "Apple", sales: 380, revenue: 180000 },
    { name: "Nike", sales: 320, revenue: 95000 },
    { name: "Sony", sales: 280, revenue: 85000 },
    { name: "Adidas", sales: 250, revenue: 75000 },
  ];

  const salesData = [
    { month: "January", sales: 85000, growth: 15 },
    { month: "February", sales: 92000, growth: 18 },
    { month: "March", sales: 98000, growth: 22 },
    { month: "April", sales: 105000, growth: 25 },
  ];

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-[#1e4b6b]/5 via-[#8B6B43]/5 to-[#634927]/5"
      dir="ltr"
    >
      {/* Luxurious Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1e4b6b] via-[#8B6B43] to-[#634927] rounded-b-[2rem] shadow-xl">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-15"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(191,148,93,0.4),rgba(135,206,235,0.2))]"></div>
        </div>

        <div className="relative py-12 px-6">
          <div className="flex items-center gap-5 mb-8">
            <motion.div
              whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
              className="p-4 bg-gradient-to-br from-[#ECB774]/10 to-[#87CEEB]/10 rounded-2xl backdrop-blur-xl border border-[#ECB774]/20"
            >
              <Sparkles className="h-8 w-8 text-[#ECB774]" />
            </motion.div>
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
                className="text-4xl font-bold py-2 bg-gradient-to-r from-[#ECB774] via-[#87CEEB] to-[#ECB774] bg-clip-text text-transparent"
              >
                Dashboard Overview
              </motion.h1>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "12rem" }}
                transition={{ delay: 0.5, duration: 1, ease: "easeInOut" }}
                className="h-1 bg-gradient-to-r from-[#ECB774] to-[#87CEEB] rounded-full mt-3"
              ></motion.div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsData.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col justify-between p-6 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl shadow-lg rounded-2xl text-[#1e4b6b] hover:shadow-xl transition-all duration-300 border border-[#ECB774]/20 hover:border-[#ECB774]/40 hover:scale-105"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{stat.title}</span>
                  <span className="text-[#ECB774] text-xl">{stat.icon}</span>
                </div>
                <div className="text-3xl font-bold mt-2 bg-gradient-to-r from-[#1e4b6b] to-[#8B6B43] bg-clip-text text-transparent">
                  {stat.value}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        {/* Product Trends Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-[#ECB774]/20 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold bg-gradient-to-r from-[#1e4b6b] to-[#8B6B43] bg-clip-text text-transparent">
              Product and Category Trends
            </h2>
            <div className="flex gap-2">
              {["Monthly", "Quarterly", "Yearly"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTimeFilter(filter)}
                  className={`px-3 py-1 text-sm rounded-full transition-all duration-300 ${
                    timeFilter === filter
                      ? "bg-gradient-to-r from-[#ECB774] to-[#87CEEB] text-white shadow-md"
                      : "bg-[#1e4b6b]/5 text-[#1e4b6b] hover:bg-[#1e4b6b]/10"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={productTrends}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#ECB774"
                opacity={0.1}
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#1e4b6b" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#1e4b6b" }}
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "0.5rem",
                  border: "1px solid rgba(236, 183, 116, 0.2)",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="products"
                name="Products"
                stroke="#ECB774"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="categories"
                name="Categories"
                stroke="#87CEEB"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="brands"
                name="Brands"
                stroke="#1e4b6b"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Brand Performance Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-[#ECB774]/20 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold bg-gradient-to-r from-[#1e4b6b] to-[#8B6B43] bg-clip-text text-transparent">
              Brand Performance
            </h2>
            <button className="px-3 py-1 text-sm rounded-full bg-[#1e4b6b]/5 text-[#1e4b6b] hover:bg-[#1e4b6b]/10 transition-all duration-300 flex items-center gap-2">
              <FaFilter className="text-sm" />
              Filter
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={brandPerformance}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#ECB774"
                opacity={0.1}
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#1e4b6b" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#1e4b6b" }}
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "0.5rem",
                  border: "1px solid rgba(236, 183, 116, 0.2)",
                }}
              />
              <Legend />
              <Bar
                dataKey="sales"
                name="Sales"
                fill="#ECB774"
                radius={[5, 5, 0, 0]}
              />
              <Bar
                dataKey="revenue"
                name="Revenue"
                fill="#87CEEB"
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-[#ECB774]/20 hover:shadow-xl transition-all duration-300"
        >
          <h2 className="text-lg font-semibold bg-gradient-to-r from-[#1e4b6b] to-[#8B6B43] bg-clip-text text-transparent mb-4">
            Category Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                label={({ name, value }) => `${name} (${value})`}
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "0.5rem",
                  border: "1px solid rgba(236, 183, 116, 0.2)",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Sales Growth Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-[#ECB774]/20 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold bg-gradient-to-r from-[#1e4b6b] to-[#8B6B43] bg-clip-text text-transparent">
              Sales Growth
            </h2>
            <div className="flex gap-2">
              {["Sales", "Growth"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setChartFilter(filter)}
                  className={`px-3 py-1 text-sm rounded-full transition-all duration-300 ${
                    chartFilter === filter
                      ? "bg-gradient-to-r from-[#ECB774] to-[#87CEEB] text-white shadow-md"
                      : "bg-[#1e4b6b]/5 text-[#1e4b6b] hover:bg-[#1e4b6b]/10"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#ECB774"
                opacity={0.1}
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#1e4b6b" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#1e4b6b" }}
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "0.5rem",
                  border: "1px solid rgba(236, 183, 116, 0.2)",
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey={chartFilter === "Sales" ? "sales" : "growth"}
                name={chartFilter === "Sales" ? "Sales" : "Growth Rate"}
                stroke="#ECB774"
                fill="url(#colorGradient)"
                fillOpacity={0.3}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ECB774" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#87CEEB" stopOpacity={0.2} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
