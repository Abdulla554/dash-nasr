import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
    Search,
    Filter,
    Eye,
    Edit,
    Trash,
    ShoppingCart,
    TrendingUp,
    Award,
    Zap,
    Sun,
    Moon,
    DollarSign,
    Package,
    User,
    Calendar,
    MapPin,
    CreditCard,
    Truck,
    CheckCircle,
    Clock,
    XCircle
} from "lucide-react";
import { motion as _motion } from "framer-motion";

import { useTheme } from "../../contexts/ThemeContext.jsx";
import { useCurrency } from "../../contexts/CurrencyContext.jsx";
import { useOrders, useCreateOrder, useUpdateOrder, useDeleteOrder } from "../../hooks/useOrdersQuery";
import ExchangeRateModal from "../../components/ExchangeRateModal.jsx";

export default function AllOrdersPage() {
    const { isDark, toggleTheme } = useTheme();
    const { convertCurrency, getCurrencySymbol, getCurrencyCode, toggleCurrency, showExchangeModal, setShowExchangeModal, exchangeRate, updateExchangeRate } = useCurrency();
    const [searchTerm, setSearchTerm] = useState('');

    // Orders hooks
    const { data: ordersData, isLoading: ordersLoading, error: ordersError } = useOrders();

    console.log("Orders loading:", ordersLoading);
    console.log("Orders error:", ordersError);
    // eslint-disable-next-line no-unused-vars
    const createOrderMutation = useCreateOrder();
    // eslint-disable-next-line no-unused-vars
    const updateOrderMutation = useUpdateOrder();
    // eslint-disable-next-line no-unused-vars
    const deleteOrderMutation = useDeleteOrder();

    const orders = ordersData?.data || [];

    console.log("Orders data:", ordersData);
    console.log("Orders array:", orders);
    console.log("Orders length:", orders.length);
    console.log("First order:", orders[0]);

    const [filters, setFilters] = useState({
        status: 'all',
        dateRange: 'all',
        sortBy: 'newest'
    });

    // Filter orders
    const filteredOrders = orders.filter(order => {
        const matchesSearch = (order.orderNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.customerEmail || '').toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filters.status === 'all' || order.status === filters.status;

        return matchesSearch && matchesStatus;
    });

    // Sort orders
    const sortedOrders = [...filteredOrders].sort((a, b) => {
        switch (filters.sortBy) {
            case 'newest':
                return new Date(b.createdAt || b.orderDate) - new Date(a.createdAt || a.orderDate);
            case 'oldest':
                return new Date(a.createdAt || a.orderDate) - new Date(b.createdAt || b.orderDate);
            case 'total-high':
                return (b.totalAmount || b.total || 0) - (a.totalAmount || a.total || 0);
            case 'total-low':
                return (a.totalAmount || a.total || 0) - (b.totalAmount || b.total || 0);
            default:
                return 0;
        }
    });

    console.log("Filtered orders:", filteredOrders);
    console.log("Sorted orders:", sortedOrders);

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
            case 'COMPLETED':
                return 'bg-green-500/20 text-green-300 border-green-500/30';
            case 'processing':
            case 'PROCESSING':
                return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
            case 'shipped':
            case 'SHIPPED':
                return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
            case 'pending':
            case 'PENDING':
                return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
            case 'cancelled':
            case 'CANCELLED':
                return 'bg-red-500/20 text-red-300 border-red-500/30';
            case 'CONFIRMED':
                return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
            case 'DELIVERED':
                return 'bg-green-600/20 text-green-400 border-green-600/30';
            default:
                return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
            case 'COMPLETED':
                return <CheckCircle size={16} />;
            case 'processing':
            case 'PROCESSING':
                return <Clock size={16} />;
            case 'shipped':
            case 'SHIPPED':
                return <Truck size={16} />;
            case 'pending':
            case 'PENDING':
                return <Clock size={16} />;
            case 'cancelled':
            case 'CANCELLED':
                return <XCircle size={16} />;
            case 'CONFIRMED':
                return <CheckCircle size={16} />;
            case 'DELIVERED':
                return <CheckCircle size={16} />;
            default:
                return <Clock size={16} />;
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'completed':
            case 'COMPLETED':
                return 'مكتمل';
            case 'processing':
            case 'PROCESSING':
                return 'قيد المعالجة';
            case 'shipped':
            case 'SHIPPED':
                return 'تم الشحن';
            case 'pending':
            case 'PENDING':
                return 'في الانتظار';
            case 'cancelled':
            case 'CANCELLED':
                return 'ملغي';
            case 'CONFIRMED':
                return 'مؤكد';
            case 'DELIVERED':
                return 'تم التسليم';
            default:
                return 'غير محدد';
        }
    };

    const getPaymentMethodText = (method) => {
        switch (method) {
            case 'credit_card':
                return 'بطاقة ائتمان';
            case 'bank_transfer':
                return 'تحويل بنكي';
            case 'cash_on_delivery':
                return 'الدفع عند الاستلام';
            default:
                return 'غير محدد';
        }
    };

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const handleDelete = (id) => {
        setSelectedOrderId(id);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        toast.success(`تم حذف الطلب رقم ${selectedOrderId} بنجاح`, {
            position: "top-right",
            autoClose: 3000,
        });
        setDeleteModalOpen(false);
        setSelectedOrderId(null);
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A]" dir="rtl">
            {/* Exchange Rate Modal */}
            <ExchangeRateModal
                isOpen={showExchangeModal}
                onClose={() => setShowExchangeModal(false)}
                onUpdateRate={updateExchangeRate}
                currentRate={exchangeRate}
            />

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className={`rounded-2xl p-8 max-w-md w-full mx-4 transition-colors duration-300 ${isDark ? 'bg-nsr-secondary border border-nsr-primary/20' : 'bg-white border border-gray-200 shadow-xl'}`}>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className={`text-xl font-bold mb-2 transition-colors duration-300 ${isDark ? 'text-nsr-primary' : 'text-gray-900'}`}>
                                تأكيد الحذف
                            </h3>
                            <p className={`mb-6 transition-colors duration-300 ${isDark ? 'text-nsr-neutral' : 'text-gray-600'}`}>
                                هل أنت متأكد من حذف هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteModalOpen(false)}
                                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-colors duration-300 ${isDark ? 'bg-nsr-primary/10 text-nsr-primary hover:bg-nsr-primary/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                    إلغاء
                                </button>
                                <button
                                    onClick={handleConfirmDelete}
                                    className="flex-1 py-3 px-4 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors duration-300"
                                >
                                    حذف
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="relative backdrop-blur-sm border-b bg-[#1A1A2E]/30 border-[#2C6D90]/20">
                <div className="absolute inset-0 bg-gradient-to-r from-[#2C6D90]/10 to-[#2C6D90]/10"></div>
                <div className="relative px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="p-3 sm:p-4 bg-gradient-to-r from-[#2C6D90] to-[#2C6D90] rounded-xl sm:rounded-2xl">
                                <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F9F3EF]">إدارة الطلبات</h1>
                                <p className="text-[#F9F3EF]/70 mt-1 sm:mt-2 text-sm sm:text-base lg:text-lg">إدارة شاملة لجميع طلبات العملاء</p>
                            </div>
                        </div>

                      
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {[
                        { title: "إجمالي الطلبات", value: orders.length, icon: ShoppingCart, color: "from-nsr-accent to-nsr-primary", change: "+15%" },
                        { title: "الطلبات المكتملة", value: orders.filter(o => o.status === 'completed' || o.status === 'COMPLETED').length, icon: CheckCircle, color: "from-emerald-600 to-emerald-800", change: "+8%" },
                        { title: "قيد المعالجة", value: orders.filter(o => o.status === 'processing' || o.status === 'PROCESSING').length, icon: Clock, color: "from-blue-600 to-blue-800", change: "+12%" },
                        { title: "إجمالي المبيعات", value: orders.reduce((sum, order) => sum + (order.totalAmount || order.total || 0), 0), icon: TrendingUp, color: "from-purple-600 to-purple-800", change: "+23%" }
                    ].map((stat, index) => (
                        <div key={index} className="group relative">
                            <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl opacity-80 group-hover:opacity-90 transition-all duration-300`}></div>
                            <div className={`relative backdrop-blur-sm border rounded-2xl p-6 transition-all duration-300 group-hover:transform group-hover:scale-105 ${isDark ? 'bg-nsr-secondary/30 border-nsr-primary/20 hover:border-nsr-accent/30' : 'bg-white/70 border-gray-200 hover:border-nsr-accent/30 shadow-sm'}`}>
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 backdrop-blur-sm rounded-xl border ${isDark ? 'bg-nsr-primary/10 border-nsr-primary/20' : 'bg-white/20 border-gray-300/20'}`}>
                                        <stat.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-emerald-400 font-semibold text-sm">{stat.change}</span>
                                </div>
                                <div className="text-3xl font-bold text-white mb-1">
                                    {stat.title === "إجمالي المبيعات" ?
                                        `${getCurrencySymbol()}${convertCurrency(stat.value).toLocaleString()}` :
                                        stat.value
                                    }
                                </div>
                                <div className="text-white/80 text-sm">{stat.title}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filters and Search */}
            <div className="px-8 pb-6">
                <div className="backdrop-blur-sm border rounded-2xl p-6 bg-[#F9F3EF]/5 border-[#2C6D90]/20">
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Search Bar */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#F9F3EF]/70" size={20} />
                                <input
                                    type="text"
                                    placeholder="البحث في الطلبات..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pr-12 pl-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 bg-[#F9F3EF]/10 border-[#2C6D90]/30 text-[#F9F3EF] placeholder-[#F9F3EF]/50 focus:border-[#2C6D90] focus:ring-[#2C6D90]/20"
                                />
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap gap-4">
                            {/* Status */}
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 bg-[#F9F3EF]/10 border-[#2C6D90]/30 text-[#F9F3EF] focus:border-[#2C6D90] focus:ring-[#2C6D90]/20"
                            >
                                <option value="all">جميع الحالات</option>
                                <option value="PENDING">في الانتظار</option>
                                <option value="CONFIRMED">مؤكد</option>
                                <option value="PROCESSING">قيد المعالجة</option>
                                <option value="SHIPPED">تم الشحن</option>
                                <option value="DELIVERED">تم التسليم</option>
                                <option value="COMPLETED">مكتمل</option>
                                <option value="CANCELLED">ملغي</option>
                            </select>

                            {/* Sort */}
                            <select
                                value={filters.sortBy}
                                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                                className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 bg-[#F9F3EF]/10 border-[#2C6D90]/30 text-[#F9F3EF] focus:border-[#2C6D90] focus:ring-[#2C6D90]/20"
                            >
                                <option value="newest">الأحدث</option>
                                <option value="oldest">الأقدم</option>
                                <option value="total-high">الأعلى قيمة</option>
                                <option value="total-low">الأقل قيمة</option>
                            </select>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="mt-4 flex items-center justify-between">
                        <p className={`transition-colors duration-300 ${isDark ? 'text-nsr-neutral' : 'text-black'}`}>
                            عرض {sortedOrders.length} من {orders.length} طلب
                        </p>
                        <div className="flex items-center gap-2">
                            <Filter size={16} className="text-nsr-accent" />
                            <span className={`text-sm transition-colors duration-300 ${isDark ? 'text-nsr-neutral' : 'text-gray-700'}`}>فلاتر نشطة</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="px-8 pb-8">
                {ordersLoading ? (
                    <div className="text-center py-20 bg-gradient-to-r from-slate-800/80 to-slate-900/80 rounded-2xl border border-white/10">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                        <h3 className="text-2xl font-bold text-white mb-2">جاري تحميل الطلبات...</h3>
                        <p className="text-slate-400">يرجى الانتظار</p>
                    </div>
                ) : ordersError ? (
                    <div className="text-center py-20 bg-gradient-to-r from-red-800/80 to-red-900/80 rounded-2xl border border-red-500/20">
                        <XCircle size={48} className="text-red-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-2">خطأ في تحميل الطلبات</h3>
                        <p className="text-red-300 mb-6">{ordersError.message || 'حدث خطأ غير متوقع'}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors duration-300"
                        >
                            إعادة المحاولة
                        </button>
                    </div>
                ) : sortedOrders.length === 0 ? (
                    <div className="text-center py-20 bg-gradient-to-r from-slate-800/80 to-slate-900/80 rounded-2xl border border-white/10">
                        <Search size={48} className="text-blue-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-2">لم يتم العثور على طلبات</h3>
                        <p className="text-slate-400 mb-6">جرب تغيير الفلاتر أو البحث بكلمات مختلفة</p>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setFilters({ status: 'all', dateRange: 'all', sortBy: 'newest' });
                            }}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors duration-300"
                        >
                            إعادة تعيين الفلاتر
                        </button>
                    </div>
                ) : (
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-slate-800/80 to-slate-900/80">
                                    <tr>
                                        <th className="px-6 py-4 text-right text-blue-400 font-semibold">رقم الطلب</th>
                                        <th className="px-6 py-4 text-right text-blue-400 font-semibold">العميل</th>
                                        <th className="px-6 py-4 text-right text-blue-400 font-semibold">المنتجات</th>
                                        <th className="px-6 py-4 text-right text-blue-400 font-semibold">المجموع</th>
                                        <th className="px-6 py-4 text-right text-blue-400 font-semibold">الحالة</th>
                                        <th className="px-6 py-4 text-right text-blue-400 font-semibold">تاريخ الطلب</th>
                                        <th className="px-6 py-4 text-right text-blue-400 font-semibold">الإجراءات</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {sortedOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-white/5 transition-colors duration-300">
                                            {/* رقم الطلب */}
                                            <td className="px-6 py-4">
                                                <Link to={`/orders/${order.id}`} className="block hover:bg-white/5 rounded-lg p-2 -m-2 transition-colors duration-300">
                                                    <div className="space-y-1">
                                                        <div className="text-sm font-semibold text-white hover:text-blue-300 transition-colors duration-300">
                                                            {order.orderNumber || `طلب #${order.id.slice(-6)}`}
                                                        </div>
                                                        <div className="text-xs text-slate-400">
                                                            #{order.id.slice(-6)}
                                                        </div>
                                                    </div>
                                                </Link>
                                            </td>

                                            {/* العميل */}
                                            <td className="px-6 py-4">
                                                <Link to={`/orders/${order.id}`} className="block hover:bg-white/5 rounded-lg p-2 -m-2 transition-colors duration-300">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <User size={14} className="text-blue-400" />
                                                            <span className="text-sm font-medium text-white hover:text-blue-300 transition-colors duration-300">
                                                                {order.customerName}
                                                            </span>
                                                        </div>
                                                        <div className="text-xs text-slate-400">
                                                            {order.customerEmail}
                                                        </div>
                                                        <div className="text-xs text-slate-500">
                                                            {order.customerPhone}
                                                        </div>
                                                    </div>
                                                </Link>
                                            </td>

                                            {/* المنتجات */}
                                            <td className="px-6 py-4">
                                                <Link to={`/orders/${order.id}`} className="block hover:bg-white/5 rounded-lg p-2 -m-2 transition-colors duration-300">
                                                    <div className="space-y-2">
                                                        {order.items && order.items.length > 0 ? (
                                                            <>
                                                                {order.items.slice(0, 2).map((item, index) => (
                                                                    <div key={index} className="flex items-center gap-2">
                                                                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                                                            <Package size={14} className="text-white" />
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <div className="text-xs text-white truncate hover:text-blue-300 transition-colors duration-300">
                                                                                {item.product?.name || `منتج #${item.productId?.slice(-6) || 'غير محدد'}`}
                                                                            </div>
                                                                            <div className="text-xs text-slate-400">
                                                                                الكمية: {item.quantity} × {getCurrencySymbol()}{convertCurrency(item.price || 0).toLocaleString()}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {order.items.length > 2 && (
                                                                    <div className="text-xs text-slate-500">
                                                                        +{order.items.length - 2} منتج آخر
                                                                    </div>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <div className="text-xs text-slate-500">لا توجد منتجات</div>
                                                        )}
                                                    </div>
                                                </Link>
                                            </td>

                                            {/* المجموع */}
                                            <td className="px-6 py-4">
                                                <Link to={`/orders/${order.id}`} className="block hover:bg-white/5 rounded-lg p-2 -m-2 transition-colors duration-300">
                                                    <div className="space-y-1">
                                                        <div className="text-lg font-bold text-blue-400 hover:text-blue-300 transition-colors duration-300">
                                                            {getCurrencySymbol()}{convertCurrency(order.totalAmount || order.total || 0).toLocaleString()}
                                                        </div>
                                                        <div className="text-xs text-slate-400">
                                                            {order.paymentMethod ? getPaymentMethodText(order.paymentMethod) : 'غير محدد'}
                                                        </div>
                                                    </div>
                                                </Link>
                                            </td>

                                            {/* الحالة */}
                                            <td className="px-6 py-4">
                                                <Link to={`/orders/${order.id}`} className="block hover:bg-white/5 rounded-lg p-2 -m-2 transition-colors duration-300">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getStatusColor(order.status)} hover:opacity-80 transition-opacity duration-300`}>
                                                            <div className="flex items-center gap-1">
                                                                {getStatusIcon(order.status)}
                                                                {getStatusText(order.status)}
                                                            </div>
                                                        </span>
                                                    </div>
                                                </Link>
                                            </td>

                                            {/* تاريخ الطلب */}
                                            <td className="px-6 py-4">
                                                <Link to={`/orders/${order.id}`} className="block hover:bg-white/5 rounded-lg p-2 -m-2 transition-colors duration-300">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar size={12} className="text-slate-400" />
                                                            <span className="text-sm text-white hover:text-blue-300 transition-colors duration-300">
                                                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString('ar-SA') : 'غير محدد'}
                                                            </span>
                                                        </div>
                                                        {order.updatedAt && order.updatedAt !== order.createdAt && (
                                                            <div className="flex items-center gap-1">
                                                                <Clock size={12} className="text-slate-400" />
                                                                <span className="text-xs text-slate-400">
                                                                    محدث: {new Date(order.updatedAt).toLocaleDateString('ar-SA')}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </Link>
                                            </td>

                                            {/* الإجراءات */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {/* <Link to={`/orders/${order.id}`}>
                                                        <_motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            className="group p-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-xl hover:bg-blue-500/30 transition-all duration-300"
                                                        >
                                                            <Eye size={16} className="group-hover:scale-110 transition-transform" />
                                                        </_motion.button>
                                                    </Link>

                                                    <_motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        className="group p-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-xl hover:bg-emerald-500/30 transition-all duration-300"
                                                    >
                                                        <Edit size={16} className="group-hover:scale-110 transition-transform" />
                                                    </_motion.button> */}

                                                    <_motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleDelete(order.id)}
                                                        className="group p-2 bg-red-500/20 border border-red-500/30 text-red-300 rounded-xl hover:bg-red-500/30 transition-all duration-300"
                                                    >
                                                        <Trash size={16} className="group-hover:scale-110 transition-transform" />
                                                    </_motion.button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
