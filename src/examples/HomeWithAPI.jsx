import React, { useEffect, useState } from "react";
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
import { useDashboardData, useProducts } from "../hooks";
import ExchangeRateModal from "../components/ExchangeRateModal";

export default function HomeWithAPI() {
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

    // Use API hooks
    const { dashboardData, loading: dashboardLoading, error: dashboardError } = useDashboardData();
    const { products, loading: productsLoading, getFeaturedProducts, getBestsellers } = useProducts();

    // Local state for additional data
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [bestsellers, setBestsellers] = useState([]);

    // Fetch additional data on component mount
    useEffect(() => {
        const fetchAdditionalData = async () => {
            try {
                const [featured, best] = await Promise.all([
                    getFeaturedProducts(),
                    getBestsellers()
                ]);
                setFeaturedProducts(featured);
                setBestsellers(best);
            } catch (error) {
                console.error('Error fetching additional data:', error);
            }
        };

        fetchAdditionalData();
    }, [getFeaturedProducts, getBestsellers]);

    // Business Overview Data - Now using real API data
    const businessOverview = [
        {
            title: "الأرباح هذا الشهر",
            value: dashboardData?.stats?.monthlyRevenue
                ? `${getCurrencySymbol()}${convertCurrency(dashboardData.stats.monthlyRevenue).toLocaleString()}`
                : `${getCurrencySymbol()}0`,
            change: dashboardData?.stats?.revenueChange || "0%",
            trend: dashboardData?.stats?.revenueTrend || "up",
            icon: <FaShoppingCart className="text-blue-400" />,
            gradient: "from-blue-600 to-blue-800"
        },
        {
            title: "الزوار الشهريين",
            value: dashboardData?.stats?.monthlyVisitors?.toLocaleString() || "0",
            change: dashboardData?.stats?.visitorsChange || "0%",
            trend: dashboardData?.stats?.visitorsTrend || "up",
            icon: <FaUsers className="text-blue-300" />,
            gradient: "from-slate-700 to-slate-900"
        },
        {
            title: "الطلبات الجديدة",
            value: dashboardData?.stats?.newOrders?.toLocaleString() || "0",
            change: dashboardData?.stats?.ordersChange || "0%",
            trend: dashboardData?.stats?.ordersTrend || "equal",
            icon: <FaTicketAlt className="text-blue-200" />,
            gradient: "from-blue-500 to-blue-700"
        },
    ];

    // New Orders Data - Using real API data
    const newOrders = dashboardData?.ordersChart?.recentOrders || [];

    // Top Customers Data - Using real API data
    const topCustomers = dashboardData?.stats?.topCustomers || [];

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

    // Loading state
    if (dashboardLoading) {
        return (
            <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${isDark ? 'bg-gradient-nsr-dark' : 'bg-gradient-nsr-light'
                }`}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-nsr-accent mx-auto"></div>
                    <p className={`mt-4 text-lg transition-colors duration-300 ${isDark ? 'text-nsr-light' : 'text-nsr-dark'
                        }`}>جاري تحميل البيانات...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (dashboardError) {
        return (
            <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${isDark ? 'bg-gradient-nsr-dark' : 'bg-gradient-nsr-light'
                }`}>
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <p className={`text-lg transition-colors duration-300 ${isDark ? 'text-nsr-light' : 'text-nsr-dark'
                        }`}>خطأ في تحميل البيانات: {dashboardError}</p>
                </div>
            </div>
        );
    }

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

            {/* Featured Products Section */}
            {featuredProducts.length > 0 && (
                <div className="px-8 pb-8">
                    <div className="mb-6">
                        <h2 className={`text-2xl font-bold mb-2 transition-colors duration-300 ${isDark ? 'text-nsr-light' : 'text-nsr-dark'
                            }`}>المنتجات المميزة</h2>
                        <p className={`transition-colors duration-300 ${isDark ? 'text-nsr-light-200' : 'text-nsr-dark-600'
                            }`}>أفضل منتجاتنا المختارة</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredProducts.slice(0, 6).map((product) => (
                            <div key={product.id} className={`backdrop-blur-sm border rounded-2xl p-6 hover:border-nsr-accent/30 transition-all duration-300 ${isDark
                                ? 'bg-nsr-secondary/30 border-nsr-primary/20'
                                : 'bg-nsr-light/80 border-nsr-primary/20 shadow-lg'
                                }`}>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-16 h-16 bg-gradient-to-r from-nsr-accent to-nsr-primary rounded-xl flex items-center justify-center">
                                        <FaTrophy className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <h3 className={`font-bold text-lg transition-colors duration-300 ${isDark ? 'text-nsr-light' : 'text-nsr-dark'
                                            }`}>{product.title}</h3>
                                        <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-nsr-light-200' : 'text-nsr-dark-600'
                                            }`}>{product.brand}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className={`text-2xl font-bold transition-colors duration-300 ${isDark ? 'text-nsr-accent' : 'text-nsr-primary'
                                        }`}>
                                        {getCurrencySymbol()}{convertCurrency(product.price).toLocaleString()}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <FaStar className="w-4 h-4 text-yellow-400 fill-current" />
                                        <span className={`text-sm transition-colors duration-300 ${isDark ? 'text-nsr-light-200' : 'text-nsr-dark-600'
                                            }`}>{product.rating}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

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
