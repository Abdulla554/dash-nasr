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
import Tilt from "react-parallax-tilt";

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
    { title: "Total Products", value: demoProducts?.length || 0, icon: <FaBox /> },
    { title: "Total Categories", value: categories?.length || 0, icon: <FaLayerGroup /> },
    { title: "Total Brands", value: demoBrands?.length || 0, icon: <FaTrademark /> },
    { title: "Active Products", value: demoProducts?.length || 0, icon: <FaChartLine /> },
  ];

  const productTrends = [
    { month: "January", products: 980, categories: 42, brands: 65 },
    { month: "February", products: 1050, categories: 44, brands: 68 },
    { month: "March", products: 1150, categories: 46, brands: 70 },
    { month: "April", products: 1250, categories: 48, brands: 75 },
  ];

  const categoryDistribution = [
    { name: "Electronics", value: 320, fill: "#1A73E8" },
    { name: "Clothing", value: 280, fill: "#00CFFF" },
    { name: "Furniture", value: 220, fill: "#1B3C73" },
    { name: "Home Essentials", value: 180, fill: "#B0BEC5" },
    { name: "Others", value: 250, fill: "#121212" },
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
      className="min-h-screen bg-nsr-dark"
      dir="ltr"
    >
      {/* Luxurious Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-nsr-primary to-nsr-secondary rounded-b-[2rem] shadow-xl">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-15"></div>
          <div className="absolute inset-0 bg-nsr-accent/20"></div>
        </div>

        <div className="relative py-12 px-6">
          <div className="flex items-center gap-5 mb-8">
            <motion.div
              whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
              className="p-4 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 neon-glow-primary"
            >
              <Sparkles className="h-8 w-8 text-white" />
            </motion.div>
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
                className="text-4xl font-bold py-2 text-white"
              >
                NSR-PC Dashboard
              </motion.h1>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "12rem" }}
                transition={{ delay: 0.5, duration: 1, ease: "easeInOut" }}
                className="h-1 bg-nsr-accent rounded-full mt-3"
              ></motion.div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsData.map((stat, index) => (
              <Tilt
                key={index}
                glareEnable={true}
                glareMaxOpacity={0.2}
                scale={1.05}
                transitionSpeed={250}
               
                className="card-nsr flex flex-col justify-between p-6 bg-nsr-secondary/80 backdrop-blur-xl shadow-lg rounded-2xl text-nsr-primary hover:shadow-xl transition-all duration-300 border border-nsr-primary/20 hover:border-nsr-accent/40 hover:scale-105"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">{stat.title}</span>
                  <span className="text-nsr-accent text-xl">{stat.icon}</span>
                </div>
                <div className="text-3xl font-bold mt-2 text-white">
                  {stat.value}
                </div>
              </Tilt>
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
          className="card-nsr bg-nsr-secondary/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-nsr-primary/20 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-nsr-primary">
              Product and Category Trends
            </h2>
            <div className="flex gap-2">
              {["Monthly", "Quarterly", "Yearly"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTimeFilter(filter)}
                  className={`px-3 py-1 text-sm rounded-full transition-all duration-300 ${timeFilter === filter
                      ? "bg-nsr-primary text-white shadow-md"
                      : "bg-nsr-primary/5 text-nsr-primary hover:bg-nsr-primary/10"
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
                stroke="#1A73E8"
                opacity={0.1}
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#1A73E8" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#1A73E8" }}
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(27, 60, 115, 0.9)",
                  borderRadius: "0.5rem",
                  border: "1px solid rgba(26, 115, 232, 0.2)",
                  color: "#B0BEC5"
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="products"
                name="Products"
                stroke="#1A73E8"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="categories"
                name="Categories"
                stroke="#00CFFF"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="brands"
                name="Brands"
                stroke="#1B3C73"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Brand Performance Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-[#068DF1]/20 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[#068DF1]">
              Brand Performance
            </h2>
            <button className="px-3 py-1 text-sm rounded-full bg-[#068DF1]/5 text-[#068DF1] hover:bg-[#068DF1]/10 transition-all duration-300 flex items-center gap-2">
              <FaFilter className="text-sm" />
              Filter
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={brandPerformance}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#068DF1"
                opacity={0.1}
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#068DF1" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#068DF1" }}
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "0.5rem",
                  border: "1px solid rgba(6, 141, 241, 0.2)",
                }}
              />
              <Legend />
              <Bar
                dataKey="sales"
                name="Sales"
                fill="#068DF1"
                radius={[5, 5, 0, 0]}
              />
              <Bar
                dataKey="revenue"
                name="Revenue"
                fill="#1FA0FF"
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-[#068DF1]/20 hover:shadow-xl transition-all duration-300"
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
                  border: "1px solid rgba(6, 141, 241, 0.2)",
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
          className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-[#068DF1]/20 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[#068DF1]">
              Sales Growth
            </h2>
            <div className="flex gap-2">
              {["Sales", "Growth"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setChartFilter(filter)}
                  className={`px-3 py-1 text-sm rounded-full transition-all duration-300 ${chartFilter === filter
                      ? "bg-[#068DF1] text-white shadow-md"
                      : "bg-[#068DF1]/5 text-[#068DF1] hover:bg-[#068DF1]/10"
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
                stroke="#068DF1"
                opacity={0.1}
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#068DF1" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#068DF1" }}
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "0.5rem",
                  border: "1px solid rgba(6, 141, 241, 0.2)",
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey={chartFilter === "Sales" ? "sales" : "growth"}
                name={chartFilter === "Sales" ? "Sales" : "Growth Rate"}
                stroke="#068DF1"
                fill="url(#colorGradient)"
                fillOpacity={0.3}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#068DF1" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#1FA0FF" stopOpacity={0.2} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
