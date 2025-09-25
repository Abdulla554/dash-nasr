import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion as _motion } from "framer-motion";
import {
    ArrowLeft,
    User,
    MapPin,
    CreditCard,
    Truck,
    Calendar,
    Package,
    Phone,
    Mail,
    Edit,
    Trash,
    DollarSign,
    CheckCircle,
    Clock,
    XCircle,
    Printer,
    Share2,
    Star,
    Tag
} from "lucide-react";
import { toast } from "react-toastify";
import ConfirmationModal from "../../components/ConfirmationModal";
import ExchangeRateModal from "../../components/ExchangeRateModal";
import { useCurrency } from "../../contexts/CurrencyContext.jsx";
import { useTheme } from "../../contexts/ThemeContext.jsx";
import { useOrder } from "../../hooks/useOrdersQuery.js";

export default function OrderDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { convertCurrency, getCurrencySymbol, getCurrencyCode, toggleCurrency, showExchangeModal, setShowExchangeModal, exchangeRate, updateExchangeRate } = useCurrency();
    const { isDark } = useTheme();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    // Fetch order data from API
    const { data: orderData, isLoading, error } = useOrder(id);
    const order = orderData?.data || orderData;

    console.log("Order data:", orderData);
    console.log("Order:", order);
    console.log("Loading:", isLoading);
    console.log("Error:", error);

    useEffect(() => {
        if (error) {
            navigate('/orders');
        }
        window.scrollTo(0, 0);
    }, [error, navigate]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-nsr-dark flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nsr-accent mx-auto mb-4"></div>
                    <h2 className="text-2xl font-bold text-nsr-primary mb-4">جاري تحميل تفاصيل الطلب...</h2>
                    <p className="text-nsr-neutral">يرجى الانتظار</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-nsr-dark flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-nsr-primary mb-4">الطلب غير موجود</h2>
                    <p className="text-nsr-neutral mb-4">{error?.message || 'حدث خطأ في تحميل الطلب'}</p>
                    <Link to="/orders" className="text-nsr-accent hover:underline">
                        العودة للطلبات
                    </Link>
                </div>
            </div>
        );
    }

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
                return <CheckCircle size={20} />;
            case 'processing':
                return <Clock size={20} />;
            case 'shipped':
                return <Truck size={20} />;
            case 'pending':
                return <Clock size={20} />;
            case 'cancelled':
                return <XCircle size={20} />;
            default:
                return <Clock size={20} />;
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

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case 'paid':
                return 'bg-green-500/20 text-green-300 border-green-500/30';
            case 'pending':
                return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
            case 'failed':
                return 'bg-red-500/20 text-red-300 border-red-500/30';
            default:
                return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
        }
    };

    const getPaymentStatusText = (status) => {
        switch (status) {
            case 'paid':
                return 'مدفوع';
            case 'pending':
                return 'في الانتظار';
            case 'failed':
                return 'فشل';
            default:
                return 'غير محدد';
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `طلب ${order.orderNumber}`,
                text: `تفاصيل الطلب ${order.orderNumber}`,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success("تم نسخ رابط الطلب", {
                position: "top-right",
                autoClose: 2000,
            });
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDelete = () => {
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        toast.success("تم حذف الطلب بنجاح", {
            position: "top-right",
            autoClose: 3000,
        });
        navigate('/orders');
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gradient-nsr-dark' : 'bg-gradient-nsr-light'}`}>
            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="تأكيد الحذف"
                message="هل أنت متأكد من حذف هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء."
            />

            <ExchangeRateModal
                isOpen={showExchangeModal}
                onClose={() => setShowExchangeModal(false)}
                onUpdateRate={updateExchangeRate}
                currentRate={exchangeRate}
            />

            {/* Header */}
            <div className="bg-nsr-secondary/50 backdrop-blur-lg border-b border-nsr-primary/20">
                <div className="mx-auto max-w-7xl px-6 py-4">
                    <div className="flex items-center justify-between">
                        <_motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/orders')}
                            className={`flex items-center gap-2 transition-colors duration-300 ${isDark ? 'text-nsr-light hover:text-nsr-accent' : 'text-nsr-dark hover:text-nsr-accent'}`}
                        >
                            <ArrowLeft size={20} />
                            <span>العودة للطلبات</span>
                        </_motion.button>

                        <div className="flex items-center gap-4">
                            <_motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={toggleCurrency}
                                className={`p-2 bg-nsr-primary/10 rounded-xl hover:bg-nsr-accent/10 transition-all duration-300 flex items-center gap-2 ${isDark ? 'text-nsr-light hover:text-nsr-accent' : 'text-nsr-dark hover:text-nsr-accent'}`}
                            >
                                <DollarSign size={20} />
                                <span className="text-sm font-semibold">{getCurrencyCode()}</span>
                            </_motion.button>

                            <_motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handlePrint}
                                className={`p-2 bg-nsr-primary/10 rounded-xl hover:bg-nsr-accent/10 transition-all duration-300 ${isDark ? 'text-nsr-light hover:text-nsr-accent' : 'text-nsr-dark hover:text-nsr-accent'}`}
                            >
                                <Printer size={20} />
                            </_motion.button>

                            <_motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleShare}
                                className={`p-2 bg-nsr-primary/10 rounded-xl hover:bg-nsr-accent/10 transition-all duration-300 ${isDark ? 'text-nsr-light hover:text-nsr-accent' : 'text-nsr-dark hover:text-nsr-accent'}`}
                            >
                                <Share2 size={20} />
                            </_motion.button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Details */}
            <div className="mx-auto max-w-7xl px-6 py-8">
                {/* Order Header */}
                <div className="bg-nsr-secondary/30 rounded-3xl p-8 mb-8">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        <div>
                            <h1 className={`text-3xl font-bold mb-2 transition-colors duration-300 ${isDark ? 'text-nsr-light' : 'text-nsr-dark'}`}>
                                {order.orderNumber}
                            </h1>
                            <p className={`transition-colors duration-300 ${isDark ? 'text-nsr-light-200' : 'text-nsr-dark-600'}`}>
                                تم إنشاء الطلب في {new Date(order.createdAt || order.orderDate).toLocaleDateString('ar-SA', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className={`px-4 py-2 rounded-xl border ${getStatusColor(order.status)}`}>
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(order.status)}
                                    <span className="font-semibold">{getStatusText(order.status)}</span>
                                </div>
                            </div>

                            <div className={`px-4 py-2 rounded-xl border ${getPaymentStatusColor(order.paymentStatus)}`}>
                                <div className="flex items-center gap-2">
                                    <CreditCard size={16} />
                                    <span className="font-semibold">{getPaymentStatusText(order.paymentStatus)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Customer Information */}
                        <div className="bg-nsr-secondary/30 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <User size={24} className="text-nsr-accent" />
                                <h2 className="text-2xl font-bold text-nsr-primary">معلومات العميل</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-nsr-neutral">الاسم</label>
                                        <p className="text-nsr-primary font-semibold">{order.customerName}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-nsr-neutral">البريد الإلكتروني</label>
                                        <div className="flex items-center gap-2">
                                            <Mail size={16} className="text-nsr-accent" />
                                            <p className="text-nsr-primary">{order.customerEmail}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-nsr-neutral">رقم الهاتف</label>
                                        <div className="flex items-center gap-2">
                                            <Phone size={16} className="text-nsr-accent" />
                                            <p className="text-nsr-primary">{order.customerPhone}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm text-nsr-neutral">العنوان</label>
                                        <p className="text-nsr-primary">{order.customerAddress || 'غير محدد'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-nsr-secondary/30 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <Package size={24} className="text-nsr-accent" />
                                <h2 className="text-2xl font-bold text-nsr-primary">منتجات الطلب</h2>
                            </div>

                            <div className="space-y-4">
                                {order.items && order.items.length > 0 ? (
                                    order.items.map((item, index) => (
                                        <div key={index} className="flex gap-4 p-4 bg-nsr-primary/5 rounded-xl">
                                            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                                                <Package size={24} className="text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-nsr-primary">
                                                            {item.product?.name || `منتج #${item.productId?.slice(-6) || 'غير محدد'}`}
                                                        </h3>
                                                        <p className="text-sm text-nsr-neutral">
                                                            {item.product?.brand?.name || 'غير محدد'} • {item.product?.category?.name || 'غير محدد'}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-bold text-nsr-accent">
                                                            {getCurrencySymbol()}{convertCurrency(item.price || 0).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex justify-between items-center">
                                                    <div className="text-sm text-nsr-neutral">
                                                        الكمية: <span className="font-semibold text-nsr-primary">{item.quantity}</span>
                                                    </div>
                                                    <div className="text-sm text-nsr-neutral">
                                                        المجموع: <span className="font-bold text-nsr-accent">
                                                            {getCurrencySymbol()}{convertCurrency((item.price || 0) * item.quantity).toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>

                                                {item.product?.specifications && (
                                                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                                                        {Object.entries(item.product.specifications).slice(0, 4).map(([key, value]) => (
                                                            <div key={key} className="flex justify-between">
                                                                <span className="text-nsr-neutral">{key}:</span>
                                                                <span className="text-nsr-primary font-medium">{value}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <Package size={48} className="text-nsr-neutral mx-auto mb-4" />
                                        <p className="text-nsr-neutral">لا توجد منتجات في هذا الطلب</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Order Timeline */}
                        <div className="bg-nsr-secondary/30 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <Calendar size={24} className="text-nsr-accent" />
                                <h2 className="text-2xl font-bold text-nsr-primary">مسار الطلب</h2>
                            </div>

                            <div className="space-y-4">
                                {order.timeline && order.timeline.length > 0 ? (
                                    order.timeline.map((step, index) => (
                                        <div key={index} className="flex gap-4">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.completed ? 'bg-green-500' : 'bg-gray-500'
                                                }`}>
                                                {step.completed ? (
                                                    <CheckCircle size={16} className="text-white" />
                                                ) : (
                                                    <Clock size={16} className="text-white" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className={`font-semibold ${step.completed ? 'text-nsr-primary' : 'text-nsr-neutral'}`}>
                                                            {step.title}
                                                        </h3>
                                                        <p className="text-sm text-nsr-neutral">{step.description}</p>
                                                    </div>
                                                    {step.date && (
                                                        <span className="text-xs text-nsr-neutral">
                                                            {new Date(step.date).toLocaleDateString('ar-SA', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <Calendar size={48} className="text-nsr-neutral mx-auto mb-4" />
                                        <p className="text-nsr-neutral">مسار الطلب غير متوفر</p>
                                        <p className="text-sm text-nsr-neutral mt-2">حالة الطلب: {getStatusText(order.status)}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Order Summary */}
                        <div className="bg-nsr-secondary/30 rounded-2xl p-6">
                            <h3 className="text-xl font-bold text-nsr-primary mb-4">ملخص الطلب</h3>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-nsr-neutral">المجموع الفرعي</span>
                                    <span className="text-nsr-primary">
                                        {getCurrencySymbol()}{convertCurrency(order.subtotal || order.totalAmount || 0).toLocaleString()}
                                    </span>
                                </div>

                                {order.discount && order.discount > 0 && (
                                    <div className="flex justify-between text-green-400">
                                        <span>الخصم</span>
                                        <span>-{getCurrencySymbol()}{convertCurrency(order.discount).toLocaleString()}</span>
                                    </div>
                                )}

                                <div className="flex justify-between">
                                    <span className="text-nsr-neutral">الشحن</span>
                                    <span className="text-nsr-primary">
                                        {order.shipping === 0 ? 'مجاني' : `${getCurrencySymbol()}${convertCurrency(order.shipping || 0).toLocaleString()}`}
                                    </span>
                                </div>

                                {order.tax && order.tax > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-nsr-neutral">الضريبة</span>
                                        <span className="text-nsr-primary">
                                            {getCurrencySymbol()}{convertCurrency(order.tax).toLocaleString()}
                                        </span>
                                    </div>
                                )}

                                <div className="border-t border-nsr-primary/20 pt-3">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span className="text-nsr-primary">المجموع الكلي</span>
                                        <span className="text-nsr-accent">
                                            {getCurrencySymbol()}{convertCurrency(order.totalAmount || order.total || 0).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Information */}
                        <div className="bg-nsr-secondary/30 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <MapPin size={20} className="text-nsr-accent" />
                                <h3 className="text-lg font-bold text-nsr-primary">عنوان الشحن</h3>
                            </div>

                            <div className="space-y-2 text-sm">
                                <p className="text-nsr-primary">{order.shippingAddress?.street || 'غير محدد'}</p>
                                <p className="text-nsr-primary">{order.shippingAddress?.city || 'غير محدد'}, {order.shippingAddress?.region || 'غير محدد'}</p>
                                <p className="text-nsr-primary">{order.shippingAddress?.postalCode || 'غير محدد'}</p>
                                <p className="text-nsr-primary">{order.shippingAddress?.country || 'غير محدد'}</p>
                            </div>

                            {order.trackingNumber && (
                                <div className="mt-4 pt-4 border-t border-nsr-primary/20">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Truck size={16} className="text-nsr-accent" />
                                        <span className="text-sm font-semibold text-nsr-primary">رقم التتبع</span>
                                    </div>
                                    <p className="text-sm text-nsr-neutral font-mono">{order.trackingNumber}</p>
                                </div>
                            )}
                        </div>

                        {/* Payment Information */}
                        <div className="bg-nsr-secondary/30 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <CreditCard size={20} className="text-nsr-accent" />
                                <h3 className="text-lg font-bold text-nsr-primary">معلومات الدفع</h3>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-nsr-neutral">طريقة الدفع</span>
                                    <span className="text-nsr-primary">{getPaymentMethodText(order.paymentMethod) || 'غير محدد'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-nsr-neutral">حالة الدفع</span>
                                    <span className={`px-2 py-1 rounded-lg text-xs border ${getPaymentStatusColor(order.paymentStatus)}`}>
                                        {getPaymentStatusText(order.paymentStatus) || 'غير محدد'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Admin Actions */}
                        <div className="bg-nsr-secondary/30 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-nsr-primary mb-4">إجراءات الإدارة</h3>

                            <div className="space-y-3">
                                <_motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-nsr-accent text-white py-3 px-4 rounded-xl font-semibold hover:bg-nsr-accent/90 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <Edit size={20} />
                                    <span>تعديل الطلب</span>
                                </_motion.button>

                                <_motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleDelete}
                                    className="w-full bg-red-50 border border-red-500 text-red-600 py-3 px-4 rounded-xl font-semibold hover:bg-red-100 transition-colors duration-300 flex items-center justify-center gap-2"
                                >
                                    <Trash size={20} />
                                    <span>حذف الطلب</span>
                                </_motion.button>
                            </div>
                        </div>

                        {/* Notes */}
                        {(order.notes || order.notes) && (
                            <div className="bg-nsr-secondary/30 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <Tag size={20} className="text-nsr-accent" />
                                    <h3 className="text-lg font-bold text-nsr-primary">ملاحظات</h3>
                                </div>
                                <p className="text-sm text-nsr-neutral">{order.notes || 'لا توجد ملاحظات'}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
