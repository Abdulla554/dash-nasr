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
} from "react-icons/fa";
import { useTheme } from "../hooks/useTheme";
import { useCurrency } from "../hooks/useCurrency";
import ExchangeRateModal from "../components/ExchangeRateModal";

export default function LuxuryDashboard() {
  const { isDark, toggleTheme } = useTheme();
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
  // Business Overview Data
  const businessOverview = [
    {
      title: "الأرباح هذا الشهر",
      value: `${getCurrencySymbol()}${convertCurrency(5240).toLocaleString()}`,
      change: "50%",
      trend: "up",
      icon: <FaShoppingCart className="text-blue-400" />,
      gradient: "from-blue-600 to-blue-800"
    },
    {
      title: "الزوار الشهريين",
      value: "3,045",
      change: "80%",
      trend: "up",
      icon: <FaUsers className="text-blue-300" />,
      gradient: "from-slate-700 to-slate-900"
    },
    {
      title: "القسائم المُصدرة",
      value: "3,045",
      change: "30%",
      trend: "equal",
      icon: <FaTicketAlt className="text-blue-200" />,
      gradient: "from-blue-500 to-blue-700"
    },
  ];

  // New Orders Data
  const newOrders = [
    { orderNumber: "653518", customer: "Murphy, Kathryn", total: `${getCurrencySymbol()}${convertCurrency(13.23).toLocaleString()}`, paid: true, status: "مفتوح", priority: "عالي" },
    { orderNumber: "449003", customer: "Miles, Floyd", total: `${getCurrencySymbol()}${convertCurrency(13.23).toLocaleString()}`, paid: true, status: "مغلق", priority: "متوسط" },
    { orderNumber: "651535", customer: "Fox, Robert", total: `${getCurrencySymbol()}${convertCurrency(13.23).toLocaleString()}`, paid: true, status: "مفتوح", priority: "عالي" },
    { orderNumber: "267400", customer: "McKinney, Marvin", total: `${getCurrencySymbol()}${convertCurrency(13.23).toLocaleString()}`, paid: true, status: "مغلق", priority: "منخفض" },
    { orderNumber: "487441", customer: "Simmons, Brooklyn", total: `${getCurrencySymbol()}${convertCurrency(13.23).toLocaleString()}`, paid: true, status: "مفتوح", priority: "عالي" },
  ];

  // Top Customers Data
  const topCustomers = [
    { customer: "Murphy, Kathryn", company: "Louis Vuitton", rating: 5, orders: 24 },
    { customer: "Miles, Floyd", company: "Apple", rating: 5, orders: 18 },
    { customer: "Fox, Robert", company: "McDonald's", rating: 4, orders: 15 },
    { customer: "McKinney, Marvin", company: "Starbucks", rating: 5, orders: 12 },
    { customer: "Simmons, Brooklyn", company: "Gillette", rating: 4, orders: 9 },
  ];

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <FaArrowUp className="w-3 h-3" />;
      case 'down': return <FaArrowDown className="w-3 h-3" />;
      default: return <FaEquals className="w-3 h-3" />;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up': return 'text-emerald-400';
      case 'down': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'عالي': return 'bg-red-500';
      case 'متوسط': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark
      ? 'bg-gradient-nsr-dark'
      : 'bg-gradient-nsr-light'
      }`} dir="rtl">
      {/* Header */}
      <div className={`relative backdrop-blur-sm border-b transition-colors duration-300 ${isDark
        ? 'bg-nsr-secondary/50 border-nsr-primary/20'
        : 'bg-nsr-light/95 border-nsr-primary/20 shadow-sm'
        }`}>
        <div className={`absolute inset-0 transition-colors duration-300 ${isDark ? 'bg-gradient-to-r from-nsr-accent/10 to-transparent' : 'bg-gradient-to-r from-nsr-secondary/5 to-transparent'
          }`}></div>
        <div className="relative px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold transition-colors duration-300 ${isDark
                ? 'text-nsr-light'
                : 'text-nsr-dark'
                }`}>
                لوحة التحكم الرئيسية
              </h1>
              <p className={`mt-1 transition-colors duration-300 ${isDark ? 'text-nsr-light-200' : 'text-nsr-dark-600'
                }`}>مرحباً بك في نظام الإدارة المتقدم</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleCurrency}
                className={`p-3 rounded-xl transition-all duration-300 hover:scale-105 flex items-center text-black gap-2 ${isDark
                  ? 'bg-nsr-primary/10 hover:bg-nsr-primary/20 text-nsr-accent border border-nsr-primary/20'
                  
                  : 'bg-nsr-light-100 hover:bg-nsr-light-200 text-nsr-accent border border-nsr-primary/20'
                  }`}
                title={`التبديل إلى ${currency === 'USD' ? 'الدينار العراقي' : 'الدولار الأمريكي'}`}
              >
                {currency === 'USD' ? <FaDollarSign className="w-5 h-5" /> : <FaExchangeAlt className="w-5 h-5" />}
                <span className="text-sm font-medium text-black">{getCurrencyCode()}</span>
              </button>
              <button
                onClick={toggleTheme}
                className={`p-3 rounded-xl transition-all duration-300 hover:scale-105 text-black ${isDark
                  ? 'bg-nsr-primary/10 hover:bg-nsr-primary/20 text-nsr-accent border border-nsr-primary/20'
                  : 'bg-nsr-light-100 hover:bg-nsr-light-200 text-nsr-accent border border-nsr-primary/20'
                  }`}
              >
                {isDark ? <FaSun className="w-5 h-5 text-white" /> : <FaMoon className="w-5 h-5 text-black" />}
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* Business Overview */}
      <div className="px-8 py-8">
        <div className="mb-8">
          <h2 className={`text-2xl font-bold mb-2 transition-colors duration-300 ${isDark ? 'text-nsr-light' : 'text-nsr-dark'
            }`}>نظرة عامة على الأعمال</h2>
          <p className={`transition-colors duration-300 ${isDark ? 'text-nsr-light-200' : 'text-nsr-dark-600'
            }`}>تتبع أداء عملك في الوقت الفعلي</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {businessOverview.map((item, index) => (
            <div key={index} className="group relative">
              {/* Background with gradient */}
              <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-2xl opacity-80 group-hover:opacity-90 transition-all duration-300`}></div>

              {/* Glass effect overlay */}
              <div className={`relative backdrop-blur-sm border rounded-2xl p-6 hover:border-nsr-accent/30 transition-all duration-300 group-hover:transform group-hover:scale-105 ${isDark
                ? 'bg-nsr-secondary/30 border-nsr-primary/20'
                : 'bg-nsr-light/80 border-nsr-primary/20 shadow-lg'
                }`}>
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 backdrop-blur-sm rounded-xl border transition-colors duration-300 ${isDark
                      ? 'bg-nsr-primary/10 border-nsr-primary/20'
                      : 'bg-nsr-light-100/80 border-nsr-primary/20'
                      }`}>
                      {item.icon}
                    </div>
                    <div>
                      <span className={`font-medium text-lg transition-colors duration-300 ${isDark ? 'text-nsr-light' : 'text-nsr-dark'
                        }`}>{item.title}</span>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-sm transition-colors duration-300 ${getTrendColor(item.trend)} ${isDark ? 'bg-nsr-primary/10' : 'bg-nsr-light-100/80'
                    }`}>
                    {getTrendIcon(item.trend)}
                    <span className="font-semibold">{item.change}</span>
                  </div>
                </div>
                <div className={`text-4xl font-bold mb-2 transition-colors duration-300 ${isDark ? 'text-nsr-light' : 'text-nsr-dark'
                  }`}>{item.value}</div>
                <div className={`w-full h-1 rounded-full overflow-hidden transition-colors duration-300 ${isDark ? 'bg-nsr-primary/20' : 'bg-nsr-light-200'
                  }`}>
                  <div className={`h-full rounded-full w-3/4 animate-pulse transition-colors duration-300 ${isDark
                    ? 'bg-gradient-nsr-elegant'
                    : 'bg-gradient-nsr-secondary'
                    }`}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Orders and Top Customer */}
      <div className="px-8 pb-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* New Orders */}
          <div className="relative">
            <div className={`absolute inset-0 rounded-2xl transition-colors duration-300 ${isDark
              ? 'bg-gradient-nsr-secondary'
              : 'bg-nsr-light/80'
              }`}></div>
            <div className={`relative backdrop-blur-sm border rounded-2xl overflow-hidden hover:border-nsr-accent/30 transition-all duration-300 ${isDark
              ? 'bg-nsr-secondary/30 border-nsr-primary/20'
              : 'bg-nsr-light/90 border-nsr-primary/20 shadow-lg'
              }`}>
              <div className={`p-6 border-b transition-colors duration-300 ${isDark ? 'border-nsr-primary/20' : 'border-nsr-primary/20'
                }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-2xl font-bold mb-1 transition-colors duration-300 ${isDark ? 'text-nsr-light' : 'text-nsr-dark'
                      }`}>الطلبات الجديدة</h3>
                    <p className={`transition-colors duration-300 ${isDark ? 'text-nsr-light-200' : 'text-nsr-dark-600'
                      }`}>آخر الطلبات الواردة</p>
                  </div>
                  <button className="group flex items-center gap-2 px-4 py-2 bg-nsr-accent hover:bg-nsr-accent/90 text-white rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-nsr-accent/25">
                    عرض الكل
                    <FaEye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b transition-colors duration-300 ${isDark ? 'border-white/10' : 'border-gray-200/50'
                      }`}>
                      <th className={`px-6 py-4 text-right text-sm font-semibold transition-colors duration-300 ${isDark ? 'text-slate-300' : 'text-gray-600'
                        }`}>رقم الطلب</th>
                      <th className={`px-6 py-4 text-right text-sm font-semibold transition-colors duration-300 ${isDark ? 'text-slate-300' : 'text-gray-600'
                        }`}>العميل</th>
                      <th className={`px-6 py-4 text-right text-sm font-semibold transition-colors duration-300 ${isDark ? 'text-slate-300' : 'text-gray-600'
                        }`}>المجموع</th>
                      <th className={`px-6 py-4 text-right text-sm font-semibold transition-colors duration-300 ${isDark ? 'text-slate-300' : 'text-gray-600'
                        }`}>الدفع</th>
                      <th className={`px-6 py-4 text-right text-sm font-semibold transition-colors duration-300 ${isDark ? 'text-slate-300' : 'text-gray-600'
                        }`}>الحالة</th>
                      <th className={`px-6 py-4 text-right text-sm font-semibold transition-colors duration-300 ${isDark ? 'text-slate-300' : 'text-gray-600'
                        }`}>الأولوية</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newOrders.map((order, index) => (
                      <tr key={index} className={`border-b transition-colors duration-300 hover:bg-opacity-50 ${isDark
                        ? 'border-white/5 hover:bg-white/5'
                        : 'border-gray-200/30 hover:bg-gray-50/50'
                        }`}>
                        <td className="px-6 py-4">
                          <span className="font-mono text-blue-400 font-semibold">#{order.orderNumber}</span>
                        </td>
                        <td className={`px-6 py-4 font-medium transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-800'
                          }`}>{order.customer}</td>
                        <td className={`px-6 py-4 font-semibold transition-colors duration-300 ${isDark ? 'text-slate-300' : 'text-gray-600'
                          }`}>{order.total}</td>
                        <td className="px-6 py-4">
                          {order.paid ? (
                            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-sm">✓</span>
                            </div>
                          ) : (
                            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-sm">✗</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-300 ${order.status === 'مفتوح'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : isDark
                              ? 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                              : 'bg-gray-200/50 text-gray-600 border border-gray-300/50'
                            }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`w-3 h-3 rounded-full ${getPriorityColor(order.priority)}`}></div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Top Customers */}
          <div className="relative">
            <div className={`absolute inset-0 rounded-2xl transition-colors duration-300 ${isDark
              ? 'bg-gradient-to-r from-slate-800/80 to-slate-900/80'
              : 'bg-white/80'
              }`}></div>
            <div className={`relative backdrop-blur-sm border rounded-2xl hover:border-blue-500/30 transition-all duration-300 ${isDark
              ? 'bg-white/5 border-white/10'
              : 'bg-white/90 border-gray-200/50 shadow-lg'
              }`}>
              <div className={`p-6 border-b transition-colors duration-300 ${isDark ? 'border-white/10' : 'border-gray-200/50'
                }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-2xl font-bold mb-1 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-800'
                      }`}>أهم العملاء</h3>
                    <p className={`transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-gray-500'
                      }`}>العملاء الأكثر نشاطاً</p>
                  </div>
                  <button className="group flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25">
                    عرض الكل
                    <FaEye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {topCustomers.map((customer, index) => (
                    <div key={index} className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-300 hover:border-blue-500/30 ${isDark
                      ? 'bg-white/5 hover:bg-white/10 border-white/10'
                      : 'bg-gray-50/50 hover:bg-gray-100/50 border-gray-200/50'
                      }`}>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {customer.customer.split(',')[0][0]}
                        </div>
                        <div>
                          <div className={`font-semibold transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-800'
                            }`}>{customer.customer}</div>
                          <div className={`text-sm transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-gray-500'
                            }`}>{customer.company}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-blue-400 font-bold">{customer.orders}</div>
                          <div className={`text-xs transition-colors duration-300 ${isDark ? 'text-slate-500' : 'text-gray-400'
                            }`}>طلب</div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`w-3 h-3 transition-colors duration-300 ${i < customer.rating
                                ? 'text-yellow-400'
                                : isDark ? 'text-slate-600' : 'text-gray-300'
                                }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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