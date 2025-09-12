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
import ExchangeRateModal from "../../components/ExchangeRateModal.jsx";

export default function AllOrdersPage() {
    const { isDark, toggleTheme } = useTheme();
    const { convertCurrency, getCurrencySymbol, getCurrencyCode, toggleCurrency, showExchangeModal, setShowExchangeModal, exchangeRate, updateExchangeRate } = useCurrency();
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        status: 'all',
        dateRange: 'all',
        sortBy: 'newest'
    });

    // Demo data for orders
    const demoOrders = [
        {
            id: 1,
            orderNumber: "ORD-2024-001",
            customer: {
                name: "أحمد محمد",
                email: "ahmed@example.com",
                phone: "+966501234567"
            },
            items: [
                {
                    id: 1,
                    name: "MacBook Pro 16-inch M3 Max",
                    price: 15999,
                    quantity: 1,
                    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100"
                },
                {
                    id: 2,
                    name: "Logitech MX Master 3S",
                    price: 299,
                    quantity: 2,
                    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100"
                }
            ],
            total: 16597,
            status: "completed",
            paymentMethod: "credit_card",
            shippingAddress: {
                street: "شارع الملك فهد",
                city: "الرياض",
                postalCode: "12345"
            },
            orderDate: "2024-01-15",
            deliveryDate: "2024-01-18",
            trackingNumber: "TRK123456789"
        },
        {
            id: 2,
            orderNumber: "ORD-2024-002",
            customer: {
                name: "فاطمة أحمد",
                email: "fatima@example.com",
                phone: "+966507654321"
            },
            items: [
                {
                    id: 3,
                    name: "Dell XPS 15 OLED",
                    price: 12999,
                    quantity: 1,
                    image: "https://images.unsplash.com/photo-1496181133206-7fd91fc51a46?w=100"
                }
            ],
            total: 12999,
            status: "processing",
            paymentMethod: "bank_transfer",
            shippingAddress: {
                street: "شارع العليا",
                city: "جدة",
                postalCode: "54321"
            },
            orderDate: "2024-01-16",
            deliveryDate: null,
            trackingNumber: "TRK987654321"
        },
        {
            id: 3,
            orderNumber: "ORD-2024-003",
            customer: {
                name: "محمد علي",
                email: "mohammed@example.com",
                phone: "+966509876543"
            },
            items: [
                {
                    id: 4,
                    name: "Samsung 49-inch Ultrawide Monitor",
                    price: 3999,
                    quantity: 1,
                    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=100"
                },
                {
                    id: 5,
                    name: "ASUS ROG Strix G16",
                    price: 11999,
                    quantity: 1,
                    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=100"
                }
            ],
            total: 15998,
            status: "shipped",
            paymentMethod: "credit_card",
            shippingAddress: {
                street: "شارع التحلية",
                city: "الدمام",
                postalCode: "67890"
            },
            orderDate: "2024-01-17",
            deliveryDate: "2024-01-20",
            trackingNumber: "TRK456789123"
        },
        {
            id: 4,
            orderNumber: "ORD-2024-004",
            customer: {
                name: "نورا السعد",
                email: "nora@example.com",
                phone: "+966501112233"
            },
            items: [
                {
                    id: 6,
                    name: "Logitech MX Master 3S",
                    price: 299,
                    quantity: 3,
                    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100"
                }
            ],
            total: 897,
            status: "cancelled",
            paymentMethod: "credit_card",
            shippingAddress: {
                street: "شارع الأمير محمد",
                city: "الخبر",
                postalCode: "11111"
            },
            orderDate: "2024-01-18",
            deliveryDate: null,
            trackingNumber: null
        },
        {
            id: 5,
            orderNumber: "ORD-2024-005",
            customer: {
                name: "خالد النعيم",
                email: "khalid@example.com",
                phone: "+966504445566"
            },
            items: [
                {
                    id: 1,
                    name: "MacBook Pro 16-inch M3 Max",
                    price: 15999,
                    quantity: 1,
                    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100"
                }
            ],
            total: 15999,
            status: "pending",
            paymentMethod: "cash_on_delivery",
            shippingAddress: {
                street: "شارع الملك عبدالعزيز",
                city: "الرياض",
                postalCode: "22222"
            },
            orderDate: "2024-01-19",
            deliveryDate: null,
            trackingNumber: null
        }
    ];

    // Filter orders
    const filteredOrders = demoOrders.filter(order => {
        const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filters.status === 'all' || order.status === filters.status;

        return matchesSearch && matchesStatus;
    });

    // Sort orders
    const sortedOrders = [...filteredOrders].sort((a, b) => {
        switch (filters.sortBy) {
            case 'newest':
                return new Date(b.orderDate) - new Date(a.orderDate);
            case 'oldest':
                return new Date(a.orderDate) - new Date(b.orderDate);
            case 'total-high':
                return b.total - a.total;
            case 'total-low':
                return a.total - b.total;
            default:
                return 0;
        }
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-500/20 text-green-300 border-green-500/30';
            case 'processing':
                return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
            case 'shipped':
                return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
            case 'pending':
                return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
            case 'cancelled':
                return 'bg-red-500/20 text-red-300 border-red-500/30';
            default:
                return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <CheckCircle size={16} />;
            case 'processing':
                return <Clock size={16} />;
            case 'shipped':
                return <Truck size={16} />;
            case 'pending':
                return <Clock size={16} />;
            case 'cancelled':
                return <XCircle size={16} />;
            default:
                return <Clock size={16} />;
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'completed':
                return 'مكتمل';
            case 'processing':
                return 'قيد المعالجة';
            case 'shipped':
                return 'تم الشحن';
            case 'pending':
                return 'في الانتظار';
            case 'cancelled':
                return 'ملغي';
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
        <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-nsr-dark' : 'bg-gray-50'}`} dir="rtl">
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
            <div className={`relative backdrop-blur-sm border-b transition-colors duration-300 ${isDark ? 'bg-nsr-secondary/50 border-nsr-primary/20' : 'bg-white/80 border-gray-200 shadow-sm'}`}>
                <div className="absolute inset-0 bg-gradient-to-r from-nsr-accent/10 to-transparent"></div>
                <div className="relative px-8 py-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-gradient-to-r from-nsr-accent to-nsr-primary rounded-2xl">
                                <ShoppingCart className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className={`text-4xl font-bold transition-colors duration-300 ${isDark ? 'text-nsr-primary' : 'text-black'}`}>
                                    إدارة الطلبات
                                </h1>
                                <p className={`mt-2 text-lg transition-colors duration-300 ${isDark ? 'text-nsr-neutral' : 'text-gray-800'}`}>إدارة شاملة لجميع طلبات العملاء</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Theme Toggle */}
                            <_motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={toggleTheme}
                                className={`group p-3 backdrop-blur-sm border rounded-2xl transition-all duration-300 ${isDark ? 'bg-nsr-primary/10 border-nsr-primary/20 hover:border-nsr-accent/30' : 'bg-white/60 border-gray-200 hover:border-nsr-accent/30 shadow-sm'}`}
                            >
                                {isDark ? (
                                    <Sun className={`h-6 w-6 transition-colors ${isDark ? 'text-nsr-accent group-hover:text-nsr-primary' : 'text-black group-hover:text-gray-800'}`} />
                                ) : (
                                    <Moon className={`h-6 w-6 transition-colors ${isDark ? 'text-nsr-accent group-hover:text-nsr-primary' : 'text-black group-hover:text-gray-800'}`} />
                                )}
                            </_motion.button>

                            {/* Currency Toggle */}
                            <_motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={toggleCurrency}
                                className={`group p-3 backdrop-blur-sm border rounded-2xl transition-all duration-300 flex items-center gap-2 ${isDark ? 'bg-nsr-primary/10 border-nsr-primary/20 hover:border-nsr-accent/30' : 'bg-white/60 border-gray-200 hover:border-nsr-accent/30 shadow-sm'}`}
                            >
                                <DollarSign className={`h-6 w-6 transition-colors ${isDark ? 'text-nsr-accent group-hover:text-nsr-primary' : 'text-black group-hover:text-gray-800'}`} />
                                <span className={`font-semibold transition-colors ${isDark ? 'text-nsr-accent group-hover:text-nsr-primary' : 'text-black group-hover:text-gray-800'}`}>{getCurrencyCode()}</span>
                            </_motion.button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {[
                        { title: "إجمالي الطلبات", value: demoOrders.length, icon: ShoppingCart, color: "from-nsr-accent to-nsr-primary", change: "+15%" },
                        { title: "الطلبات المكتملة", value: demoOrders.filter(o => o.status === 'completed').length, icon: CheckCircle, color: "from-emerald-600 to-emerald-800", change: "+8%" },
                        { title: "قيد المعالجة", value: demoOrders.filter(o => o.status === 'processing').length, icon: Clock, color: "from-blue-600 to-blue-800", change: "+12%" },
                        { title: "إجمالي المبيعات", value: demoOrders.reduce((sum, order) => sum + order.total, 0), icon: TrendingUp, color: "from-purple-600 to-purple-800", change: "+23%" }
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
                <div className={`backdrop-blur-sm border rounded-2xl p-6 transition-colors duration-300 ${isDark ? 'bg-nsr-secondary/30 border-nsr-primary/20' : 'bg-white/70 border-gray-200 shadow-sm'}`}>
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Search Bar */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${isDark ? 'text-nsr-neutral' : 'text-gray-700'}`} size={20} />
                                <input
                                    type="text"
                                    placeholder="البحث في الطلبات..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={`w-full pr-12 pl-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${isDark ? 'bg-nsr-secondary/50 border-nsr-primary/30 text-nsr-primary placeholder-nsr-neutral focus:border-nsr-accent focus:ring-nsr-accent/20' : 'bg-white border-gray-300 text-black placeholder-gray-500 focus:border-nsr-accent focus:ring-nsr-accent/20 shadow-sm'}`}
                                />
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap gap-4">
                            {/* Status */}
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                className={`px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${isDark ? 'bg-nsr-secondary/50 border-nsr-primary/30 text-nsr-primary focus:border-nsr-accent focus:ring-nsr-accent/20' : 'bg-white border-gray-300 text-black focus:border-nsr-accent focus:ring-nsr-accent/20 shadow-sm'}`}
                            >
                                <option value="all">جميع الحالات</option>
                                <option value="pending">في الانتظار</option>
                                <option value="processing">قيد المعالجة</option>
                                <option value="shipped">تم الشحن</option>
                                <option value="completed">مكتمل</option>
                                <option value="cancelled">ملغي</option>
                            </select>

                            {/* Sort */}
                            <select
                                value={filters.sortBy}
                                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                                className={`px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${isDark ? 'bg-nsr-secondary/50 border-nsr-primary/30 text-nsr-primary focus:border-nsr-accent focus:ring-nsr-accent/20' : 'bg-white border-gray-300 text-black focus:border-nsr-accent focus:ring-nsr-accent/20 shadow-sm'}`}
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
                            عرض {sortedOrders.length} من {demoOrders.length} طلب
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
                {sortedOrders.length === 0 ? (
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
                                                            {order.orderNumber}
                                                        </div>
                                                        <div className="text-xs text-slate-400">
                                                            #{order.id.toString().padStart(6, '0')}
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
                                                                {order.customer.name}
                                                            </span>
                                                        </div>
                                                        <div className="text-xs text-slate-400">
                                                            {order.customer.email}
                                                        </div>
                                                        <div className="text-xs text-slate-500">
                                                            {order.customer.phone}
                                                        </div>
                                                    </div>
                                                </Link>
                                            </td>

                                            {/* المنتجات */}
                                            <td className="px-6 py-4">
                                                <Link to={`/orders/${order.id}`} className="block hover:bg-white/5 rounded-lg p-2 -m-2 transition-colors duration-300">
                                                    <div className="space-y-2">
                                                        {order.items.slice(0, 2).map((item, index) => (
                                                            <div key={index} className="flex items-center gap-2">
                                                                <img
                                                                    src={item.image}
                                                                    alt={item.name}
                                                                    className="w-8 h-8 rounded-lg object-cover"
                                                                />
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="text-xs text-white truncate hover:text-blue-300 transition-colors duration-300">
                                                                        {item.name}
                                                                    </div>
                                                                    <div className="text-xs text-slate-400">
                                                                        الكمية: {item.quantity}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {order.items.length > 2 && (
                                                            <div className="text-xs text-slate-500">
                                                                +{order.items.length - 2} منتج آخر
                                                            </div>
                                                        )}
                                                    </div>
                                                </Link>
                                            </td>

                                            {/* المجموع */}
                                            <td className="px-6 py-4">
                                                <Link to={`/orders/${order.id}`} className="block hover:bg-white/5 rounded-lg p-2 -m-2 transition-colors duration-300">
                                                    <div className="space-y-1">
                                                        <div className="text-lg font-bold text-blue-400 hover:text-blue-300 transition-colors duration-300">
                                                            {getCurrencySymbol()}{convertCurrency(order.total).toLocaleString()}
                                                        </div>
                                                        <div className="text-xs text-slate-400">
                                                            {getPaymentMethodText(order.paymentMethod)}
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
                                                                {new Date(order.orderDate).toLocaleDateString('ar-SA')}
                                                            </span>
                                                        </div>
                                                        {order.deliveryDate && (
                                                            <div className="flex items-center gap-1">
                                                                <Truck size={12} className="text-slate-400" />
                                                                <span className="text-xs text-slate-400">
                                                                    {new Date(order.deliveryDate).toLocaleDateString('ar-SA')}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </Link>
                                            </td>

                                            {/* الإجراءات */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Link to={`/orders/${order.id}`}>
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
                                                    </_motion.button>

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
