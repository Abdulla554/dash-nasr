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

    const stats = dashboardData?.stats || {
      monthlyRevenue: 0,
      revenueChange: 0,
      monthlyVisitors: 0,
      visitorsChange: 0,
      newOrders: 0,
      ordersChange: 0
    };

    return [
      {
        title: "الأرباح هذا الشهر",
        value: `${currencySymbol}${convertCurrency(stats.monthlyRevenue || 0).toLocaleString()}`,
        change: `${stats.revenueChange || 0}%`,
        trend: stats.revenueChange > 0 ? "up" : stats.revenueChange < 0 ? "down" : "equal",
        icon: <FaShoppingCart className="text-[#749BC2]" />,
        gradient: "from-[#2C6D90] to-[#749BC2]"
      },
      {
        title: "الزوار الشهريين",
        value: (stats.monthlyVisitors || 0).toLocaleString(),
        change: `${stats.visitorsChange || 0}%`,
        trend: stats.visitorsChange > 0 ? "up" : stats.visitorsChange < 0 ? "down" : "equal",
        icon: <FaUsers className="text-[#749BC2]" />,
        gradient: "from-[#1a1a2e] to-[#2C6D90]"
      },
      {
        title: "الطلبات الجديدة",
        value: (stats.newOrders || 0).toLocaleString(),
        change: `${stats.ordersChange || 0}%`,
        trend: stats.ordersChange > 0 ? "up" : stats.ordersChange < 0 ? "down" : "equal",
        icon: <FaTicketAlt className="text-[#749BC2]" />,
        gradient: "from-[#2C6D90] to-[#1a1a2e]"
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

  // Top Customers Data from API
  const topCustomers = React.useMemo(() => {
    const customersData = dashboardData?.analytics?.topCustomers || [];

    return customersData.map(customer => ({
      customer: customer.name || customer.customerName,
      company: customer.company || customer.organization || "غير محدد",
      rating: customer.rating || customer.averageRating || 5,
      orders: customer.totalOrders || customer.ordersCount || 0
    }));
  }, [dashboardData?.analytics?.topCustomers]);

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

  return (
    <div className="min-h-screen bg-[#1a1a2e]" dir="rtl">
      {/* Header */}
      <div className="relative backdrop-blur-sm border-b bg-[#F9F3EF]/5 border-[#749BC2]/20">
        <div className="absolute inset-0 bg-gradient-to-r from-[#2C6D90]/10 to-transparent"></div>
        <div className="relative px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#F9F3EF]">
                لوحة التحكم الرئيسية
              </h1>
              <p className="mt-1 text-[#F9F3EF]/70">مرحباً بك في نظام الإدارة المتقدم</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleCurrency}
                className="p-3 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 bg-[#749BC2]/20 hover:bg-[#749BC2]/30 border border-[#749BC2]/30 text-[#F9F3EF]"
                title={`التبديل إلى ${currency === 'USD' ? 'الدينار العراقي' : 'الدولار الأمريكي'}`}
              >
                {currency === 'USD' ? <FaDollarSign className="w-5 h-5" /> : <FaExchangeAlt className="w-5 h-5" />}
                <span className="text-sm font-medium">{getCurrencyCode()}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Business Overview */}
      <div className="px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2 text-[#F9F3EF]">نظرة عامة على الأعمال</h2>
          <p className="text-[#F9F3EF]/70">
            {hasError ? 'الخادم غير متاح - لا توجد بيانات متاحة' : 'تتبع أداء عملك في الوقت الفعلي'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading ? (
            // Loading skeleton for business overview
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="group relative">
                <div className="relative backdrop-blur-sm border rounded-2xl p-6 bg-[#F9F3EF]/5 border-[#749BC2]/20">
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
                <div className="relative backdrop-blur-sm border rounded-2xl p-6 hover:border-[#2C6D90]/50 transition-all duration-300 group-hover:transform group-hover:scale-105 bg-[#F9F3EF]/10 border-[#749BC2]/20">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 backdrop-blur-sm rounded-xl border bg-[#749BC2]/20 border-[#749BC2]/30">
                        {item.icon}
                      </div>
                      <div>
                        <span className="font-medium text-lg text-[#F9F3EF]">{item.title}</span>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-sm bg-[#749BC2]/20 ${getTrendColor(item.trend)}`}>
                      {getTrendIcon(item.trend)}
                      <span className="font-semibold">{item.change}</span>
                    </div>
                  </div>
                  <div className="text-4xl font-bold mb-2 text-[#F9F3EF]">{item.value}</div>
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
      <div className="px-8 pb-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* New Orders */}
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#1a1a2e] to-[#2C6D90]/20"></div>
            <div className="relative backdrop-blur-sm border rounded-2xl overflow-hidden hover:border-[#2C6D90]/50 transition-all duration-300 bg-[#F9F3EF]/5 border-[#749BC2]/20">
              <div className="p-6 border-b border-[#749BC2]/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-1 text-[#F9F3EF]">الطلبات الجديدة</h3>
                    <p className="text-[#F9F3EF]/70">آخر الطلبات الواردة</p>
                  </div>
                  <button className="group flex items-center gap-2 px-4 py-2 bg-[#2C6D90] hover:bg-[#2C6D90]/90 text-[#F9F3EF] rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#2C6D90]/25">
                    عرض الكل
                    <FaEye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                {isLoading ? (
                  // Loading skeleton for orders table
                  <div className="p-6">
                    <div className="space-y-4">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="flex items-center justify-between p-4 rounded-xl border border-[#749BC2]/10">
                          <div className="flex items-center gap-4">
                            <div className="h-4 bg-[#749BC2]/20 rounded animate-pulse w-20"></div>
                            <div className="h-4 bg-[#749BC2]/20 rounded animate-pulse w-32"></div>
                            <div className="h-4 bg-[#749BC2]/20 rounded animate-pulse w-24"></div>
                            <div className="h-4 bg-[#749BC2]/20 rounded animate-pulse w-16"></div>
                            <div className="h-4 bg-[#749BC2]/20 rounded animate-pulse w-20"></div>
                            <div className="h-4 bg-[#749BC2]/20 rounded animate-pulse w-16"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#749BC2]/10">
                        <th className="px-6 py-4 text-right text-sm font-semibold text-[#F9F3EF]/80">رقم الطلب</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-[#F9F3EF]/80">العميل</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-[#F9F3EF]/80">المجموع</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-[#F9F3EF]/80">الدفع</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-[#F9F3EF]/80">الحالة</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-[#F9F3EF]/80">الأولوية</th>
                      </tr>
                    </thead>
                    <tbody>
                      {newOrders.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-8 text-center text-[#F9F3EF]/60">
                            لا توجد طلبات جديدة
                          </td>
                        </tr>
                      ) : (
                        newOrders.map((order, index) => (
                          <tr key={index} className="border-b border-[#749BC2]/5 hover:bg-[#F9F3EF]/5 transition-colors duration-300">
                            <td className="px-6 py-4">
                              <span className="font-mono text-[#749BC2] font-semibold">#{order.orderNumber}</span>
                            </td>
                            <td className="px-6 py-4 font-medium text-[#F9F3EF]">{order.customer}</td>
                            <td className="px-6 py-4 font-semibold text-[#F9F3EF]/80">{order.total}</td>
                            <td className="px-6 py-4">
                              {order.paid ? (
                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                  <span className="text-white font-bold text-sm">✓</span>
                                </div>
                              ) : (
                                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                  <span className="text-white font-bold text-sm">✗</span>
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                order.status === 'مفتوح'
                                  ? 'bg-[#749BC2]/20 text-[#749BC2] border border-[#749BC2]/30'
                                  : 'bg-[#F9F3EF]/10 text-[#F9F3EF]/70 border border-[#F9F3EF]/20'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className={`w-3 h-3 rounded-full ${getPriorityColor(order.priority)}`}></div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          {/* Top Customers */}
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#1a1a2e] to-[#749BC2]/20"></div>
            <div className="relative backdrop-blur-sm border rounded-2xl hover:border-[#2C6D90]/50 transition-all duration-300 bg-[#F9F3EF]/5 border-[#749BC2]/20">
              <div className="p-6 border-b border-[#749BC2]/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-1 text-[#F9F3EF]">أهم العملاء</h3>
                    <p className="text-[#F9F3EF]/70">العملاء الأكثر نشاطاً</p>
                  </div>
                  <button className="group flex items-center gap-2 px-4 py-2 bg-[#2C6D90] hover:bg-[#2C6D90]/90 text-[#F9F3EF] rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#2C6D90]/25">
                    عرض الكل
                    <FaEye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>

              <div className="p-6">
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
                  <div className="space-y-4">
                    {topCustomers.length === 0 ? (
                      <div className="text-center py-8 text-[#F9F3EF]/60">
                        لا توجد بيانات عملاء متاحة
                      </div>
                    ) : (
                      topCustomers.map((customer, index) => (
                        <div key={index} className="group flex items-center justify-between p-4 rounded-xl border transition-all duration-300 hover:border-[#2C6D90]/30 bg-[#F9F3EF]/5 hover:bg-[#F9F3EF]/10 border-[#749BC2]/10">
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
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <FaStar
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < customer.rating ? 'text-yellow-400' : 'text-[#749BC2]/30'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
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