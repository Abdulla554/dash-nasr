/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Star,
    Share2,
    Check,
    Truck,
    Shield,
    ChevronLeft,
    ChevronRight,
    Edit,
    Trash,
    DollarSign,
    Package,
    Calendar,
    Tag
} from "lucide-react";
import { toast } from "react-toastify";
import ConfirmationModal from "../../components/ConfirmationModal";
import ExchangeRateModal from "../../components/ExchangeRateModal";
import { useCurrency } from "../../contexts/CurrencyContext.jsx";
import { useTheme } from "../../contexts/ThemeContext.jsx";

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currency, convertCurrency, getCurrencySymbol, getCurrencyCode, toggleCurrency, showExchangeModal, setShowExchangeModal, exchangeRate, updateExchangeRate } = useCurrency();
    const { isDark } = useTheme();
    const [selectedImage, setSelectedImage] = useState(0);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    // Demo data - in real app, this would come from API
    const demoProducts = [
        {
            id: 1,
            title: "MacBook Pro 16-inch M3 Max",
            description: "أقوى لابتوب من Apple مع معالج M3 Max وذاكرة 32GB ومساحة تخزين 1TB SSD. مثالي للمطورين والمصممين والمحترفين الذين يحتاجون إلى أداء استثنائي.",
            price: 15999,
            originalPrice: 17999,
            category: "laptops",
            brand: "Apple",
            images: [
                "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200",
                "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=1200",
                "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200",
                "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200"
            ],
            specifications: {
                processor: "Apple M3 Max",
                ram: "32GB",
                storage: "1TB SSD",
                graphics: "M3 Max GPU",
                display: "16.2-inch Liquid Retina XDR",
                weight: "2.15 kg",
                battery: "Up to 22 hours",
                os: "macOS Sonoma",
                connectivity: "Thunderbolt 4, USB-C, HDMI, SDXC",
                keyboard: "Backlit Magic Keyboard",
                trackpad: "Force Touch trackpad"
            },
            rating: 4.9,
            reviews: 128,
            stock: 15,
            isNew: true,
            isBestSeller: true,
            tags: ["premium", "professional", "creative"],
            features: [
                "معالج M3 Max فائق السرعة",
                "شاشة Liquid Retina XDR 16.2 بوصة",
                "ذاكرة 32GB موحدة",
                "تخزين SSD 1TB فائق السرعة",
                "بطارية تدوم حتى 22 ساعة",
                "تصميم أنيق ومقاوم للخدش"
            ],
            warranty: "سنة واحدة من Apple",
            shipping: "شحن مجاني خلال 2-3 أيام عمل"
        },
        {
            id: 2,
            title: "Dell XPS 15 OLED",
            description: "لابتوب عالي الأداء مع شاشة OLED 4K ومعالج Intel i7 الجيل الثالث عشر. مثالي للمحترفين الذين يحتاجون إلى دقة عالية وأداء ممتاز.",
            price: 12999,
            originalPrice: 14999,
            category: "laptops",
            brand: "Dell",
            images: [
                "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200",
                "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200",
                "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=1200",
                "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200"
            ],
            specifications: {
                processor: "Intel Core i7-13700H",
                ram: "16GB",
                storage: "512GB SSD",
                graphics: "NVIDIA RTX 4050",
                display: "15.6-inch 4K OLED",
                weight: "1.84 kg",
                battery: "Up to 12 hours",
                os: "Windows 11 Pro",
                connectivity: "Thunderbolt 4, USB-C, HDMI, SD card reader",
                keyboard: "Backlit keyboard",
                trackpad: "Precision touchpad"
            },
            rating: 4.7,
            reviews: 89,
            stock: 23,
            isNew: false,
            isBestSeller: true,
            tags: ["oled", "4k", "portable"],
            features: [
                "شاشة OLED 4K بدقة استثنائية",
                "معالج Intel i7-13700H",
                "كرت شاشة NVIDIA RTX 4050",
                "ذاكرة 16GB DDR5",
                "تخزين SSD 512GB",
                "تصميم أنيق وخفيف الوزن"
            ],
            warranty: "سنتان من Dell",
            shipping: "شحن مجاني خلال 3-5 أيام عمل"
        }
    ];

    const product = demoProducts.find(p => p.id === parseInt(id));

    useEffect(() => {
        if (!product) {
            navigate('/products');
        }
        window.scrollTo(0, 0);
    }, [product, navigate]);

    if (!product) {
        return (
            <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${isDark ? 'bg-gradient-nsr-dark' : 'bg-gradient-nsr-light'}`}>
                <div className="text-center">
                    <h2 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${isDark ? 'text-nsr-light' : 'text-nsr-dark'}`}>المنتج غير موجود</h2>
                    <Link to="/products" className="text-nsr-accent hover:underline">
                        العودة للمنتجات
                    </Link>
                </div>
            </div>
        );
    }

    const discountPercentage = product.originalPrice ?
        Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;


    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: product.title,
                text: product.description,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success("تم نسخ رابط المنتج", {
                position: "top-right",
                autoClose: 2000,
            });
        }
    };

    const nextImage = () => {
        setSelectedImage((prev) => (prev + 1) % product.images.length);
    };

    const prevImage = () => {
        setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    };

    const handleDelete = () => {
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        toast.success("تم حذف المنتج بنجاح", {
            position: "top-right",
            autoClose: 3000,
        });
        navigate('/products');
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gradient-nsr-dark' : 'bg-gradient-nsr-light'}`}>
            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="تأكيد الحذف"
                message="هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء."
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
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/products')}
                            className={`flex items-center gap-2 transition-colors duration-300 ${isDark ? 'text-nsr-light hover:text-nsr-accent' : 'text-nsr-dark hover:text-nsr-accent'}`}
                        >
                            <ArrowLeft size={20} />
                            <span>العودة للمنتجات</span>
                        </motion.button>

                        <div className="flex items-center gap-4">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={toggleCurrency}
                                className={`p-2 bg-nsr-primary/10 rounded-xl hover:bg-nsr-accent/10 transition-all duration-300 flex items-center gap-2 ${isDark ? 'text-nsr-light hover:text-nsr-accent' : 'text-nsr-dark hover:text-nsr-accent'}`}
                            >
                                <DollarSign size={20} />
                                <span className="text-sm font-semibold">{getCurrencyCode()}</span>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleShare}
                                className={`p-2 bg-nsr-primary/10 rounded-xl hover:bg-nsr-accent/10 transition-all duration-300 ${isDark ? 'text-nsr-light hover:text-nsr-accent' : 'text-nsr-dark hover:text-nsr-accent'}`}
                            >
                                <Share2 size={20} />
                            </motion.button>

                        </div>
                    </div>
                </div>
            </div>

            {/* Product Details */}
            <div className="mx-auto max-w-7xl px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Images */}
                    <div className="space-y-6">
                        {/* Main Image */}
                        <div className={`relative aspect-square rounded-3xl overflow-hidden transition-colors duration-300 ${isDark ? 'bg-nsr-secondary/20' : 'bg-nsr-light-100/50'}`}>
                            <img
                                src={product.images[selectedImage]}
                                alt={product.title}
                                className="w-full h-full object-cover"
                            />

                            {/* Navigation Arrows */}
                            {product.images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-black/40 transition-colors"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-black/40 transition-colors"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </>
                            )}

                            {/* Badges */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                {product.isNew && (
                                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                        جديد
                                    </span>
                                )}
                                {product.isBestSeller && (
                                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                        الأكثر مبيعاً
                                    </span>
                                )}
                                {discountPercentage > 0 && (
                                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                        -{discountPercentage}%
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Thumbnail Images */}
                        {product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 ${selectedImage === index
                                            ? 'border-nsr-accent'
                                            : 'border-nsr-primary/30 hover:border-nsr-primary/60'
                                            }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.title} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-8">
                        {/* Brand & Rating */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-lg text-nsr-accent font-semibold">{product.brand}</span>
                                <div className="flex items-center gap-1">
                                    <Star size={16} className="text-yellow-400 fill-current" />
                                    <span className={`font-medium transition-colors duration-300 ${isDark ? 'text-nsr-light' : 'text-nsr-dark'}`}>{product.rating}</span>
                                    <span className={`transition-colors duration-300 ${isDark ? 'text-nsr-light-200' : 'text-nsr-dark-600'}`}>({product.reviews} تقييم)</span>
                                </div>
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className={`text-4xl font-bold leading-tight transition-colors duration-300 ${isDark ? 'text-nsr-light' : 'text-nsr-dark'}`}>
                            {product.title}
                        </h1>

                        {/* Description */}
                        <p className={`text-lg leading-relaxed transition-colors duration-300 ${isDark ? 'text-nsr-light-200' : 'text-nsr-dark-600'}`}>
                            {product.description}
                        </p>

                        {/* Price */}
                        <div className="flex items-center gap-4">
                            <span className="text-4xl font-bold text-nsr-accent">
                                {getCurrencySymbol()}{convertCurrency(product.price).toLocaleString()}
                            </span>
                            {product.originalPrice && (
                                <span className={`text-2xl line-through transition-colors duration-300 ${isDark ? 'text-nsr-light-200' : 'text-nsr-dark-600'}`}>
                                    {getCurrencySymbol()}{convertCurrency(product.originalPrice).toLocaleString()}
                                </span>
                            )}
                        </div>

                        {/* Stock Status */}
                        <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                            <span className={`text-lg transition-colors duration-300 ${isDark ? 'text-nsr-light' : 'text-nsr-dark'}`}>
                                {product.stock > 0 ? `${product.stock} متوفر في المخزن` : 'غير متوفر حالياً'}
                            </span>
                        </div>

                        {/* Admin Actions */}
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className={`rounded-2xl p-4 transition-colors duration-300 ${isDark ? 'bg-nsr-secondary/30' : 'bg-nsr-light-100/50'}`}>
                                    <div className="flex items-center gap-3 mb-2">
                                        <Package size={20} className="text-nsr-accent" />
                                        <h4 className={`text-sm font-semibold transition-colors duration-300 ${isDark ? 'text-nsr-light' : 'text-nsr-dark'}`}>المخزون الحالي</h4>
                                    </div>
                                    <p className="text-2xl font-bold text-nsr-accent">{product.stock}</p>
                                    <p className={`text-xs transition-colors duration-300 ${isDark ? 'text-nsr-light-200' : 'text-nsr-dark-600'}`}>وحدة متوفرة</p>
                                </div>

                                <div className={`rounded-2xl p-4 transition-colors duration-300 ${isDark ? 'bg-nsr-secondary/30' : 'bg-nsr-light-100/50'}`}>
                                    <div className="flex items-center gap-3 mb-2">
                                        <Calendar size={20} className="text-nsr-accent" />
                                        <h4 className={`text-sm font-semibold transition-colors duration-300 ${isDark ? 'text-nsr-light' : 'text-nsr-dark'}`}>تاريخ الإضافة</h4>
                                    </div>
                                    <p className={`text-sm font-bold transition-colors duration-300 ${isDark ? 'text-nsr-light' : 'text-nsr-dark'}`}>15 يناير 2024</p>
                                    <p className={`text-xs transition-colors duration-300 ${isDark ? 'text-nsr-light-200' : 'text-nsr-dark-600'}`}>منذ 3 أيام</p>
                                </div>

                                <div className={`rounded-2xl p-4 transition-colors duration-300 ${isDark ? 'bg-nsr-secondary/30' : 'bg-nsr-light-100/50'}`}>
                                    <div className="flex items-center gap-3 mb-2">
                                        <Tag size={20} className="text-nsr-accent" />
                                        <h4 className={`text-sm font-semibold transition-colors duration-300 ${isDark ? 'text-nsr-light' : 'text-nsr-dark'}`}>رقم المنتج</h4>
                                    </div>
                                    <p className={`text-sm font-bold transition-colors duration-300 ${isDark ? 'text-nsr-light' : 'text-nsr-dark'}`}>#{product.id.toString().padStart(6, '0')}</p>
                                    <p className={`text-xs transition-colors duration-300 ${isDark ? 'text-nsr-light-200' : 'text-nsr-dark-600'}`}>معرف فريد</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex-1 bg-nsr-accent text-white py-4 px-8 rounded-2xl font-semibold text-lg hover:bg-nsr-accent/90 transition-all duration-300 flex items-center justify-center gap-3"
                                >
                                    <Edit size={24} />
                                    <span>تعديل المنتج</span>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleDelete}
                                    className="px-8 py-4 bg-red-50 border border-red-500 text-red-600 rounded-2xl hover:bg-red-100 transition-colors duration-300 flex items-center gap-3"
                                >
                                    <Trash size={24} />
                                    <span>حذف المنتج</span>
                                </motion.button>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="space-y-4">
                            <h3 className={`text-2xl font-bold transition-colors duration-300 ${isDark ? 'text-nsr-light' : 'text-nsr-dark'}`}>المميزات الرئيسية</h3>
                            <div className="grid grid-cols-1 gap-3">
                                {product.features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <Check size={20} className="text-green-500 flex-shrink-0" />
                                        <span className={`transition-colors duration-300 ${isDark ? 'text-nsr-light-200' : 'text-nsr-dark-600'}`}>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="space-y-4">
                            <h3 className={`text-2xl font-bold transition-colors duration-300 ${isDark ? 'text-nsr-light' : 'text-nsr-dark'}`}>العلامات</h3>
                            <div className="flex flex-wrap gap-3">
                                {product.tags.map((tag, index) => (
                                    <span key={index} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${isDark ? 'bg-nsr-primary/10 text-nsr-light' : 'bg-nsr-light-200 text-nsr-dark'}`}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Product Management Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className={`rounded-2xl p-6 transition-colors duration-300 ${isDark ? 'bg-nsr-secondary/30' : 'bg-nsr-light-100/50'}`}>
                                <div className="flex items-center gap-3 mb-3">
                                    <Truck size={24} className="text-nsr-accent" />
                                    <h4 className={`text-lg font-semibold transition-colors duration-300 ${isDark ? 'text-nsr-light' : 'text-nsr-dark'}`}>معلومات الشحن</h4>
                                </div>
                                <div className="space-y-2">
                                    <p className={`transition-colors duration-300 ${isDark ? 'text-nsr-light-200' : 'text-nsr-dark-600'}`}>{product.shipping}</p>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className={`transition-colors duration-300 ${isDark ? 'text-nsr-light-200' : 'text-nsr-dark-600'}`}>تكلفة الشحن:</span>
                                        <span className={`font-medium transition-colors duration-300 ${isDark ? 'text-nsr-light' : 'text-nsr-dark'}`}>مجاني</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className={`transition-colors duration-300 ${isDark ? 'text-nsr-light-200' : 'text-nsr-dark-600'}`}>وقت التسليم:</span>
                                        <span className={`font-medium transition-colors duration-300 ${isDark ? 'text-nsr-light' : 'text-nsr-dark'}`}>2-3 أيام</span>
                                    </div>
                                </div>
                            </div>

                            <div className={`rounded-2xl p-6 transition-colors duration-300 ${isDark ? 'bg-nsr-secondary/30' : 'bg-nsr-light-100/50'}`}>
                                <div className="flex items-center gap-3 mb-3">
                                    <Shield size={24} className="text-nsr-accent" />
                                    <h4 className={`text-lg font-semibold transition-colors duration-300 ${isDark ? 'text-nsr-light' : 'text-nsr-dark'}`}>معلومات الضمان</h4>
                                </div>
                                <div className="space-y-2">
                                    <p className={`transition-colors duration-300 ${isDark ? 'text-nsr-light-200' : 'text-nsr-dark-600'}`}>{product.warranty}</p>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className={`transition-colors duration-300 ${isDark ? 'text-nsr-light-200' : 'text-nsr-dark-600'}`}>نوع الضمان:</span>
                                        <span className={`font-medium transition-colors duration-300 ${isDark ? 'text-nsr-light' : 'text-nsr-dark'}`}>ضمان شامل</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className={`transition-colors duration-300 ${isDark ? 'text-nsr-light-200' : 'text-nsr-dark-600'}`}>مركز الصيانة:</span>
                                        <span className={`font-medium transition-colors duration-300 ${isDark ? 'text-nsr-light' : 'text-nsr-dark'}`}>متوفر</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Specifications */}
                <div className="mt-16">
                    <h2 className={`text-3xl font-bold mb-8 transition-colors duration-300 ${isDark ? 'text-nsr-light' : 'text-nsr-dark'}`}>المواصفات التقنية</h2>
                    <div className={`rounded-3xl p-8 transition-colors duration-300 ${isDark ? 'bg-nsr-secondary/30' : 'bg-nsr-light-100/50'}`}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {Object.entries(product.specifications).map(([key, value]) => (
                                <div key={key} className={`flex justify-between items-center py-3 border-b last:border-b-0 transition-colors duration-300 ${isDark ? 'border-nsr-primary/10' : 'border-nsr-primary/20'}`}>
                                    <span className={`font-medium transition-colors duration-300 ${isDark ? 'text-nsr-light-200' : 'text-nsr-dark-600'}`}>{key}:</span>
                                    <span className={`font-semibold transition-colors duration-300 ${isDark ? 'text-nsr-light' : 'text-nsr-dark'}`}>{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sales Analytics */}
                <div className="mt-16">
                    <h2 className={`text-3xl font-bold mb-8 transition-colors duration-300 ${isDark ? 'text-nsr-light' : 'text-nsr-dark'}`}>إحصائيات المبيعات</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className={`rounded-2xl p-6 transition-colors duration-300 ${isDark ? 'bg-nsr-secondary/30' : 'bg-nsr-light-100/50'}`}>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-green-500/10 rounded-lg">
                                    <Package size={20} className="text-green-500" />
                                </div>
                                <h4 className={`text-sm font-semibold transition-colors duration-300 ${isDark ? 'text-nsr-light' : 'text-nsr-dark'}`}>إجمالي المبيعات</h4>
                            </div>
                            <p className="text-2xl font-bold text-nsr-accent">1,247</p>
                            <p className={`text-xs transition-colors duration-300 ${isDark ? 'text-nsr-light-200' : 'text-nsr-dark-600'}`}>وحدة مباعة</p>
                        </div>

                        <div className={`rounded-2xl p-6 transition-colors duration-300 ${isDark ? 'bg-nsr-secondary/30' : 'bg-nsr-light-100/50'}`}>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-blue-500/10 rounded-lg">
                                    <DollarSign size={20} className="text-blue-500" />
                                </div>
                                <h4 className={`text-sm font-semibold transition-colors duration-300 ${isDark ? 'text-nsr-light' : 'text-nsr-dark'}`}>إجمالي الإيرادات</h4>
                            </div>
                            <p className="text-2xl font-bold text-nsr-accent">
                                {getCurrencySymbol()}{convertCurrency(15999 * 1247).toLocaleString()}
                            </p>
                            <p className={`text-xs transition-colors duration-300 ${isDark ? 'text-nsr-light-200' : 'text-nsr-dark-600'}`}>من هذا المنتج</p>
                        </div>

                        <div className={`rounded-2xl p-6 transition-colors duration-300 ${isDark ? 'bg-nsr-secondary/30' : 'bg-nsr-light-100/50'}`}>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-orange-500/10 rounded-lg">
                                    <Star size={20} className="text-orange-500" />
                                </div>
                                <h4 className={`text-sm font-semibold transition-colors duration-300 ${isDark ? 'text-nsr-light' : 'text-nsr-dark'}`}>متوسط التقييم</h4>
                            </div>
                            <p className="text-2xl font-bold text-nsr-accent">{product.rating}</p>
                            <p className={`text-xs transition-colors duration-300 ${isDark ? 'text-nsr-light-200' : 'text-nsr-dark-600'}`}>من 5 نجوم</p>
                        </div>

                        <div className={`rounded-2xl p-6 transition-colors duration-300 ${isDark ? 'bg-nsr-secondary/30' : 'bg-nsr-light-100/50'}`}>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-purple-500/10 rounded-lg">
                                    <Calendar size={20} className="text-purple-500" />
                                </div>
                                <h4 className={`text-sm font-semibold transition-colors duration-300 ${isDark ? 'text-nsr-light' : 'text-nsr-dark'}`}>آخر مبيع</h4>
                            </div>
                            <p className="text-2xl font-bold text-nsr-accent">2</p>
                            <p className={`text-xs transition-colors duration-300 ${isDark ? 'text-nsr-light-200' : 'text-nsr-dark-600'}`}>ساعات مضت</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
