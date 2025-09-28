import React from "react";
import {
  FaShoppingCart,
  FaUsers,
  FaTicketAlt,
  FaArrowUp,
  FaArrowDown,
  FaEquals,
  FaEye,
  FaStar,
  FaTrophy,
  FaSun,
  FaMoon,
  FaDollarSign,
  FaExchangeAlt,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useCurrency } from "../hooks/useCurrency";
import { useDashboardData } from "../hooks/useDashboardQuery";
import { useOrders } from "../hooks/useOrdersQuery";
import ExchangeRateModal from "../components/ExchangeRateModal";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
export default function LuxuryDashboard() {
  // إزالة نظام الثيم - استخدام ألوان ثابتة
  const {
    currency,
    exchangeRate,
    showExchangeModal,
    setShowExchangeModal,
    toggleCurrency,
    updateExchangeRate,
    convertCurrency,
    getCurrencySymbol,
    getCurrencyCode
  } = useCurrency();

  // API Hooks with React Query
  const { dashboardData, loading: dashboardLoading, error: dashboardError, refetch: refetchDashboard } = useDashboardData();
  const { data: ordersData, isLoading: ordersLoading, error: ordersError } = useOrders({ limit: 5, sort: 'createdAt', order: 'desc' });
  const orders = React.useMemo(() => ordersData?.data || [], [ordersData?.data]);

  // Business Overview Data from API
  const businessOverview = React.useMemo(() => {
    const currencySymbol = getCurrencySymbol();

    // استخدام البيانات الفعلية من API
    const stats = dashboardData?.stats || {};

    // حسابات ديناميكية للنسب المئوية
    const calculateGrowthPercentage = (current, previous) => {
      if (!previous || previous === 0) return 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    // إضافة بيانات تاريخية وهمية للاختبار (يمكن استبدالها ببيانات حقيقية من API)
    const getHistoricalData = () => {
      return {
        lastMonth: {
          revenue: (stats.totalRevenue || 0) * 0.6,
          customers: Math.max(1, (stats.totalCustomers || 0) * 0.7),
          orders: Math.max(1, (stats.totalOrders || 0) * 0.8),
          visitors: Math.max(1, (stats.totalVisitors || 0) * 0.5)
        }
      };
    };

    const historicalData = getHistoricalData();

    // حساب النمو بناءً على البيانات التاريخية
    const revenueGrowth = calculateGrowthPercentage(
      stats.totalRevenue || 0,
      historicalData.lastMonth.revenue
    );

    const customersGrowth = calculateGrowthPercentage(
      stats.totalCustomers || 0,
      historicalData.lastMonth.customers
    );

    const ordersGrowth = calculateGrowthPercentage(
      stats.totalOrders || 0,
      historicalData.lastMonth.orders
    );

    const visitorsGrowth = calculateGrowthPercentage(
      stats.totalVisitors || 0,
      historicalData.lastMonth.visitors
    );

    return [
      {
        title: "إجمالي الإيرادات",
        value: `${currencySymbol}${convertCurrency(stats.totalRevenue || 0).toLocaleString()}`,
        change: `${revenueGrowth}%`,
        trend: revenueGrowth > 0 ? "up" : revenueGrowth < 0 ? "down" : "equal",
        icon: <FaShoppingCart className="text-[#749BC2]" />,
        gradient: "from-[#2C6D90] to-[#749BC2]"
      },
      {
        title: "إجمالي العملاء",
        value: (stats.totalCustomers || 0).toLocaleString(),
        change: `${customersGrowth}%`,
        trend: customersGrowth > 0 ? "up" : customersGrowth < 0 ? "down" : "equal",
        icon: <FaUsers className="text-[#749BC2]" />,
        gradient: "from-[#1a1a2e] to-[#2C6D90]"
      },
      {
        title: "إجمالي الطلبات",
        value: (stats.totalOrders || 0).toLocaleString(),
        change: `${ordersGrowth}%`,
        trend: ordersGrowth > 0 ? "up" : ordersGrowth < 0 ? "down" : "equal",
        icon: <FaTicketAlt className="text-[#749BC2]" />,
        gradient: "from-[#2C6D90] to-[#1a1a2e]"
      },
      {
        title: "عدد زوار الموقع",
        value: (stats.totalVisitors || 0).toLocaleString(),
        change: `${visitorsGrowth}%`,
        trend: visitorsGrowth > 0 ? "up" : visitorsGrowth < 0 ? "down" : "equal",
        icon: <FaUsers className="text-[#749BC2]" />,
        gradient: "from-[#749BC2] to-[#2C6D90]"
      },
    ];
  }, [dashboardData?.stats, getCurrencySymbol, convertCurrency]);

  // New Orders Data from API
  const newOrders = React.useMemo(() => {
    const currencySymbol = getCurrencySymbol();

    const ordersData = orders || [];

    return ordersData.map(order => ({
      orderNumber: order.id || order.orderNumber,
      customer: order.customer?.name || order.customerName || "عميل غير محدد",
      total: `${currencySymbol}${convertCurrency(order.total || 0).toLocaleString()}`,
      paid: order.paymentStatus === 'paid' || order.isPaid,
      status: order.status === 'pending' ? 'مفتوح' : order.status === 'completed' ? 'مغلق' : order.status,
      priority: order.priority === 'high' ? 'عالي' : order.priority === 'medium' ? 'متوسط' : 'منخفض'
    }));
  }, [orders, getCurrencySymbol, convertCurrency]);

  // Top Customers Data from Orders
  const topCustomers = React.useMemo(() => {
    const ordersData = orders || [];

    // تجميع العملاء من الطلبات
    const customerMap = new Map();

    ordersData.forEach(order => {
      const customerName = order.customer?.name || order.customerName || "عميل غير محدد";
      const customerEmail = order.customer?.email || order.customerEmail || "";

      if (customerMap.has(customerName)) {
        const existing = customerMap.get(customerName);
        existing.orders += 1;
        existing.totalSpent += order.total || 0;
      } else {
        customerMap.set(customerName, {
          customer: customerName,
          company: customerEmail || "غير محدد",
          rating: 5, // تقييم افتراضي
          orders: 1,
          totalSpent: order.total || 0
        });
      }
    });

    // تحويل إلى مصفوفة وترتيب حسب عدد الطلبات
    return Array.from(customerMap.values())
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5); // أول 5 عملاء
  }, [orders]);

  // Memoized utility functions for better performance
  const getTrendIcon = React.useCallback((trend) => {
    switch (trend) {
      case 'up': return <FaArrowUp className="w-3 h-3" />;
      case 'down': return <FaArrowDown className="w-3 h-3" />;
      default: return <FaEquals className="w-3 h-3" />;
    }
  }, []);

  const getTrendColor = React.useCallback((trend) => {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-[#749BC2]';
    }
  }, []);

  const getPriorityColor = React.useCallback((priority) => {
    switch (priority) {
      case 'عالي': return 'bg-red-500';
      case 'متوسط': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  }, []);

  // Loading and Error States
  const isLoading = dashboardLoading || ordersLoading;
  const hasError = dashboardError || ordersError;

  // Refresh handler
  const handleRefresh = React.useCallback(() => {
    refetchDashboard();
  }, [refetchDashboard]);

  // Show error only if both API calls fail and no data is available
  const showError = hasError && !dashboardData && !orders && !isLoading;

  // Error Component (only show if no fallback data)
  if (showError) {
    return (
      <div className="min-h-screen bg-[#1a1a2e]" dir="rtl">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center p-8 rounded-2xl backdrop-blur-sm border bg-[#F9F3EF]/10 border-[#749BC2]/20">
            <FaExclamationTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-[#F9F3EF]">
              خطأ في تحميل البيانات
            </h2>
            <p className="mb-4 text-[#F9F3EF]/80">
              {dashboardError || ordersError}
            </p>
            <button
              onClick={handleRefresh}
              className="px-6 py-3 bg-[#2C6D90] hover:bg-[#2C6D90]/90 text-[#F9F3EF] rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#2C6D90]/25"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </div>
    );
  }

  // مكون الأزرار المخصصة للهيدر
  const customActions = (
    <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
      {/* Currency Toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleCurrency}
        className="group p-3 backdrop-blur-sm border rounded-2xl transition-all duration-300 flex items-center gap-2 bg-[#749BC2]/20 border-[#749BC2]/30 hover:border-[#2C6D90]/30"
        title={`التبديل إلى ${currency === 'USD' ? 'الدينار العراقي' : 'الدولار الأمريكي'}`}
      >
        {currency === 'USD' ? <FaDollarSign className="w-5 h-5 text-[#F9F3EF]" /> : <FaExchangeAlt className="w-5 h-5 text-[#F9F3EF]" />}
        <span className="font-semibold text-[#F9F3EF] text-sm">{getCurrencyCode()}</span>
      </motion.button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1a1a2e]" dir="rtl">
      {/* Header */}
      <div className="relative backdrop-blur-sm border-b bg-[#F9F3EF]/5 border-[#749BC2]/20">
        <div className="absolute inset-0 bg-gradient-to-r from-[#2C6D90]/10 to-[#749BC2]/10"></div>
        <div className="relative px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 sm:p-4 bg-gradient-to-r from-[#2C6D90] to-[#749BC2] rounded-xl sm:rounded-2xl">
                <FaShoppingCart className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F9F3EF]">لوحة التحكم الرئيسية</h1>
                <p className="text-[#F9F3EF]/70 mt-1 sm:mt-2 text-sm sm:text-base lg:text-lg">مرحباً بك في نظام الإدارة المتقدم</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 w-full lg:w-auto">
              {customActions}
            </div>
          </div>
        </div>
      </div>

      {/* Business Overview */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2 text-[#F9F3EF]">نظرة عامة على الأعمال</h2>
          <p className="text-[#F9F3EF]/70">
            {hasError ? 'الخادم غير متاح - لا توجد بيانات متاحة' : 'تتبع أداء عملك في الوقت الفعلي'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {isLoading ? (
            // Loading skeleton for business overview
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="group relative">
                <div className="relative backdrop-blur-sm border rounded-2xl p-4 sm:p-6 bg-[#F9F3EF]/5 border-[#749BC2]/20">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 backdrop-blur-sm rounded-xl border bg-[#749BC2]/10 border-[#749BC2]/20">
                        <FaSpinner className="w-6 h-6 animate-spin text-[#749BC2]" />
                      </div>
                      <div className="h-6 bg-[#749BC2]/20 rounded animate-pulse w-32"></div>
                    </div>
                    <div className="h-8 bg-[#749BC2]/20 rounded-full animate-pulse w-16"></div>
                  </div>
                  <div className="h-12 bg-[#749BC2]/20 rounded animate-pulse mb-2"></div>
                  <div className="h-1 bg-[#749BC2]/20 rounded animate-pulse"></div>
                </div>
              </div>
            ))
          ) : (
            businessOverview.map((item, index) => (
              <div key={index} className="group relative">
                {/* Background with gradient */}
                <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-2xl opacity-80 group-hover:opacity-90 transition-all duration-300`}></div>

                {/* Glass effect overlay */}
                <div className="relative backdrop-blur-sm border rounded-2xl p-4 sm:p-6 hover:border-[#2C6D90]/50 transition-all duration-300 group-hover:transform group-hover:scale-105 bg-[#F9F3EF]/10 border-[#749BC2]/20">
                  <div className="flex items-start justify-between mb-4 sm:mb-6">
                    <div className="flex items-center gap-2 sm:gap-4">
                      <div className="p-2 sm:p-3 backdrop-blur-sm rounded-xl border bg-[#749BC2]/20 border-[#749BC2]/30">
                        {item.icon}
                      </div>
                      <div>
                        <span className="font-medium text-sm sm:text-lg text-[#F9F3EF]">{item.title}</span>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-sm bg-[#749BC2]/20 ${getTrendColor(item.trend)}`}>
                      {getTrendIcon(item.trend)}
                      <span className="font-semibold">{item.change}</span>
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-[#F9F3EF]">{item.value}</div>
                  <div className="w-full h-1 rounded-full overflow-hidden bg-[#749BC2]/20">
                    <div className="h-full rounded-full w-3/4 animate-pulse bg-gradient-to-r from-[#2C6D90] to-[#749BC2]"></div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* New Orders and Top Customer */}
      <div className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* New Orders */}
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#1a1a2e] to-[#2C6D90]/20"></div>
            <div className="relative backdrop-blur-sm border rounded-2xl overflow-hidden hover:border-[#2C6D90]/50 transition-all duration-300 bg-[#F9F3EF]/5 border-[#749BC2]/20">
              <div className="p-4 sm:p-6 border-b border-[#749BC2]/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-1 text-[#F9F3EF]">الطلبات الجديدة</h3>
                    <p className="text-sm sm:text-base text-[#F9F3EF]/70">آخر الطلبات الواردة</p>
                  </div>

                </div>
              </div>

              <div className="overflow-x-auto">
                {isLoading ? (
                  // Loading skeleton for orders table
                  <div className="p-4 sm:p-6">
                    <div className="space-y-4">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="flex items-center justify-between p-3 sm:p-4 rounded-xl border border-[#749BC2]/10">
                          <div className="flex items-center gap-2 sm:gap-4">
                            <div className="h-4 bg-[#749BC2]/20 rounded animate-pulse w-16 sm:w-20"></div>
                            <div className="h-4 bg-[#749BC2]/20 rounded animate-pulse w-24 sm:w-32"></div>
                            <div className="h-4 bg-[#749BC2]/20 rounded animate-pulse w-20 sm:w-24"></div>
                            <div className="h-4 bg-[#749BC2]/20 rounded animate-pulse w-12 sm:w-16"></div>
                            <div className="h-4 bg-[#749BC2]/20 rounded animate-pulse w-16 sm:w-20"></div>
                            <div className="h-4 bg-[#749BC2]/20 rounded animate-pulse w-12 sm:w-16"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="min-w-full">
                    {/* Desktop Table */}
                    <table className="w-full hidden sm:table">
                      <thead>
                        <tr className="border-b border-[#749BC2]/10">
                          <th className="px-2 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-semibold text-[#F9F3EF]/80">رقم الطلب</th>
                          <th className="px-2 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-semibold text-[#F9F3EF]/80 hidden sm:table-cell">العميل</th>
                          <th className="px-2 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-semibold text-[#F9F3EF]/80">المجموع</th>
                          <th className="px-2 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-semibold text-[#F9F3EF]/80 hidden sm:table-cell">الدفع</th>
                          <th className="px-2 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-semibold text-[#F9F3EF]/80">الحالة</th>
                          <th className="px-2 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-semibold text-[#F9F3EF]/80 hidden sm:table-cell">الأولوية</th>
                        </tr>
                      </thead>
                      <tbody>
                        {newOrders.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="px-2 sm:px-6 py-8 text-center text-[#F9F3EF]/60 text-sm">
                              لا توجد طلبات جديدة
                            </td>
                          </tr>
                        ) : (
                          newOrders.map((order, index) => (
                            <tr key={index} className="border-b border-[#749BC2]/5 hover:bg-[#F9F3EF]/5 transition-colors duration-300">
                              <td className="px-2 sm:px-6 py-3 sm:py-4">
                                <span className="font-mono text-[#749BC2] font-semibold text-xs sm:text-sm">#{order.orderNumber}</span>
                              </td>
                              <td className="px-2 sm:px-6 py-3 sm:py-4 font-medium text-[#F9F3EF] hidden sm:table-cell text-sm">{order.customer}</td>
                              <td className="px-2 sm:px-6 py-3 sm:py-4 font-semibold text-[#F9F3EF]/80 text-xs sm:text-sm">{order.total}</td>
                              <td className="px-2 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                                {order.paid ? (
                                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-xs sm:text-sm">✓</span>
                                  </div>
                                ) : (
                                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-500 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-xs sm:text-sm">✗</span>
                                  </div>
                                )}
                              </td>
                              <td className="px-2 sm:px-6 py-3 sm:py-4">
                                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'مفتوح'
                                  ? 'bg-[#749BC2]/20 text-[#749BC2] border border-[#749BC2]/30'
                                  : 'bg-[#F9F3EF]/10 text-[#F9F3EF]/70 border border-[#F9F3EF]/20'
                                  }`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-2 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                                <div className={`w-3 h-3 rounded-full ${getPriorityColor(order.priority)}`}></div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>

                    {/* Mobile Slider */}
                    <div className="sm:hidden">
                      {newOrders.length === 0 ? (
                        <div className="text-center py-8 text-[#F9F3EF]/60 text-sm">
                          لا توجد طلبات جديدة
                        </div>
                      ) : (
                        <div className="flex gap-4 overflow-x-auto pb-4 px-4">
                          {newOrders.map((order, index) => (
                            <div key={index} className="flex-shrink-0 w-72 bg-[#F9F3EF]/5 border border-[#749BC2]/20 rounded-xl p-4">
                              <div className="flex items-center justify-between mb-3">
                                <span className="font-mono text-[#749BC2] font-semibold text-sm">#{order.orderNumber}</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status === 'مفتوح'
                                  ? 'bg-[#749BC2]/20 text-[#749BC2] border border-[#749BC2]/30'
                                  : 'bg-[#F9F3EF]/10 text-[#F9F3EF]/70 border border-[#F9F3EF]/20'
                                  }`}>
                                  {order.status}
                                </span>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-[#F9F3EF]/70 text-sm">العميل:</span>
                                  <span className="text-[#F9F3EF] text-sm font-medium">{order.customer}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                  <span className="text-[#F9F3EF]/70 text-sm">المجموع:</span>
                                  <span className="text-[#F9F3EF] text-sm font-semibold">{order.total}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                  <span className="text-[#F9F3EF]/70 text-sm">الدفع:</span>
                                  <div className="flex items-center gap-2">
                                    {order.paid ? (
                                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                        <span className="text-white font-bold text-xs">✓</span>
                                      </div>
                                    ) : (
                                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                        <span className="text-white font-bold text-xs">✗</span>
                                      </div>
                                    )}
                                    <span className="text-xs text-[#F9F3EF]/70">
                                      {order.paid ? 'مدفوع' : 'غير مدفوع'}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between">
                                  <span className="text-[#F9F3EF]/70 text-sm">الأولوية:</span>
                                  <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(order.priority)}`}></div>
                                    <span className="text-xs text-[#F9F3EF]/70">{order.priority}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Top Customers */}
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#1a1a2e] to-[#749BC2]/20"></div>
            <div className="relative backdrop-blur-sm border rounded-2xl hover:border-[#2C6D90]/50 transition-all duration-300 bg-[#F9F3EF]/5 border-[#749BC2]/20">
              <div className="p-4 sm:p-6 border-b border-[#749BC2]/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-1 text-[#F9F3EF]">أهم العملاء</h3>
                    <p className="text-sm sm:text-base text-[#F9F3EF]/70">العملاء الأكثر نشاطاً</p>
                  </div>

                </div>
              </div>

              <div className="p-4 sm:p-6">
                {isLoading ? (
                  // Loading skeleton for top customers
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-xl border border-[#749BC2]/10">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#749BC2]/20 rounded-full animate-pulse"></div>
                          <div>
                            <div className="h-4 bg-[#749BC2]/20 rounded animate-pulse w-32 mb-2"></div>
                            <div className="h-3 bg-[#749BC2]/20 rounded animate-pulse w-24"></div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="h-4 bg-[#749BC2]/20 rounded animate-pulse w-8 mb-1"></div>
                            <div className="h-3 bg-[#749BC2]/20 rounded animate-pulse w-12"></div>
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <div key={i} className="w-3 h-3 bg-[#749BC2]/20 rounded animate-pulse"></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {/* Desktop View */}
                    <div className="space-y-4 hidden sm:block">
                      {topCustomers.length === 0 ? (
                        <div className="text-center py-8 text-[#F9F3EF]/60">
                          لا توجد طلبات لعرض العملاء
                        </div>
                      ) : (
                        topCustomers.map((customer, index) => (
                          <div key={index} className="group flex items-center justify-between p-3 sm:p-4 rounded-xl border transition-all duration-300 hover:border-[#2C6D90]/30 bg-[#F9F3EF]/5 hover:bg-[#F9F3EF]/10 border-[#749BC2]/10">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gradient-to-r from-[#2C6D90] to-[#749BC2] rounded-full flex items-center justify-center text-[#F9F3EF] font-bold text-lg">
                                {customer.customer.split(',')[0][0]}
                              </div>
                              <div>
                                <div className="font-semibold text-[#F9F3EF]">{customer.customer}</div>
                                <div className="text-sm text-[#F9F3EF]/70">{customer.company}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-center">
                                <div className="text-[#749BC2] font-bold">{customer.orders}</div>
                                <div className="text-xs text-[#F9F3EF]/50">طلب</div>
                              </div>
                              <div className="text-center">
                                <div className="text-[#749BC2] font-bold text-sm">
                                  {getCurrencySymbol()}{convertCurrency(customer.totalSpent || 0).toLocaleString()}
                                </div>
                                <div className="text-xs text-[#F9F3EF]/50">إجمالي</div>
                              </div>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <FaStar
                                    key={i}
                                    className={`w-3 h-3 ${i < customer.rating ? 'text-yellow-400' : 'text-[#749BC2]/30'
                                      }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Mobile Slider */}
                    <div className="sm:hidden">
                      {topCustomers.length === 0 ? (
                        <div className="text-center py-8 text-[#F9F3EF]/60 text-sm">
                          لا توجد طلبات لعرض العملاء
                        </div>
                      ) : (
                        <div className="flex gap-4 overflow-x-auto pb-4 px-4">
                          {topCustomers.map((customer, index) => (
                            <div key={index} className="flex-shrink-0 w-64 bg-[#F9F3EF]/5 border border-[#749BC2]/20 rounded-xl p-4">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-[#2C6D90] to-[#749BC2] rounded-full flex items-center justify-center text-[#F9F3EF] font-bold text-sm">
                                  {customer.customer.split(',')[0][0]}
                                </div>
                                <div>
                                  <div className="font-semibold text-[#F9F3EF] text-sm">{customer.customer}</div>
                                  <div className="text-xs text-[#F9F3EF]/70">{customer.company}</div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-[#F9F3EF]/70 text-xs">الطلبات:</span>
                                  <span className="text-[#749BC2] font-bold text-sm">{customer.orders}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                  <span className="text-[#F9F3EF]/70 text-xs">الإجمالي:</span>
                                  <span className="text-[#749BC2] font-bold text-sm">
                                    {getCurrencySymbol()}{convertCurrency(customer.totalSpent || 0).toLocaleString()}
                                  </span>
                                </div>

                                <div className="flex items-center justify-between">
                                  <span className="text-[#F9F3EF]/70 text-xs">التقييم:</span>
                                  <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                      <FaStar
                                        key={i}
                                        className={`w-3 h-3 ${i < customer.rating ? 'text-yellow-400' : 'text-[#749BC2]/30'
                                          }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exchange Rate Modal */}
      <ExchangeRateModal
        isOpen={showExchangeModal}
        onClose={() => setShowExchangeModal(false)}
        onUpdateRate={updateExchangeRate}
        currentRate={exchangeRate}
      />
    </div>
  );
}