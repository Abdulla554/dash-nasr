/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    DndContext,
    DragOverlay,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
//ens
import { motion, AnimatePresence } from "framer-motion";
import {
    ShoppingCart,
    CheckCircle,
    Truck,
    Package,
    XCircle,
    Clock,
    User,
    Calendar,
    DollarSign,
    Phone,
    Mail,
    Star,
    Plus,
    TrendingUp,
    ArrowRight,
    ArrowLeft,
    RefreshCw,
    AlertCircle,
    Sparkles,
    GripVertical,
    Eye,
    ExternalLink
} from "lucide-react";
import { useOrders, useUpdateOrder } from "../hooks/useOrdersQuery";
import { useCurrency } from "../contexts/CurrencyContext.jsx";
import { toast } from "react-toastify";

// تعريف حالات الطلب مع تحسينات بصرية
const ORDER_STATUSES = {
    PENDING: {
        label: "في الانتظار",
        color: "yellow",
        icon: Clock,
        bgColor: "bg-gradient-to-br from-yellow-500/20 to-orange-500/20",
        borderColor: "border-yellow-500/40",
        textColor: "text-yellow-300",
        gradient: "from-yellow-400 to-orange-500",
        shadowColor: "shadow-yellow-500/20"
    },
    CONFIRMED: {
        label: "مؤكد",
        color: "blue",
        icon: CheckCircle,
        bgColor: "bg-gradient-to-br from-blue-500/20 to-cyan-500/20",
        borderColor: "border-blue-500/40",
        textColor: "text-blue-300",
        gradient: "from-blue-400 to-cyan-500",
        shadowColor: "shadow-blue-500/20"
    },
    SHIPPED: {
        label: "تم الشحن",
        color: "purple",
        icon: Truck,
        bgColor: "bg-gradient-to-br from-purple-500/20 to-pink-500/20",
        borderColor: "border-purple-500/40",
        textColor: "text-purple-300",
        gradient: "from-purple-400 to-pink-500",
        shadowColor: "shadow-purple-500/20"
    },
    DELIVERED: {
        label: "تم التسليم",
        color: "green",
        icon: Package,
        bgColor: "bg-gradient-to-br from-green-500/20 to-emerald-500/20",
        borderColor: "border-green-500/40",
        textColor: "text-green-300",
        gradient: "from-green-400 to-emerald-500",
        shadowColor: "shadow-green-500/20"
    },
    CANCELLED: {
        label: "ملغي",
        color: "red",
        icon: XCircle,
        bgColor: "bg-gradient-to-br from-red-500/20 to-rose-500/20",
        borderColor: "border-red-500/40",
        textColor: "text-red-300",
        gradient: "from-red-400 to-rose-500",
        shadowColor: "shadow-red-500/20"
    }
};

const ORDER_COLUMNS = [
    { key: 'PENDING', title: 'في الانتظار' },
    { key: 'CONFIRMED', title: 'مؤكد' },
    { key: 'SHIPPED', title: 'تم الشحن' },
    { key: 'DELIVERED', title: 'تم التسليم' },
    { key: 'CANCELLED', title: 'ملغي' }
];

// مكون البطاقة القابلة للسحب
function SortableOrderCard({ order, convertCurrency, getCurrencySymbol, getTagColor, getStarRating }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: order.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{
                opacity: isDragging ? 0.8 : 1,
                y: 0,
                scale: isDragging ? 1.05 : 1,
                rotate: isDragging ? 2 : 0
            }}
            exit={{ opacity: 0, y: -20 }}
            whileHover={{
                scale: isDragging ? 1.05 : 1.02,
                y: isDragging ? 0 : -2
            }}
            whileTap={{ scale: 0.98 }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 30
            }}
            className={`relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 cursor-move hover:border-white/20 transition-all duration-300 ${isDragging
                ? 'opacity-80 shadow-2xl border-blue-400/50 bg-blue-500/10'
                : 'hover:shadow-lg'
                }`}
        >
            {/* زر السحب */}
            <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical size={16} className="text-white/50" />
            </div>

            {/* عنوان الطلب مع رابط للتفاصيل */}
            <div className="mb-3 pr-6">
                <Link
                    to={`/orders/${order.id}`}
                    className="block hover:bg-white/5 rounded-lg p-2 -m-2 transition-colors duration-300"
                    onClick={(e) => e.stopPropagation()}
                >
                    <h4 className="text-white font-semibold text-sm mb-1 line-clamp-2 hover:text-blue-300 transition-colors duration-300">
                        {order.customerName ? `طلب من ${order.customerName}` : `طلب #${order.id.slice(-6)}`}
                    </h4>
                    <p className="text-white/70 text-xs">
                        {order.orderNumber || `#${order.id.slice(-6)}`}
                    </p>
                </Link>
            </div>

            {/* المبلغ مع رابط للتفاصيل */}
            <div className="mb-3">
                <Link
                    to={`/orders/${order.id}`}
                    className="block hover:bg-white/5 rounded-lg p-2 -m-2 transition-colors duration-300"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="text-lg font-bold text-blue-400 hover:text-blue-300 transition-colors duration-300">
                        {getCurrencySymbol()}{convertCurrency(order.totalAmount || order.total || 0).toLocaleString()}
                    </div>
                </Link>
            </div>

            {/* تفاصيل العميل مع رابط للتفاصيل */}
            <div className="mb-3 space-y-1">
                <Link
                    to={`/orders/${order.id}`}
                    className="block hover:bg-white/5 rounded-lg p-2 -m-2 transition-colors duration-300"
                    onClick={(e) => e.stopPropagation()}
                >
                    {order.customerName && (
                        <div className="flex items-center gap-2">
                            <User size={12} className="text-blue-400" />
                            <span className="text-xs text-white/70 hover:text-blue-300 transition-colors duration-300">{order.customerName}</span>
                        </div>
                    )}
                    {order.customerEmail && (
                        <div className="flex items-center gap-2">
                            <Mail size={12} className="text-blue-400" />
                            <span className="text-xs text-white/70 hover:text-blue-300 transition-colors duration-300">{order.customerEmail}</span>
                        </div>
                    )}
                    {order.customerPhone && (
                        <div className="flex items-center gap-2">
                            <Phone size={12} className="text-blue-400" />
                            <span className="text-xs text-white/70 hover:text-blue-300 transition-colors duration-300">{order.customerPhone}</span>
                        </div>
                    )}
                </Link>
            </div>

            {/* الوسوم */}
            <div className="mb-3">
                <div className="flex flex-wrap gap-1">
                    {order.items && order.items.length > 0 && (
                        <span className={`px-2 py-1 rounded text-xs border ${getTagColor('Product')}`}>
                            Product
                        </span>
                    )}
                    <span className={`px-2 py-1 rounded text-xs border ${getTagColor('Information')}`}>
                        Information
                    </span>
                </div>
            </div>



            {/* تاريخ الطلب مع رابط للتفاصيل */}
            <div className="flex items-center gap-2">
                <Link
                    to={`/orders/${order.id}`}
                    className="flex items-center gap-2 hover:bg-white/5 rounded-lg p-2 -m-2 transition-colors duration-300"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Calendar size={12} className="text-slate-400" />
                    <span className="text-xs text-slate-400 hover:text-blue-300 transition-colors duration-300">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-us') : 'غير محدد'}
                    </span>
                </Link>
            </div>

            {/* أيقونات الإجراءات */}
            <div className="absolute top-3 right-3 flex items-center gap-2">
                <Link
                    to={`/orders/${order.id}`}
                    className="p-1 hover:bg-white/10 rounded-lg transition-colors duration-300"
                    onClick={(e) => e.stopPropagation()}
                    title="عرض التفاصيل"
                >
                    <Eye size={14} className="text-white/50 hover:text-blue-400 transition-colors duration-300" />
                </Link>
                <Phone size={14} className="text-white/50" />
            </div>
        </motion.div>
    );
}

// مكون العمود
function OrderColumn({ column, orders, statusConfig, convertCurrency, getCurrencySymbol, getTagColor, getStarRating, isDragOver }) {
    const StatusIcon = statusConfig.icon;
    const stats = {
        count: orders.length,
        totalAmount: orders.reduce((sum, order) => sum + (order.totalAmount || order.total || 0), 0)
    };
    const percentage = orders.length > 0 ? Math.round((stats.count / Math.max(orders.length, 1)) * 100) : 0;

    return (
        <motion.div
            className={`flex-shrink-0 w-80 ${isDragOver
                ? 'bg-blue-500/10 border-2 border-dashed border-blue-400 rounded-2xl p-2'
                : ''
                }`}
            animate={{
                scale: isDragOver ? 1.02 : 1
            }}
            transition={{ duration: 0.2 }}
        >
            {/* رأس العمود */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${statusConfig.bgColor} ${statusConfig.borderColor} border rounded-2xl p-6 mb-6 ${statusConfig.shadowColor} shadow-lg`}
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${statusConfig.gradient}`}>
                            <StatusIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className={`text-lg font-bold ${statusConfig.textColor}`}>
                                {column.title}
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className={`text-2xl font-bold ${statusConfig.textColor}`}>
                                    {stats.count}
                                </span>
                                <span className="text-sm text-white/60">طلبات</span>
                            </div>
                        </div>
                    </div>
                    <button className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                        <Plus size={20} className="text-white/70" />
                    </button>
                </div>

                {/* المبلغ الإجمالي */}
                <div className="mb-4">
                    <div className="text-xl font-bold text-white mb-1">
                        {getCurrencySymbol()}{convertCurrency(stats.totalAmount).toLocaleString()}
                    </div>
                </div>

                {/* شريط التقدم */}
                <div className="mb-2">
                    <div className="flex justify-between text-xs text-white/70 mb-1">
                        <span>التقدم</span>
                        <span>{percentage}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                        <motion.div
                            className={`h-2 rounded-full bg-gradient-to-r ${statusConfig.gradient}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                        />
                    </div>
                </div>
            </motion.div>

            {/* بطاقات الطلبات */}
            <div className="space-y-3 min-h-[400px]">
                <SortableContext items={orders.map(order => order.id)} strategy={verticalListSortingStrategy}>
                    <AnimatePresence mode="popLayout">
                        {orders.map((order, index) => (
                            <motion.div
                                key={order.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    transition: { delay: index * 0.1 }
                                }}
                                exit={{
                                    opacity: 0,
                                    y: -20,
                                    scale: 0.8,
                                    transition: { duration: 0.2 }
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 30
                                }}
                            >
                                <SortableOrderCard
                                    order={order}
                                    convertCurrency={convertCurrency}
                                    getCurrencySymbol={getCurrencySymbol}
                                    getTagColor={getTagColor}
                                    getStarRating={getStarRating}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </SortableContext>

                {/* رسالة فارغة إذا لم توجد طلبات */}
                {orders.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12 text-white/50"
                    >
                        <StatusIcon size={48} className="mx-auto mb-4 opacity-50" />
                        <p className="text-sm">لا توجد طلبات</p>
                        <p className="text-xs text-white/30 mt-1">اسحب طلباً هنا لتغيير حالته</p>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}

export default function OrdersKanbanDnd() {
    const { convertCurrency, getCurrencySymbol } = useCurrency();
    const { data: ordersData, isLoading, error, refetch } = useOrders();
    const updateOrderMutation = useUpdateOrder();
    console.log('🔧 updateOrderMutation:', updateOrderMutation);
    const [activeId, setActiveId] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [localOrders, setLocalOrders] = useState([]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // const orders = ordersData?.data || [];

    // تحديث الطلبات المحلية عند تغيير البيانات
    React.useEffect(() => {
        if (ordersData?.data) {
            setLocalOrders(ordersData.data);
        }
    }, [ordersData]);

    // تجميع الطلبات حسب الحالة
    const ordersByStatus = ORDER_COLUMNS.reduce((acc, column) => {
        acc[column.key] = localOrders.filter(order => order.status === column.key);
        return acc;
    }, {});

    console.log('📊 ordersByStatus:', ordersByStatus);
    console.log('📋 localOrders:', localOrders);

    // الحصول على لون الوسم
    const getTagColor = (tag) => {
        const colors = {
            'Product': 'bg-red-500/20 text-red-300 border-red-500/30',
            'Design': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
            'Consulting': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
            'Services': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
            'Information': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
            'Other': 'bg-purple-500/20 text-purple-300 border-purple-500/30'
        };
        return colors[tag] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    };

    // الحصول على تقييم النجوم
    const getStarRating = (rating = 1) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                size={12}
                className={i < rating ? "text-yellow-400 fill-current" : "text-gray-400"}
            />
        ));
    };

    // معالجة بداية السحب
    const handleDragStart = (event) => {
        console.log('🎬 بداية السحب:', event.active.id);
        setActiveId(event.active.id);
    };

    // معالجة السحب
    const handleDragOver = (event) => {
        const { active, over } = event;

        if (!over) return;

        const activeId = active.id;
        const overId = over.id;
        console.log('🔄 السحب فوق:', { activeId, overId });

        // البحث عن العمود الذي يحتوي على الطلب
        let activeColumn = null;
        let overColumn = null;

        // البحث عن العمود الأصلي للطلب
        for (const [status, orders] of Object.entries(ordersByStatus)) {
            if (orders.some(order => order.id === activeId)) {
                activeColumn = status;
                break;
            }
        }

        // البحث عن العمود الهدف (إما طلب آخر أو عمود مباشرة)
        // أولاً، تحقق إذا كان overId هو اسم عمود مباشرة
        if (ORDER_COLUMNS.some(col => col.key === overId)) {
            overColumn = overId;
        } else {
            // إذا لم يكن، فهو طلب آخر - ابحث عن عموده
            for (const [status, orders] of Object.entries(ordersByStatus)) {
                if (orders.some(order => order.id === overId)) {
                    overColumn = status;
                    break;
                }
            }
        }

        console.log('📍 الأعمدة في handleDragOver:', { activeColumn, overColumn, activeId, overId });
        console.log('🔍 تحقق من تغيير العمود في handleDragOver:', {
            isDifferent: activeColumn !== overColumn,
            activeColumn,
            overColumn,
            willUpdate: activeColumn && overColumn && activeColumn !== overColumn
        });

        // إذا كان السحب فوق عمود مختلف، حدث الحالة فوراً
        if (activeColumn && overColumn && activeColumn !== overColumn) {
            console.log('⚡ تحديث محلي فوري للحركة السلسة');
            // تحديث الحالة محلياً للحركة السريعة
            setLocalOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === activeId
                        ? { ...order, status: overColumn }
                        : order
                )
            );
        }
    };

    // معالجة نهاية السحب
    const handleDragEnd = (event) => {
        console.log('🎯 بداية handleDragEnd:', event);
        const { active, over } = event;

        if (!active || !over) {
            console.log('❌ لا يوجد active أو over');
            setActiveId(null);
            return;
        }

        const activeId = active.id;
        const overId = over.id;
        console.log('🔄 تفاصيل السحب:', { activeId, overId });

        // البحث عن العمود الذي يحتوي على الطلب
        let activeColumn = null;
        let overColumn = null;

        // البحث عن العمود الأصلي للطلب
        for (const [status, orders] of Object.entries(ordersByStatus)) {
            if (orders.some(order => order.id === activeId)) {
                activeColumn = status;
                break;
            }
        }

        // البحث عن العمود الهدف (إما طلب آخر أو عمود مباشرة)
        // أولاً، تحقق إذا كان overId هو اسم عمود مباشرة
        if (ORDER_COLUMNS.some(col => col.key === overId)) {
            overColumn = overId;
        } else {
            // إذا لم يكن، فهو طلب آخر - ابحث عن عموده
            for (const [status, orders] of Object.entries(ordersByStatus)) {
                if (orders.some(order => order.id === overId)) {
                    overColumn = status;
                    break;
                }
            }
        }

        console.log('📍 الأعمدة:', { activeColumn, overColumn, activeId, overId });
        console.log('🔍 تحقق من تغيير العمود:', {
            isDifferent: activeColumn !== overColumn,
            activeColumn,
            overColumn,
            willUpdate: activeColumn && overColumn && activeColumn !== overColumn
        });

        // إذا كان السحب فوق عمود مختلف، حدث الحالة في الخادم
        if (activeColumn && overColumn && activeColumn !== overColumn) {
            console.log('✅ تم تغيير العمود! سيتم تحديث الحالة');
            const order = localOrders.find(o => o.id === activeId);
            console.log('🔍 الطلب المحدد:', order);
            if (order && order.status !== overColumn) {
                console.log('🚀 استدعاء handleStatusUpdate:', { activeId, overColumn });
                // تحديث فوري في الخادم
                handleStatusUpdate(activeId, overColumn);
            } else {
                console.log('⚠️ الطلب موجود بالفعل في العمود المطلوب');
            }
        } else {
            console.log('❌ لم يتم تغيير العمود أو لم يتم العثور على الأعمدة');
            console.log('🔍 تفاصيل إضافية:', {
                activeColumn,
                overColumn,
                isDifferent: activeColumn !== overColumn,
                hasActiveColumn: !!activeColumn,
                hasOverColumn: !!overColumn
            });
        }

        setActiveId(null);
    };

    // تحديث حالة الطلب
    const handleStatusUpdate = async (orderId, newStatus) => {
        console.log('🚀 تم استدعاء handleStatusUpdate!', { orderId, newStatus });
        console.log('🔄 تحديث حالة الطلب:', { orderId, newStatus });
        setIsUpdating(true);

        try {
            // تحديث محلي فوري للحركة السلسة
            setLocalOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId
                        ? { ...order, status: newStatus }
                        : order
                )
            );

            console.log('📤 إرسال طلب تحديث للخادم:', { orderId, status: newStatus });

            // تحديث في الخادم
            const result = await updateOrderMutation.mutateAsync({
                id: orderId,
                data: { status: newStatus }
            });

            console.log('✅ تم تحديث حالة الطلب بنجاح:', result);

            toast.success(`تم تحديث حالة الطلب إلى ${ORDER_STATUSES[newStatus].label}`, {
                position: "top-right",
                autoClose: 3000,
            });

            // إعادة تحميل البيانات للتأكد من التزامن
            await refetch();
        } catch (error) {
            console.error('❌ خطأ في تحديث حالة الطلب:', error);
            console.error('تفاصيل الخطأ:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });

            toast.error('حدث خطأ في تحديث حالة الطلب', {
                position: "top-right",
                autoClose: 3000,
            });

            // إعادة تحميل البيانات في حالة الخطأ
            await refetch();
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] flex items-center justify-center">
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                    <h3 className="text-2xl font-bold text-white mb-2">جاري تحميل الطلبات...</h3>
                    <p className="text-slate-400">يرجى الانتظار</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] flex items-center justify-center">
                <div className="text-center py-20">
                    <XCircle size={48} className="text-red-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">خطأ في تحميل الطلبات</h3>
                    <p className="text-red-300">{error.message || 'حدث خطأ غير متوقع'}</p>
                </div>
            </div>
        );
    }

    return (
        <div dir="rtl" className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] p-4 lg:p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-gradient-to-r from-[#2C6D90] to-[#4A90E2] rounded-2xl shadow-lg">
                            <ShoppingCart className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-[#F9F3EF] flex items-center gap-3">
                                لوحة الطلبات
                                <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
                            </h1>
                            <p className="text-[#F9F3EF]/70 text-lg">إدارة الطلبات بطريقة كانبان تفاعلية</p>
                        </div>
                    </div>

                    {/* أزرار التحكم */}
                    <div className="flex items-center gap-3">
                        {isUpdating && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-xl">
                                <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
                                <span className="text-blue-300 text-sm">جاري التحديث...</span>
                            </div>
                        )}
                        <button
                            onClick={() => refetch()}
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-300"
                        >
                            <RefreshCw className="w-4 h-4 text-white" />
                            <span className="text-white text-sm">تحديث</span>
                        </button>
                    </div>
                </div>


            </div>

            {/* لوحة كانبان مع DnD */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="flex gap-6 overflow-x-auto pb-6">
                    {ORDER_COLUMNS.map((column) => {
                        const statusConfig = ORDER_STATUSES[column.key];
                        const columnOrders = ordersByStatus[column.key] || [];

                        return (
                            <OrderColumn
                                key={column.key}
                                column={column}
                                orders={columnOrders}
                                statusConfig={statusConfig}
                                convertCurrency={convertCurrency}
                                getCurrencySymbol={getCurrencySymbol}
                                getTagColor={getTagColor}
                                getStarRating={getStarRating}
                                isDragOver={false} // يمكن تحسينه لاحقاً
                            />
                        );
                    })}
                </div>

                {/* Drag Overlay */}
                <DragOverlay>
                    {activeId ? (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="bg-white/20 backdrop-blur-sm border border-blue-400/50 rounded-2xl p-4 shadow-2xl max-w-xs"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                <span className="text-blue-300 text-xs font-medium">جاري النقل...</span>
                            </div>
                            <div className="text-white font-semibold text-sm">
                                {(() => {
                                    const order = localOrders.find(o => o.id === activeId);
                                    return order ? (order.customerName ? `طلب من ${order.customerName}` : `طلب #${order.id.slice(-6)}`) : 'طلب';
                                })()}
                            </div>
                            <div className="text-white/70 text-xs mt-1">
                                اسحب إلى العمود المطلوب
                            </div>
                        </motion.div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
