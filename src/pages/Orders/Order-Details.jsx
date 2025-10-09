import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
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
import { useTheme } from "../../contexts/ThemeContext.jsx";
import { useOrder, useUpdateOrder } from "../../hooks/useOrdersQuery.js";

export default function OrderDetails() {
    const { id } = useParams();
    const navigate = useNavigate();


    const { isDark } = useTheme();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    // Fetch order data from API
    const { data: orderData, isLoading, error, refetch } = useOrder(id);
    const updateOrderMutation = useUpdateOrder();
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

    // ترتيب حالات الطلب للتراجع
    const statusOrder = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED'];

    // الحصول على الحالة السابقة
    const getPreviousStatus = (currentStatus) => {
        const currentIndex = statusOrder.indexOf(currentStatus);
        if (currentIndex > 0) {
            return statusOrder[currentIndex - 1];
        }
        return null;
    };


    // إرجاع خطوة
    const handleRevertStatus = async () => {
        const previousStatus = getPreviousStatus(order.status);
        if (!previousStatus) {
            toast.error('لا يمكن إرجاع هذه الحالة', {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        try {
            await updateOrderMutation.mutateAsync({
                id: order.id,
                data: { status: previousStatus }
            });

            toast.success(`تم إرجاع حالة الطلب إلى ${getStatusText(previousStatus)}`, {
                position: "top-right",
                autoClose: 3000,
            });

            refetch();
        } catch (error) {
            console.error('Error reverting order status:', error);
            toast.error('حدث خطأ في إرجاع حالة الطلب', {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    // تحديث الحالة
    const handleUpdateStatus = async (newStatus) => {
        try {
            await updateOrderMutation.mutateAsync({
                id: order.id,
                data: { status: newStatus }
            });

            toast.success(`تم تحديث حالة الطلب إلى ${getStatusText(newStatus)}`, {
                position: "top-right",
                autoClose: 3000,
            });

            refetch();
        } catch (error) {
            console.error('Error updating order status:', error);
            toast.error('حدث خطأ في تحديث حالة الطلب', {
                position: "top-right",
                autoClose: 3000,
            });
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
        // إنشاء بيانات الطلب للطباعة مع جميع البيانات
        const printData = {
            id: order.id,
            orderNumber: order.orderNumber,
            createdAt: order.createdAt,
            orderDate: order.orderDate,
            customerName: order.customerName,
            customerPhone: order.customerPhone,
            customerEmail: order.customerEmail,
            location: order.location,
            items: order.items || [],
            totalAmount: order.totalAmount || order.total || 0,
            subtotal: order.subtotal || order.totalAmount || 0,
            status: order.status,
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus,
            notes: order.notes,
            trackingNumber: order.trackingNumber
        };

        console.log('Print data:', printData); // للتأكد من البيانات

        // إنشاء نافذة جديدة للطباعة
        const printWindow = window.open('/print-invoice.html', '_blank', 'width=800,height=600');

        // انتظار تحميل الصفحة ثم تمرير البيانات
        printWindow.onload = () => {
            console.log('Window loaded, passing data...');
            if (printWindow.fillInvoiceData) {
                printWindow.fillInvoiceData(printData);
            } else {
                console.error('fillInvoiceData function not found');
            }
        };
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
        <div className="min-h-screen bg-[#0A0A0A] print-container" dir="rtl">
            {/* علامة مائية للطباعة */}
            <div className="print-watermark print-only">نصر للتجارة الحاسبات والالكترونيات</div>
            {/* Print Styles */}
            <style jsx>{`
                @media print {
                    @page {
                        size: A4;
                        margin: 15mm;
                    }
                    
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }
                    
                    body {
                        background: white !important;
                        color: black !important;
                        position: relative;
                    }
                    
                    /* علامة مائية */
                    body::before {
                        content: "نصر للتجارة الحاسبات والالكترونيات" !important;
                        position: fixed !important;
                        top: 50% !important;
                        left: 50% !important;
                        transform: translate(-50%, -50%) rotate(-45deg) !important;
                        font-size: 120px !important;
                        font-weight: bold !important;
                        color: rgba(44, 109, 144, 0.08) !important;
                        z-index: -1 !important;
                        white-space: nowrap !important;
                        pointer-events: none !important;
                        font-family: 'Cairo', sans-serif !important;
                    }
                    
                    .print-watermark {
                        position: fixed !important;
                        top: 50% !important;
                        left: 50% !important;
                        transform: translate(-50%, -50%) rotate(-45deg) !important;
                        font-size: 100px !important;
                        font-weight: bold !important;
                        color: rgba(44, 109, 144, 0.06) !important;
                        z-index: 0 !important;
                        white-space: nowrap !important;
                        pointer-events: none !important;
                        font-family: 'Cairo', sans-serif !important;
                    }
                    
                    .print-container {
                        position: relative !important;
                        z-index: 1 !important;
                    }
                    
                    .print-header {
                        background: linear-gradient(135deg, #2C6D90, #4A90E2) !important;
                        color: white !important;
                        padding: 25px !important;
                        margin-bottom: 25px !important;
                        border-radius: 15px !important;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
                    }
                    
                    .print-logo {
                        width: 80px !important;
                        height: 80px !important;
                        background: white !important;
                        border-radius: 15px !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
                    }
                    
                    .print-logo svg {
                        width: 50px !important;
                        height: 50px !important;
                        color: #2C6D90 !important;
                    }
                    
                    .print-table {
                        width: 100% !important;
                        border-collapse: collapse !important;
                        margin: 25px 0 !important;
                        background: white !important;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
                        border-radius: 10px !important;
                        overflow: hidden !important;
                    }
                    
                    .print-table th {
                        background: linear-gradient(135deg, #2C6D90, #4A90E2) !important;
                        color: white !important;
                        padding: 15px !important;
                        text-align: right !important;
                        font-weight: bold !important;
                        font-size: 14px !important;
                    }
                    
                    .print-table td {
                        border: 1px solid #e5e7eb !important;
                        padding: 12px 15px !important;
                        text-align: right !important;
                        color: #1f2937 !important;
                        background: white !important;
                    }
                    
                    .print-table tbody tr:nth-child(even) {
                        background: #f9fafb !important;
                    }
                    
                    .print-summary {
                        background: linear-gradient(135deg, #f0f9ff, #e0f2fe) !important;
                        padding: 25px !important;
                        border-radius: 15px !important;
                        margin: 25px 0 !important;
                        border: 2px solid #2C6D90 !important;
                        box-shadow: 0 2px 8px rgba(44, 109, 144, 0.15) !important;
                    }
                    
                    .print-summary-header {
                        background: linear-gradient(135deg, #2C6D90, #4A90E2) !important;
                        color: white !important;
                        padding: 15px !important;
                        border-radius: 10px !important;
                        margin-bottom: 20px !important;
                        text-align: center !important;
                        font-weight: bold !important;
                        font-size: 18px !important;
                    }
                    
                    .print-info-box {
                        background: white !important;
                        border: 2px solid #2C6D90 !important;
                        border-radius: 10px !important;
                        padding: 15px !important;
                        margin: 15px 0 !important;
                    }
                    
                    .print-footer {
                        margin-top: 40px !important;
                        padding: 25px !important;
                        background: linear-gradient(135deg, #2C6D90, #4A90E2) !important;
                        border-radius: 15px !important;
                        color: white !important;
                        text-align: center !important;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
                    }
                    
                    .print-footer-logo {
                        width: 50px !important;
                        height: 50px !important;
                        background: white !important;
                        border-radius: 10px !important;
                        display: inline-flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        margin-bottom: 10px !important;
                    }
                    
                    .no-print {
                        display: none !important;
                    }
                    
                    .print-only {
                        display: block !important;
                    }
                }
                
                .print-watermark,
                .print-only {
                    display: none;
                }
            `}</style>
            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="تأكيد الحذف"
                message="هل أنت متأكد من حذف هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء."
            />

            {/* Print Header - Hidden in normal view */}
            <div className="print-header print-only">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="print-logo">
                            <Package className="w-12 h-12 text-[#2C6D90]" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">فاتورة الطلب</h1>
                            <p className="text-lg text-white/90">رقم الطلب: #{order?.orderNumber || order?.id}</p>
                            <p className="text-sm text-white/80">نصر للتجارة الحاسبات والالكترونيات</p>
                        </div>
                    </div>
                    <div className="text-right text-white">
                        <div className="text-sm opacity-90">تاريخ الطباعة</div>
                        <div className="font-semibold">{new Date().toLocaleDateString('ar-SA')}</div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6 text-sm mb-6">
                    <div className="print-info-box">
                        <div className="text-gray-600 text-xs mb-1">تاريخ الطلب</div>
                        <div className="text-gray-800 font-semibold">{new Date(order.createdAt || order.orderDate).toLocaleDateString('ar-SA')}</div>
                    </div>
                    <div className="print-info-box">
                        <div className="text-gray-600 text-xs mb-1">حالة الطلب</div>
                        <div className="text-gray-800 font-semibold">{getStatusText(order.status)}</div>
                    </div>
                    <div className="print-info-box">
                        <div className="text-gray-600 text-xs mb-1">طريقة الدفع</div>
                        <div className="text-gray-800 font-semibold">{getPaymentMethodText(order.paymentMethod) || 'غير محدد'}</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6 text-sm">
                    <div className="print-info-box">
                        <div className="text-gray-600 text-xs mb-2">معلومات العميل</div>
                        <div className="text-gray-800 font-semibold text-lg">{order.customerName || 'غير محدد'}</div>
                        <div className="text-gray-600">{order.customerPhone || 'غير محدد'}</div>
                        <div className="text-gray-500 text-sm">{order.customerEmail || 'غير محدد'}</div>
                    </div>
                    <div className="print-info-box">
                        <div className="text-gray-600 text-xs mb-2">المبلغ الإجمالي</div>
                        <div className="text-[#2C6D90] font-bold text-2xl">د.ع {(order.totalAmount || order.total || 0).toLocaleString()}</div>
                        <div className="text-green-600 text-sm font-semibold">شامل التوصيل المجاني</div>
                    </div>
                </div>
            </div>

            {/* Header */}
            <div className="relative backdrop-blur-sm border-b bg-gradient-to-r from-[#1A1A2E] via-[#2C6D90]/20 to-[#1A1A2E] border-[#2C6D90]/30 no-print">
                <div className="absolute inset-0 bg-gradient-to-r from-[#2C6D90]/10 via-[#4A90E2]/5 to-[#2C6D90]/10"></div>
                <div className="relative px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <div className="p-4 sm:p-5 bg-gradient-to-br from-[#2C6D90] to-[#4A90E2] rounded-2xl sm:rounded-3xl shadow-xl">
                                    <Package className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                            </div>
                            <div>
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F9F3EF] mb-2">
                                    تفاصيل الطلب {order.id ? `#${order.id.slice(-6)}` : (order.orderNumber ? `#${order.orderNumber.slice(-6)}` : '—')}
                                </h1>
                                <p className="text-[#F9F3EF]/80 text-lg sm:text-xl">نصر للتجارة الحاسبات والالكترونيات</p>
                                <p className="text-[#F9F3EF]/60 mt-1 text-sm sm:text-base">عرض تفاصيل الطلب الكاملة</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 sm:gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => window.location.href = '/orders'}
                                className="group relative inline-flex items-center gap-2 sm:gap-3 overflow-hidden rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 bg-[#2C6D90] hover:bg-[#2C6D90]/90 text-[#F9F3EF] shadow-lg shadow-[#2C6D90]/25 transition-all duration-500 hover:shadow-xl hover:shadow-[#2C6D90]/40"
                            >
                                <ArrowLeft size={18} className="group-hover:translate-x-[-2px] transition-transform duration-300" />
                                <span className="font-semibold text-sm sm:text-base">العودة للطلبات</span>
                            </motion.button>

                            <div className="flex items-center gap-2 sm:gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handlePrint}
                                    className="p-3 rounded-xl transition-all duration-300 bg-[#F9F3EF]/10 border border-[#2C6D90]/30 text-[#F9F3EF] hover:bg-[#F9F3EF]/20 hover:border-[#2C6D90]/50"
                                    title="طباعة الفاتورة"
                                >
                                    <Printer size={20} />
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleShare}
                                    className="p-3 rounded-xl transition-all duration-300 bg-[#F9F3EF]/10 border border-[#2C6D90]/30 text-[#F9F3EF] hover:bg-[#F9F3EF]/20 hover:border-[#2C6D90]/50"
                                    title="مشاركة الطلب"
                                >
                                    <Share2 size={20} />
                                </motion.button>
                            </div>
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
                                تم إنشاء الطلب في {new Date(order.createdAt || order.orderDate).toLocaleDateString('en-US', {
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

                        {/* أزرار إدارة الحالة */}
                        <div className="flex flex-wrap gap-2 mt-4">
                            {/* زر إرجاع خطوة */}
                            {getPreviousStatus(order.status) && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleRevertStatus}
                                    className="px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 rounded-xl font-semibold hover:bg-yellow-500/30 transition-all duration-300 flex items-center gap-2"
                                >
                                    <ArrowLeft size={16} />
                                    <span>إرجاع خطوة</span>
                                </motion.button>
                            )}

                            {/* أزرار الحالات المتاحة */}
                            {statusOrder.map((status) => {
                                if (status !== order.status && statusOrder.indexOf(status) > statusOrder.indexOf(order.status)) {
                                    return (
                                        <motion.button
                                            key={status}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleUpdateStatus(status)}
                                            className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-xl font-semibold hover:bg-blue-500/30 transition-all duration-300 flex items-center gap-2"
                                        >
                                            <CheckCircle size={16} />
                                            <span>{getStatusText(status)}</span>
                                        </motion.button>
                                    );
                                }
                                return null;
                            })}
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
                                        <p className="text-nsr-primary">{order.location || 'غير محدد'}</p>
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

                            {/* Print Table */}
                            <div className="print-only">
                                {order.items && order.items.length > 0 && (
                                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                                        <div className="print-summary-header">
                                            تفاصيل المنتجات
                                        </div>
                                        <table className="print-table">
                                            <thead>
                                                <tr>
                                                    <th>المنتج</th>
                                                    <th>الكمية</th>
                                                    <th>السعر</th>
                                                    <th>المجموع</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {order.items.map((item, index) => (
                                                    <tr key={index}>
                                                        <td className="py-4">
                                                            <div>
                                                                <div className="font-bold text-gray-800 text-lg">
                                                                    {item.product?.name || `منتج #${item.productId?.slice(-6) || 'غير محدد'}`}
                                                                </div>
                                                                <div className="text-sm text-gray-600 mt-1">
                                                                    {item.product?.brand?.name || 'غير محدد'} • {item.product?.category?.name || 'غير محدد'}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="text-center font-semibold text-lg">{item.quantity}</td>
                                                        <td className="text-left font-semibold text-lg">د.ع {(item.price || 0).toLocaleString()}</td>
                                                        <td className="text-left font-bold text-lg text-[#2C6D90]">د.ع {((item.price || 0) * item.quantity).toLocaleString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* Normal View */}
                            <div className="space-y-4 print:hidden">
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
                                                            {(item.price || 0).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex justify-between items-center">
                                                    <div className="text-sm text-nsr-neutral">
                                                        الكمية: <span className="font-semibold text-nsr-primary">{item.quantity}</span>
                                                    </div>
                                                    <div className="text-sm text-nsr-neutral">
                                                        المجموع: <span className="font-bold text-nsr-accent">
                                                            {((item.price || 0) * item.quantity).toLocaleString()}
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
                                                            {new Date(step.date).toLocaleDateString('en-US', {
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

                            {/* Print Summary */}
                            <div className="print-summary print-only">
                                <div className="print-summary-header">
                                    ملخص الفاتورة
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                        <span className="font-semibold text-gray-700">المجموع الفرعي:</span>
                                        <span className="font-bold text-lg">د.ع {(order.subtotal || order.totalAmount || 0).toLocaleString()}</span>
                                    </div>

                                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                        <span className="font-semibold text-gray-700">الشحن:</span>
                                        <span className="font-bold text-green-600 text-lg">مجاني دائماً</span>
                                    </div>

                                    {order.discount && order.discount > 0 && (
                                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                            <span className="font-semibold text-gray-700">الخصم:</span>
                                            <span className="font-bold text-red-600 text-lg">-د.ع {order.discount.toLocaleString()}</span>
                                        </div>
                                    )}

                                    {order.tax && order.tax > 0 && (
                                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                            <span className="font-semibold text-gray-700">الضريبة:</span>
                                            <span className="font-bold text-lg">د.ع {order.tax.toLocaleString()}</span>
                                        </div>
                                    )}

                                    <div className="mt-4 pt-4 border-t-2 border-[#2C6D90]">
                                        <div className="flex justify-between items-center">
                                            <span className="text-2xl font-bold text-[#2C6D90]">المجموع الكلي:</span>
                                            <span className="text-3xl font-bold text-[#2C6D90]">د.ع {(order.totalAmount || order.total || 0).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Normal View */}
                            <div className="space-y-3 print:hidden">
                                <div className="flex justify-between">
                                    <span className="text-nsr-neutral">المجموع الفرعي</span>
                                    <span className="text-nsr-primary">
                                        د.ع {(order.subtotal || order.totalAmount || 0).toLocaleString()}
                                    </span>
                                </div>

                                {order.discount && order.discount > 0 && (
                                    <div className="flex justify-between text-green-400">
                                        <span>الخصم</span>
                                        <span>-د.ع {order.discount.toLocaleString()}</span>
                                    </div>
                                )}

                                <div className="flex justify-between">
                                    <span className="text-nsr-neutral">الشحن</span>
                                    <span className="text-green-400 font-semibold">
                                        مجاني دائماً
                                    </span>
                                </div>

                                {order.tax && order.tax > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-nsr-neutral">الضريبة</span>
                                        <span className="text-nsr-primary">
                                            د.ع {order.tax.toLocaleString()}
                                        </span>
                                    </div>
                                )}

                                <div className="border-t border-nsr-primary/20 pt-3">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span className="text-nsr-primary">المجموع الكلي</span>
                                        <span className="text-nsr-accent">
                                            د.ع {(order.totalAmount || order.total || 0).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tracking Information */}
                        {order.trackingNumber && (
                            <div className="bg-nsr-secondary/30 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <Truck size={20} className="text-nsr-accent" />
                                    <h3 className="text-lg font-bold text-nsr-primary">معلومات التتبع</h3>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Truck size={16} className="text-nsr-accent" />
                                        <span className="text-sm font-semibold text-nsr-primary">رقم التتبع</span>
                                    </div>
                                    <p className="text-sm text-nsr-neutral font-mono bg-nsr-primary/5 p-2 rounded-lg">{order.trackingNumber}</p>
                                </div>
                            </div>
                        )}

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

                        {/* إدارة حالة الطلب */}
                        <div className="bg-nsr-secondary/30 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-nsr-primary mb-4">إدارة الحالة</h3>

                            <div className="space-y-3">
                                {/* الحالة الحالية */}
                                <div className="p-3 bg-nsr-primary/5 rounded-xl border border-nsr-primary/20">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className={`w-3 h-3 rounded-full ${getStatusColor(order.status).split(' ')[0]}`}></div>
                                        <span className="text-sm font-semibold text-nsr-primary">الحالة الحالية</span>
                                    </div>
                                    <p className="text-nsr-primary font-bold">{getStatusText(order.status)}</p>
                                </div>

                                {/* إرجاع خطوة */}
                                {getPreviousStatus(order.status) && (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleRevertStatus}
                                        className="w-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 py-3 px-4 rounded-xl font-semibold hover:bg-yellow-500/30 transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <ArrowLeft size={20} />
                                        <span>إرجاع إلى {getStatusText(getPreviousStatus(order.status))}</span>
                                    </motion.button>
                                )}

                                {/* الحالات المتاحة */}
                                {statusOrder.map((status) => {
                                    if (status !== order.status && statusOrder.indexOf(status) > statusOrder.indexOf(order.status)) {
                                        return (
                                            <motion.button
                                                key={status}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleUpdateStatus(status)}
                                                className="w-full bg-blue-500/20 border border-blue-500/30 text-blue-300 py-3 px-4 rounded-xl font-semibold hover:bg-blue-500/30 transition-all duration-300 flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle size={20} />
                                                <span>تحديث إلى {getStatusText(status)}</span>
                                            </motion.button>
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                        </div>

                        {/* Admin Actions */}
                        <div className="bg-nsr-secondary/30 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-nsr-primary mb-4">إجراءات الإدارة</h3>

                            <div className="space-y-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-nsr-accent text-white py-3 px-4 rounded-xl font-semibold hover:bg-nsr-accent/90 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <Edit size={20} />
                                    <span>تعديل الطلب</span>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleDelete}
                                    className="w-full bg-red-50 border border-red-500 text-red-600 py-3 px-4 rounded-xl font-semibold hover:bg-red-100 transition-colors duration-300 flex items-center justify-center gap-2"
                                >
                                    <Trash size={20} />
                                    <span>حذف الطلب</span>
                                </motion.button>
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

            {/* Print Footer */}
            <div className="print-footer print-only">
                <div className="text-center mb-4">
                    <div className="flex items-center justify-center gap-3 mb-3">
                        <div className="print-footer-logo">
                            <Package className="w-6 h-6 text-[#2C6D90]" />
                        </div>
                        <h3 className="text-xl font-bold">ناصر للتجارة والتوزيع</h3>
                    </div>
                    <p className="text-lg font-semibold">شكراً لاختياركم خدماتنا</p>
                    <p className="text-sm opacity-90 mt-2">نلتزم بتقديم أفضل المنتجات والخدمات</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                        <div className="font-semibold mb-1">هذه فاتورة إلكترونية</div>
                        <div className="opacity-80">لا تحتاج إلى توقيع</div>
                    </div>
                    <div className="text-center">
                        <div className="font-semibold mb-1">تاريخ الطباعة</div>
                        <div className="opacity-80">{new Date().toLocaleDateString('ar-SA')}</div>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/20 text-center">
                    <p className="text-xs opacity-80">
                        للاستفسارات: info@nasr-trading.com | هاتف: +964-XXX-XXX-XXXX
                    </p>
                </div>
            </div>
        </div>
    );
}