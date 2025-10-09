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
    ExternalLink,
    ChevronDown,
    Settings
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

// مكون نافذة منبثقة لتغيير حالة الطلب
function StatusChangeModal({ order, isOpen, onClose, onStatusChange, isUpdating, convertCurrency, getCurrencySymbol }) {
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">تغيير حالة الطلب</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <XCircle size={20} className="text-white/70" />
                    </button>
                </div>

                <div className="mb-4">
                    <div className="text-sm text-white/70 mb-2">الطلب:</div>
                    <div className="text-white font-medium">
                        {order.customerName ? `طلب من ${order.customerName}` : `طلب #${order.id.slice(-6)}`}
                    </div>
                    <div className="text-sm text-white/60">
                        {getCurrencySymbol()}{convertCurrency(order.totalAmount || order.total || 0).toLocaleString()}
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="text-sm text-white/70 mb-3">اختر الحالة الجديدة:</div>
                    {ORDER_COLUMNS.map((column) => {
                        const statusConfig = ORDER_STATUSES[column.key];
                        const StatusIcon = statusConfig.icon;
                        const isCurrentStatus = order.status === column.key;

                        return (
                            <button
                                key={column.key}
                                onClick={() => {
                                    if (!isCurrentStatus) {
                                        onStatusChange(order.id, column.key);
                                        onClose();
                                    }
                                }}
                                disabled={isCurrentStatus || isUpdating}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isCurrentStatus
                                    ? 'bg-blue-500/30 border border-blue-500/50 cursor-not-allowed'
                                    : 'hover:bg-white/20 border border-transparent hover:border-white/30 bg-white/5'
                                    }`}
                            >
                                <StatusIcon size={18} className={statusConfig.textColor} />
                                <span className={`text-sm ${statusConfig.textColor}`}>
                                    {column.title}
                                </span>
                                {isCurrentStatus && (
                                    <CheckCircle size={18} className="text-blue-400 ml-auto" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {isUpdating && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-blue-300">
                        <RefreshCw size={16} className="animate-spin" />
                        <span className="text-sm">جاري التحديث...</span>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}

// مكون أزرار سريعة لتغيير الحالة
function QuickStatusButtons({ order, onStatusChange, isUpdating }) {
    const currentStatus = order.status;

    // الحصول على الحالات المتاحة للتغيير (غير الحالة الحالية)
    const availableStatuses = ORDER_COLUMNS.filter(col => col.key !== currentStatus);

    return (
        <div className="flex flex-wrap gap-1">
            {availableStatuses.slice(0, 3).map((column) => {
                const statusConfig = ORDER_STATUSES[column.key];
                const StatusIcon = statusConfig.icon;

                return (
                    <button
                        key={column.key}
                        onClick={() => onStatusChange(order.id, column.key)}
                        disabled={isUpdating}
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-all duration-200 ${isUpdating
                            ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                            : `bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30`
                            }`}
                        title={`تغيير إلى ${column.title}`}
                    >
                        {isUpdating ? (
                            <RefreshCw size={10} className="animate-spin text-gray-400" />
                        ) : (
                            <StatusIcon size={10} className={statusConfig.textColor} />
                        )}
                        <span className="hidden sm:inline">{column.title}</span>
                    </button>
                );
            })}
        </div>
    );
}

// مكون قائمة منسدلة لتغيير حالة الطلب
function StatusDropdown({ order, onStatusChange, isUpdating }) {
    const [isOpen, setIsOpen] = useState(false);
    const currentStatus = ORDER_STATUSES[order.status];
    const CurrentIcon = currentStatus.icon;

    const handleStatusSelect = (newStatus) => {
        onStatusChange(order.id, newStatus);
        setIsOpen(false);
    };

    // إغلاق القائمة عند النقر خارجها
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && !event.target.closest('.status-dropdown')) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    return (
        <div className="relative status-dropdown">
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isUpdating}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-300 ${isUpdating
                    ? 'bg-gray-500/20 border-gray-500/30 text-gray-400 cursor-not-allowed'
                    : 'bg-white/10 hover:bg-white/20 border-white/20 text-white hover:border-white/30'
                    }`}
            >
                <CurrentIcon size={14} className={currentStatus.textColor} />
                <span className="text-xs">{currentStatus.label}</span>
                <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute top-full left-0 mt-1 w-48 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl shadow-2xl z-50"
                >
                    <div className="p-2 space-y-1">
                        {ORDER_COLUMNS.map((column) => {
                            const statusConfig = ORDER_STATUSES[column.key];
                            const StatusIcon = statusConfig.icon;
                            const isCurrentStatus = order.status === column.key;

                            return (
                                <button
                                    key={column.key}
                                    onClick={() => handleStatusSelect(column.key)}
                                    disabled={isCurrentStatus || isUpdating}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${isCurrentStatus
                                        ? 'bg-blue-500/30 border border-blue-500/50 cursor-not-allowed'
                                        : 'hover:bg-white/20 border border-transparent hover:border-white/30'
                                        }`}
                                >
                                    <StatusIcon size={14} className={statusConfig.textColor} />
                                    <span className={`text-sm ${statusConfig.textColor}`}>
                                        {column.title}
                                    </span>
                                    {isCurrentStatus && (
                                        <CheckCircle size={14} className="text-blue-400 ml-auto" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </motion.div>
            )}
        </div>
    );
}

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
            className={`relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-3 sm:p-4 cursor-move hover:border-white/20 transition-all duration-300 ${isDragging
                ? 'opacity-80 shadow-2xl border-blue-400/50 bg-blue-500/10'
                : 'hover:shadow-lg'
                }`}
        >
            {/* زر السحب - مخفي في الهواتف */}
            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
                <GripVertical size={14} className="text-white/50" />
            </div>

            {/* عنوان الطلب */}
            <div className="mb-2 sm:mb-3">
                <h4 className="text-white font-semibold text-xs sm:text-sm mb-1 line-clamp-2">
                    {order.customerName ? `طلب من ${order.customerName}` : `طلب #${order.id.slice(-6)}`}
                </h4>
                <p className="text-white/70 text-xs">
                    {order.orderNumber || `#${order.id.slice(-6)}`}
                </p>
            </div>

            {/* المبلغ */}
            <div className="mb-2 sm:mb-3">
                <div className="text-sm sm:text-lg font-bold text-blue-400">
                    {getCurrencySymbol()}{convertCurrency(order.totalAmount || order.total || 0).toLocaleString()}
                </div>
            </div>

            {/* تفاصيل العميل - مبسطة للهواتف */}
            <div className="mb-2 sm:mb-3 space-y-1">
                {order.customerName && (
                    <div className="flex items-center gap-1.5">
                        <User size={10} className="text-blue-400 flex-shrink-0" />
                        <span className="text-xs text-white/70 truncate">{order.customerName}</span>
                    </div>
                )}
                {order.customerPhone && (
                    <div className="flex items-center gap-1.5">
                        <Phone size={10} className="text-blue-400 flex-shrink-0" />
                        <span className="text-xs text-white/70 truncate">{order.customerPhone}</span>
                    </div>
                )}
            </div>

            {/* الوسوم - مبسطة للهواتف */}
            <div className="mb-2 sm:mb-3">
                <div className="flex flex-wrap gap-1">
                    {order.items && order.items.length > 0 && (
                        <span className={`px-1.5 py-0.5 rounded text-xs border ${getTagColor('Product')}`}>
                            {order.items.length} منتج
                        </span>
                    )}
                </div>
            </div>

            {/* تاريخ الطلب */}
            <div className="flex items-center gap-1.5 mb-3">
                <Calendar size={10} className="text-slate-400 flex-shrink-0" />
                <span className="text-xs text-slate-400">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US') : 'غير محدد'}
                </span>
            </div>

            {/* زر عرض التفاصيل - في الأسفل */}
            <div className="flex justify-center">
                <Link
                    to={`/orders/${order.id}`}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg transition-all duration-300 group"
                    onClick={(e) => e.stopPropagation()}
                    title="عرض التفاصيل"
                >
                    <Eye size={14} className="text-blue-300 group-hover:text-blue-200 transition-colors duration-300" />
                    <span className="text-xs text-blue-300 group-hover:text-blue-200 transition-colors duration-300">
                        عرض التفاصيل
                    </span>
                </Link>
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
            className={`flex-shrink-0 w-72 sm:w-80 ${isDragOver
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
                className={`${statusConfig.bgColor} ${statusConfig.borderColor} border rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 ${statusConfig.shadowColor} shadow-lg`}
            >
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-r ${statusConfig.gradient}`}>
                            <StatusIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div>
                            <h3 className={`text-sm sm:text-lg font-bold ${statusConfig.textColor}`}>
                                {column.title}
                            </h3>
                            <div className="flex items-center gap-1 sm:gap-2">
                                <span className={`text-lg sm:text-2xl font-bold ${statusConfig.textColor}`}>
                                    {stats.count}
                                </span>
                                <span className="text-xs sm:text-sm text-white/60">طلبات</span>
                            </div>
                        </div>
                    </div>
                    <button className="p-1.5 sm:p-2 hover:bg-white/10 rounded-xl transition-colors">
                        <Plus size={16} className="text-white/70 sm:w-5 sm:h-5" />
                    </button>
                </div>

                {/* المبلغ الإجمالي */}
                <div className="mb-3 sm:mb-4">
                    <div className="text-sm sm:text-xl font-bold text-white mb-1">
                        {getCurrencySymbol()}{convertCurrency(stats.totalAmount).toLocaleString()}
                    </div>
                </div>

                {/* شريط التقدم */}
                <div className="mb-2">
                    <div className="flex justify-between text-xs text-white/70 mb-1">
                        <span>التقدم</span>
                        <span>{percentage}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5 sm:h-2">
                        <motion.div
                            className={`h-1.5 sm:h-2 rounded-full bg-gradient-to-r ${statusConfig.gradient}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                        />
                    </div>
                </div>
            </motion.div>

            {/* بطاقات الطلبات */}
            <div className="space-y-2 sm:space-y-3 min-h-[300px] sm:min-h-[400px]">
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
                        className="text-center py-8 sm:py-12 text-white/50"
                    >
                        <StatusIcon size={32} className="mx-auto mb-3 opacity-50 sm:w-12 sm:h-12" />
                        <p className="text-xs sm:text-sm">لا توجد طلبات</p>
                        <p className="text-xs text-white/30 mt-1 hidden sm:block">اسحب طلباً هنا لتغيير حالته</p>
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
    const [pendingUpdates, setPendingUpdates] = useState(new Set());
    const [selectedOrderForModal, setSelectedOrderForModal] = useState(null);

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
            console.log('🔄 تحديث البيانات المحلية من الخادم:', ordersData.data);
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

            // إرسال طلب للباك إند فوراً (إذا لم يكن قيد التحديث)
            const updateKey = `${activeId}-${overColumn}`;
            if (!pendingUpdates.has(updateKey)) {
                console.log('🚀 إرسال طلب للباك إند فوراً:', { activeId, overColumn });
                setPendingUpdates(prev => new Set(prev).add(updateKey));
                handleStatusUpdate(activeId, overColumn);
            } else {
                console.log('⚠️ الطلب قيد التحديث بالفعل:', updateKey);
            }
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

        // تحقق من وجود الطلب والحالة الجديدة
        const order = localOrders.find(o => o.id === activeId);
        console.log('🔍 الطلب المحدد:', order);
        console.log('🔍 الحالة الحالية للطلب:', order?.status);
        console.log('🔍 الحالة المطلوبة:', overColumn);
        console.log('🔍 هل الحالة مختلفة؟', order?.status !== overColumn);

        // إذا كان هناك طلب وحالة جديدة مختلفة عن الحالة الحالية
        if (order && overColumn && order.status !== overColumn) {
            console.log('✅ سيتم تحديث الحالة!', {
                currentStatus: order.status,
                newStatus: overColumn,
                orderId: activeId
            });
            // تحديث فوري في الخادم
            handleStatusUpdate(activeId, overColumn);
        } else if (order && overColumn && order.status === overColumn) {
            console.log('⚠️ الطلب موجود بالفعل في الحالة المطلوبة');
        } else {
            console.log('❌ لم يتم العثور على الطلب أو الحالة المطلوبة');
            console.log('🔍 تفاصيل إضافية:', {
                hasOrder: !!order,
                hasOverColumn: !!overColumn,
                currentStatus: order?.status,
                targetStatus: overColumn,
                isDifferent: order?.status !== overColumn
            });
        }

        setActiveId(null);
    };

    // تحديث حالة الطلب
    const handleStatusUpdate = async (orderId, newStatus) => {
        console.log('🚀 تم استدعاء handleStatusUpdate!', { orderId, newStatus });
        console.log('🔄 تحديث حالة الطلب:', { orderId, newStatus });

        // إظهار رسالة تأكيد
        const order = localOrders.find(o => o.id === orderId);
        const currentStatusLabel = ORDER_STATUSES[order?.status]?.label || 'غير محدد';
        const newStatusLabel = ORDER_STATUSES[newStatus]?.label || 'غير محدد';

        if (!window.confirm(`هل أنت متأكد من تغيير حالة الطلب من "${currentStatusLabel}" إلى "${newStatusLabel}"؟`)) {
            return;
        }

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

            // تحديث في الخادم - إرسال request للباك إند
            const result = await updateOrderMutation.mutateAsync({
                id: orderId,
                data: { status: newStatus }
            });

            console.log('✅ تم تحديث حالة الطلب بنجاح في الخادم:', result);

            // إظهار رسالة نجاح
            toast.success(`تم تحديث حالة الطلب إلى ${ORDER_STATUSES[newStatus].label}`, {
                position: "top-right",
                autoClose: 3000,
            });

            // إعادة تحميل البيانات للتأكد من التزامن مع الخادم
            console.log('🔄 إعادة تحميل البيانات من الخادم...');
            await refetch();

            console.log('✅ تم إعادة تحميل البيانات من الخادم بنجاح');
        } catch (error) {
            console.error('❌ خطأ في تحديث حالة الطلب:', error);
            console.error('تفاصيل الخطأ:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });

            // إعادة الحالة المحلية إلى الحالة الأصلية في حالة الخطأ
            console.log('🔄 إعادة تحميل البيانات بعد الخطأ...');
            await refetch();

            toast.error(`حدث خطأ في تحديث حالة الطلب: ${error.message || 'خطأ غير معروف'}`, {
                position: "top-right",
                autoClose: 5000,
            });
        } finally {
            setIsUpdating(false);
            // إزالة الطلب من قائمة التحديثات المعلقة
            const updateKey = `${orderId}-${newStatus}`;
            setPendingUpdates(prev => {
                const newSet = new Set(prev);
                newSet.delete(updateKey);
                return newSet;
            });
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

            {/* لوحة كانبان مع DnD - للشاشات الكبيرة */}
            <div className="hidden lg:block">
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
                                    isDragOver={false}
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

            {/* جدول للهواتف المحمولة */}
            <div className="lg:hidden">
                <div className="space-y-4">
                    {ORDER_COLUMNS.map((column) => {
                        const statusConfig = ORDER_STATUSES[column.key];
                        const columnOrders = ordersByStatus[column.key] || [];
                        const StatusIcon = statusConfig.icon;

                        if (columnOrders.length === 0) return null;

                        return (
                            <motion.div
                                key={column.key}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4"
                            >
                                {/* رأس العمود للهواتف */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`p-2 rounded-xl bg-gradient-to-r ${statusConfig.gradient}`}>
                                        <StatusIcon className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className={`text-lg font-bold ${statusConfig.textColor}`}>
                                            {column.title}
                                        </h3>
                                        <p className="text-sm text-white/70">{columnOrders.length} طلب</p>
                                    </div>
                                </div>

                                {/* جدول الطلبات */}
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-white/10">
                                                <th className="text-right text-xs font-semibold text-white/70 py-2 px-2">العميل</th>
                                                <th className="text-right text-xs font-semibold text-white/70 py-2 px-2">المبلغ</th>
                                                <th className="text-right text-xs font-semibold text-white/70 py-2 px-2">الحالة</th>
                                                <th className="text-right text-xs font-semibold text-white/70 py-2 px-2">التاريخ</th>
                                                <th className="text-right text-xs font-semibold text-white/70 py-2 px-2">الإجراءات</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {columnOrders.map((order) => (
                                                <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="py-3 px-2">
                                                        <div>
                                                            <div className="text-sm font-medium text-white">
                                                                {order.customerName || 'عميل غير محدد'}
                                                            </div>
                                                            <div className="text-xs text-white/60">
                                                                {order.customerPhone || ''}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-2">
                                                        <div className="text-sm font-bold text-blue-400">
                                                            {getCurrencySymbol()}{convertCurrency(order.totalAmount || order.total || 0).toLocaleString()}
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-2">
                                                       {ORDER_STATUSES[order.status].label}
                                                    </td>
                                                    <td className="py-3 px-2">
                                                        <div className="text-xs text-white/70">
                                                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US') : 'غير محدد'}
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-2">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => setSelectedOrderForModal(order)}
                                                                className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg transition-all duration-300"
                                                                title="تغيير الحالة"
                                                            >
                                                                <Settings size={12} className="text-green-300" />
                                                                <span className="text-xs text-green-300">تغيير</span>
                                                            </button>
                                                            <Link
                                                                to={`/orders/${order.id}`}
                                                                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg transition-all duration-300"
                                                            >
                                                                <Eye size={12} className="text-blue-300" />
                                                                <span className="text-xs text-blue-300">عرض</span>
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* النافذة المنبثقة لتغيير الحالة */}
            <StatusChangeModal
                order={selectedOrderForModal}
                isOpen={!!selectedOrderForModal}
                onClose={() => setSelectedOrderForModal(null)}
                onStatusChange={handleStatusUpdate}
                isUpdating={isUpdating}
                convertCurrency={convertCurrency}
                getCurrencySymbol={getCurrencySymbol}
            />
        </div>
    );
}
