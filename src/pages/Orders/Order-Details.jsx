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

export default function OrderDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { convertCurrency, getCurrencySymbol, getCurrencyCode, toggleCurrency, showExchangeModal, setShowExchangeModal, exchangeRate, updateExchangeRate } = useCurrency();
    const { isDark } = useTheme();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    // Demo data - in real app, this would come from API
    const demoOrders = [
        {
            id: 1,
            orderNumber: "ORD-2024-001",
            customer: {
                name: "أحمد محمد",
                email: "ahmed@example.com",
                phone: "+966501234567",
                address: "الرياض، المملكة العربية السعودية"
            },
            items: [
                {
                    id: 1,
                    name: "MacBook Pro 16-inch M3 Max",
                    price: 15999,
                    originalPrice: 17999,
                    quantity: 1,
                    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200",
                    specifications: {
                        processor: "Apple M3 Max",
                        ram: "32GB",
                        storage: "1TB SSD",
                        graphics: "M3 Max GPU"
                    },
                    category: "laptops",
                    brand: "Apple"
                },
                {
                    id: 2,
                    name: "Logitech MX Master 3S",
                    price: 299,
                    originalPrice: 399,
                    quantity: 2,
                    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200",
                    specifications: {
                        connectivity: "Bluetooth & USB-C",
                        battery: "Up to 70 days",
                        dpi: "8000 DPI"
                    },
                    category: "accessories",
                    brand: "Logitech"
                }
            ],
            subtotal: 16597,
            shipping: 0,
            tax: 0,
            discount: 200,
            total: 16397,
            status: "completed",
            paymentMethod: "credit_card",
            paymentStatus: "paid",
            shippingAddress: {
                street: "شارع الملك فهد، حي النخيل",
                city: "الرياض",
                region: "منطقة الرياض",
                postalCode: "12345",
                country: "المملكة العربية السعودية"
            },
            billingAddress: {
                street: "شارع الملك فهد، حي النخيل",
                city: "الرياض",
                region: "منطقة الرياض",
                postalCode: "12345",
                country: "المملكة العربية السعودية"
            },
            orderDate: "2024-01-15T10:30:00Z",
            deliveryDate: "2024-01-18T14:20:00Z",
            trackingNumber: "TRK123456789",
            notes: "يرجى التسليم في الصباح الباكر",
            timeline: [
                {
                    status: "order_placed",
                    title: "تم وضع الطلب",
                    description: "تم استلام طلبك بنجاح",
                    date: "2024-01-15T10:30:00Z",
                    completed: true
                },
                {
                    status: "payment_confirmed",
                    title: "تم تأكيد الدفع",
                    description: "تم تأكيد عملية الدفع بنجاح",
                    date: "2024-01-15T10:35:00Z",
                    completed: true
                },
                {
                    status: "processing",
                    title: "قيد المعالجة",
                    description: "يتم تحضير طلبك للشحن",
                    date: "2024-01-15T11:00:00Z",
                    completed: true
                },
                {
                    status: "shipped",
                    title: "تم الشحن",
                    description: "تم شحن طلبك وهو في الطريق إليك",
                    date: "2024-01-16T09:15:00Z",
                    completed: true
                },
                {
                    status: "delivered",
                    title: "تم التسليم",
                    description: "تم تسليم طلبك بنجاح",
                    date: "2024-01-18T14:20:00Z",
                    completed: true
                }
            ]
        },
        {
            id: 2,
            orderNumber: "ORD-2024-002",
            customer: {
                name: "فاطمة أحمد",
                email: "fatima@example.com",
                phone: "+966507654321",
                address: "جدة، المملكة العربية السعودية"
            },
            items: [
                {
                    id: 3,
                    name: "Dell XPS 15 OLED",
                    price: 12999,
                    originalPrice: 14999,
                    quantity: 1,
                    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200",
                    specifications: {
                        processor: "Intel Core i7-13700H",
                        ram: "16GB",
                        storage: "512GB SSD",
                        graphics: "NVIDIA RTX 4050"
                    },
                    category: "laptops",
                    brand: "Dell"
                }
            ],
            subtotal: 12999,
            shipping: 50,
            tax: 650,
            discount: 0,
            total: 13699,
            status: "processing",
            paymentMethod: "bank_transfer",
            paymentStatus: "pending",
            shippingAddress: {
                street: "شارع العليا، حي الزهراء",
                city: "جدة",
                region: "منطقة مكة المكرمة",
                postalCode: "54321",
                country: "المملكة العربية السعودية"
            },
            billingAddress: {
                street: "شارع العليا، حي الزهراء",
                city: "جدة",
                region: "منطقة مكة المكرمة",
                postalCode: "54321",
                country: "المملكة العربية السعودية"
            },
            orderDate: "2024-01-16T14:20:00Z",
            deliveryDate: null,
            trackingNumber: "TRK987654321",
            notes: "يرجى التواصل قبل التسليم",
            timeline: [
                {
                    status: "order_placed",
                    title: "تم وضع الطلب",
                    description: "تم استلام طلبك بنجاح",
                    date: "2024-01-16T14:20:00Z",
                    completed: true
                },
                {
                    status: "payment_pending",
                    title: "في انتظار الدفع",
                    description: "في انتظار تأكيد عملية التحويل البنكي",
                    date: "2024-01-16T14:25:00Z",
                    completed: false
                },
                {
                    status: "processing",
                    title: "قيد المعالجة",
                    description: "سيتم تحضير طلبك للشحن بعد تأكيد الدفع",
                    date: null,
                    completed: false
                },
                {
                    status: "shipped",
                    title: "تم الشحن",
                    description: "سيتم شحن طلبك بعد المعالجة",
                    date: null,
                    completed: false
                },
                {
                    status: "delivered",
                    title: "تم التسليم",
                    description: "سيتم تسليم طلبك بعد الشحن",
                    date: null,
                    completed: false
                }
            ]
        },
        {
            id: 3,
            orderNumber: "ORD-2024-003",
            customer: {
                name: "محمد علي",
                email: "mohammed@example.com",
                phone: "+966509876543",
                address: "الدمام، المملكة العربية السعودية"
            },
            items: [
                {
                    id: 4,
                    name: "Samsung 49-inch Ultrawide Monitor",
                    price: 3999,
                    originalPrice: 4999,
                    quantity: 1,
                    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200",
                    specifications: {
                        size: "49-inch",
                        resolution: "5120x1440",
                        refreshRate: "120Hz",
                        panel: "VA"
                    },
                    category: "accessories",
                    brand: "Samsung"
                },
                {
                    id: 5,
                    name: "ASUS ROG Strix G16",
                    price: 11999,
                    originalPrice: 13999,
                    quantity: 1,
                    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=200",
                    specifications: {
                        processor: "Intel Core i9-13980HX",
                        ram: "32GB",
                        storage: "1TB SSD",
                        graphics: "NVIDIA RTX 4070"
                    },
                    category: "laptops",
                    brand: "ASUS"
                }
            ],
            subtotal: 15998,
            shipping: 0,
            tax: 800,
            discount: 0,
            total: 16798,
            status: "shipped",
            paymentMethod: "credit_card",
            paymentStatus: "paid",
            shippingAddress: {
                street: "شارع التحلية، حي الفيصلية",
                city: "الدمام",
                region: "المنطقة الشرقية",
                postalCode: "67890",
                country: "المملكة العربية السعودية"
            },
            billingAddress: {
                street: "شارع التحلية، حي الفيصلية",
                city: "الدمام",
                region: "المنطقة الشرقية",
                postalCode: "67890",
                country: "المملكة العربية السعودية"
            },
            orderDate: "2024-01-17T09:15:00Z",
            deliveryDate: "2024-01-20T16:30:00Z",
            trackingNumber: "TRK456789123",
            notes: "يرجى التأكد من وجود شخص في العنوان",
            timeline: [
                {
                    status: "order_placed",
                    title: "تم وضع الطلب",
                    description: "تم استلام طلبك بنجاح",
                    date: "2024-01-17T09:15:00Z",
                    completed: true
                },
                {
                    status: "payment_confirmed",
                    title: "تم تأكيد الدفع",
                    description: "تم تأكيد عملية الدفع بنجاح",
                    date: "2024-01-17T09:20:00Z",
                    completed: true
                },
                {
                    status: "processing",
                    title: "قيد المعالجة",
                    description: "يتم تحضير طلبك للشحن",
                    date: "2024-01-17T10:00:00Z",
                    completed: true
                },
                {
                    status: "shipped",
                    title: "تم الشحن",
                    description: "تم شحن طلبك وهو في الطريق إليك",
                    date: "2024-01-18T08:30:00Z",
                    completed: true
                },
                {
                    status: "delivered",
                    title: "تم التسليم",
                    description: "سيتم تسليم طلبك قريباً",
                    date: null,
                    completed: false
                }
            ]
        },
        {
            id: 4,
            orderNumber: "ORD-2024-004",
            customer: {
                name: "نورا السعد",
                email: "nora@example.com",
                phone: "+966501112233",
                address: "الخبر، المملكة العربية السعودية"
            },
            items: [
                {
                    id: 6,
                    name: "Logitech MX Master 3S",
                    price: 299,
                    originalPrice: 399,
                    quantity: 3,
                    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200",
                    specifications: {
                        connectivity: "Bluetooth & USB-C",
                        battery: "Up to 70 days",
                        dpi: "8000 DPI"
                    },
                    category: "accessories",
                    brand: "Logitech"
                }
            ],
            subtotal: 897,
            shipping: 0,
            tax: 45,
            discount: 0,
            total: 942,
            status: "cancelled",
            paymentMethod: "credit_card",
            paymentStatus: "refunded",
            shippingAddress: {
                street: "شارع الأمير محمد، حي الشاطئ",
                city: "الخبر",
                region: "المنطقة الشرقية",
                postalCode: "11111",
                country: "المملكة العربية السعودية"
            },
            billingAddress: {
                street: "شارع الأمير محمد، حي الشاطئ",
                city: "الخبر",
                region: "المنطقة الشرقية",
                postalCode: "11111",
                country: "المملكة العربية السعودية"
            },
            orderDate: "2024-01-18T14:45:00Z",
            deliveryDate: null,
            trackingNumber: null,
            notes: "تم إلغاء الطلب بناءً على طلب العميل",
            timeline: [
                {
                    status: "order_placed",
                    title: "تم وضع الطلب",
                    description: "تم استلام طلبك بنجاح",
                    date: "2024-01-18T14:45:00Z",
                    completed: true
                },
                {
                    status: "payment_confirmed",
                    title: "تم تأكيد الدفع",
                    description: "تم تأكيد عملية الدفع بنجاح",
                    date: "2024-01-18T14:50:00Z",
                    completed: true
                },
                {
                    status: "cancelled",
                    title: "تم إلغاء الطلب",
                    description: "تم إلغاء الطلب بناءً على طلب العميل",
                    date: "2024-01-18T15:30:00Z",
                    completed: true
                },
                {
                    status: "refunded",
                    title: "تم استرداد المبلغ",
                    description: "تم استرداد المبلغ إلى الحساب",
                    date: "2024-01-18T16:00:00Z",
                    completed: true
                }
            ]
        },
        {
            id: 5,
            orderNumber: "ORD-2024-005",
            customer: {
                name: "خالد النعيم",
                email: "khalid@example.com",
                phone: "+966504445566",
                address: "الرياض، المملكة العربية السعودية"
            },
            items: [
                {
                    id: 1,
                    name: "MacBook Pro 16-inch M3 Max",
                    price: 15999,
                    originalPrice: 17999,
                    quantity: 1,
                    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200",
                    specifications: {
                        processor: "Apple M3 Max",
                        ram: "32GB",
                        storage: "1TB SSD",
                        graphics: "M3 Max GPU"
                    },
                    category: "laptops",
                    brand: "Apple"
                }
            ],
            subtotal: 15999,
            shipping: 0,
            tax: 800,
            discount: 0,
            total: 16799,
            status: "pending",
            paymentMethod: "cash_on_delivery",
            paymentStatus: "pending",
            shippingAddress: {
                street: "شارع الملك عبدالعزيز، حي الملز",
                city: "الرياض",
                region: "منطقة الرياض",
                postalCode: "22222",
                country: "المملكة العربية السعودية"
            },
            billingAddress: {
                street: "شارع الملك عبدالعزيز، حي الملز",
                city: "الرياض",
                region: "منطقة الرياض",
                postalCode: "22222",
                country: "المملكة العربية السعودية"
            },
            orderDate: "2024-01-19T11:20:00Z",
            deliveryDate: null,
            trackingNumber: null,
            notes: "الدفع عند الاستلام - يرجى التأكد من وجود شخص في العنوان",
            timeline: [
                {
                    status: "order_placed",
                    title: "تم وضع الطلب",
                    description: "تم استلام طلبك بنجاح",
                    date: "2024-01-19T11:20:00Z",
                    completed: true
                },
                {
                    status: "processing",
                    title: "قيد المعالجة",
                    description: "يتم تحضير طلبك للشحن",
                    date: "2024-01-19T12:00:00Z",
                    completed: false
                },
                {
                    status: "shipped",
                    title: "تم الشحن",
                    description: "سيتم شحن طلبك بعد المعالجة",
                    date: null,
                    completed: false
                },
                {
                    status: "delivered",
                    title: "تم التسليم",
                    description: "سيتم تسليم طلبك بعد الشحن",
                    date: null,
                    completed: false
                }
            ]
        }
    ];

    const order = demoOrders.find(o => o.id === parseInt(id));

    useEffect(() => {
        if (!order) {
            navigate('/orders');
        }
        window.scrollTo(0, 0);
    }, [order, navigate]);

    if (!order) {
        return (
            <div className="min-h-screen bg-nsr-dark flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-nsr-primary mb-4">الطلب غير موجود</h2>
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
                                تم إنشاء الطلب في {new Date(order.orderDate).toLocaleDateString('ar-SA', {
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
                                        <p className="text-nsr-primary font-semibold">{order.customer.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-nsr-neutral">البريد الإلكتروني</label>
                                        <div className="flex items-center gap-2">
                                            <Mail size={16} className="text-nsr-accent" />
                                            <p className="text-nsr-primary">{order.customer.email}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-nsr-neutral">رقم الهاتف</label>
                                        <div className="flex items-center gap-2">
                                            <Phone size={16} className="text-nsr-accent" />
                                            <p className="text-nsr-primary">{order.customer.phone}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm text-nsr-neutral">العنوان</label>
                                        <p className="text-nsr-primary">{order.customer.address}</p>
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
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex gap-4 p-4 bg-nsr-primary/5 rounded-xl">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-20 h-20 rounded-xl object-cover"
                                        />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-nsr-primary">{item.name}</h3>
                                                    <p className="text-sm text-nsr-neutral">{item.brand} • {item.category}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-nsr-accent">
                                                        {getCurrencySymbol()}{convertCurrency(item.price).toLocaleString()}
                                                    </p>
                                                    {item.originalPrice && (
                                                        <p className="text-sm text-nsr-neutral line-through">
                                                            {getCurrencySymbol()}{convertCurrency(item.originalPrice).toLocaleString()}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <div className="text-sm text-nsr-neutral">
                                                    الكمية: <span className="font-semibold text-nsr-primary">{item.quantity}</span>
                                                </div>
                                                <div className="text-sm text-nsr-neutral">
                                                    المجموع: <span className="font-bold text-nsr-accent">
                                                        {getCurrencySymbol()}{convertCurrency(item.price * item.quantity).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>

                                            {item.specifications && (
                                                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                                                    {Object.entries(item.specifications).slice(0, 4).map(([key, value]) => (
                                                        <div key={key} className="flex justify-between">
                                                            <span className="text-nsr-neutral">{key}:</span>
                                                            <span className="text-nsr-primary font-medium">{value}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Timeline */}
                        <div className="bg-nsr-secondary/30 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <Calendar size={24} className="text-nsr-accent" />
                                <h2 className="text-2xl font-bold text-nsr-primary">مسار الطلب</h2>
                            </div>

                            <div className="space-y-4">
                                {order.timeline.map((step, index) => (
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
                                ))}
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
                                        {getCurrencySymbol()}{convertCurrency(order.subtotal).toLocaleString()}
                                    </span>
                                </div>

                                {order.discount > 0 && (
                                    <div className="flex justify-between text-green-400">
                                        <span>الخصم</span>
                                        <span>-{getCurrencySymbol()}{convertCurrency(order.discount).toLocaleString()}</span>
                                    </div>
                                )}

                                <div className="flex justify-between">
                                    <span className="text-nsr-neutral">الشحن</span>
                                    <span className="text-nsr-primary">
                                        {order.shipping === 0 ? 'مجاني' : `${getCurrencySymbol()}${convertCurrency(order.shipping).toLocaleString()}`}
                                    </span>
                                </div>

                                {order.tax > 0 && (
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
                                            {getCurrencySymbol()}{convertCurrency(order.total).toLocaleString()}
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
                                <p className="text-nsr-primary">{order.shippingAddress.street}</p>
                                <p className="text-nsr-primary">{order.shippingAddress.city}, {order.shippingAddress.region}</p>
                                <p className="text-nsr-primary">{order.shippingAddress.postalCode}</p>
                                <p className="text-nsr-primary">{order.shippingAddress.country}</p>
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
                                    <span className="text-nsr-primary">{getPaymentMethodText(order.paymentMethod)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-nsr-neutral">حالة الدفع</span>
                                    <span className={`px-2 py-1 rounded-lg text-xs border ${getPaymentStatusColor(order.paymentStatus)}`}>
                                        {getPaymentStatusText(order.paymentStatus)}
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
                        {order.notes && (
                            <div className="bg-nsr-secondary/30 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <Tag size={20} className="text-nsr-accent" />
                                    <h3 className="text-lg font-bold text-nsr-primary">ملاحظات</h3>
                                </div>
                                <p className="text-sm text-nsr-neutral">{order.notes}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
