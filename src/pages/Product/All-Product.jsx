import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Search,
  Filter,
  Plus,
  Star,
  Eye,
  Edit,
  Trash,
  ShoppingCart,
  TrendingUp,
  Award,
  Zap,
  Sun,
  Moon,
  DollarSign
} from "lucide-react";
import { motion as _motion } from "framer-motion";

import { useTheme } from "../../contexts/ThemeContext.jsx";
import { useCurrency } from "../../contexts/CurrencyContext.jsx";

export default function LuxuryProductsPage() {
  const { isDark, toggleTheme } = useTheme();
  const { convertCurrency, getCurrencySymbol, getCurrencyCode, toggleCurrency } = useCurrency();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    brand: 'all',
    priceRange: 'all',
    sortBy: 'newest'
  });

  // Demo data for products
  const demoProducts = [
    {
      id: 1,
      title: "MacBook Pro 16-inch M3 Max",
      description: "أقوى لابتوب من Apple مع معالج M3 Max وذاكرة 32GB ومساحة تخزين 1TB SSD",
      price: 15999,
      originalPrice: 17999,
      category: "laptops",
      brand: "Apple",
      images: [
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800",
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800"
      ],
      specifications: {
        processor: "Apple M3 Max",
        ram: "32GB",
        storage: "1TB SSD",
        graphics: "M3 Max GPU"
      },
      rating: 4.9,
      reviews: 128,
      stock: 15,
      isNew: true,
      isBestSeller: true,
      tags: ["premium", "professional", "creative"]
    },
    {
      id: 2,
      title: "Dell XPS 15 OLED",
      description: "لابتوب عالي الأداء مع شاشة OLED 4K ومعالج Intel i7 الجيل الثالث عشر",
      price: 12999,
      originalPrice: 14999,
      category: "laptops",
      brand: "Dell",
      images: [
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800",
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800"
      ],
      specifications: {
        processor: "Intel Core i7-13700H",
        ram: "16GB",
        storage: "512GB SSD",
        graphics: "NVIDIA RTX 4050"
      },
      rating: 4.7,
      reviews: 89,
      stock: 23,
      isNew: false,
      isBestSeller: true,
      tags: ["oled", "4k", "portable"]
    },
    {
      id: 3,
      title: "ASUS ROG Strix G16",
      description: "لابتوب للألعاب مع معالج Intel i9 وكرت شاشة RTX 4070",
      price: 11999,
      originalPrice: 13999,
      category: "laptops",
      brand: "ASUS",
      images: [
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800",
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800"
      ],
      specifications: {
        processor: "Intel Core i9-13980HX",
        ram: "32GB",
        storage: "1TB SSD",
        graphics: "NVIDIA RTX 4070"
      },
      rating: 4.8,
      reviews: 156,
      stock: 8,
      isNew: true,
      isBestSeller: false,
      tags: ["gaming", "high-performance", "rgb"]
    },
    {
      id: 4,
      title: "Logitech MX Master 3S",
      description: "ماوس لاسلكي احترافي مع تقنية MagSpeed وزر صامت",
      price: 299,
      originalPrice: 399,
      category: "accessories",
      brand: "Logitech",
      images: [
        "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800",
        "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800",
        "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800",
        "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800"
      ],
      specifications: {
        connectivity: "Bluetooth & USB-C",
        battery: "Up to 70 days",
        dpi: "8000 DPI",
        buttons: "7 programmable buttons"
      },
      rating: 4.8,
      reviews: 234,
      stock: 45,
      isNew: false,
      isBestSeller: true,
      tags: ["wireless", "professional", "ergonomic"]
    },
    {
      id: 5,
      title: "Samsung 49-inch Ultrawide Monitor",
      description: "شاشة عريضة احترافية بدقة 5120x1440 مع تقنية HDR10",
      price: 3999,
      originalPrice: 4999,
      category: "accessories",
      brand: "Samsung",
      images: [
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800",
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800",
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800",
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800"
      ],
      specifications: {
        size: "49-inch",
        resolution: "5120x1440",
        refreshRate: "120Hz",
        panel: "VA"
      },
      rating: 4.9,
      reviews: 78,
      stock: 12,
      isNew: false,
      isBestSeller: true,
      tags: ["ultrawide", "professional", "hdr"]
    }
  ];

  const brands = [...new Set(demoProducts.map(p => p.brand))];

  // Filter products
  const filteredProducts = demoProducts.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filters.category === 'all' || product.category === filters.category;
    const matchesBrand = filters.brand === 'all' || product.brand === filters.brand;

    let matchesPrice = true;
    if (filters.priceRange !== 'all') {
      switch (filters.priceRange) {
        case 'under-1000':
          matchesPrice = product.price < 1000;
          break;
        case '1000-5000':
          matchesPrice = product.price >= 1000 && product.price <= 5000;
          break;
        case '5000-10000':
          matchesPrice = product.price > 5000 && product.price <= 10000;
          break;
        case 'over-10000':
          matchesPrice = product.price > 10000;
          break;
      }
    }

    return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return b.isNew - a.isNew;
      case 'best-seller':
        return b.isBestSeller - a.isBestSeller;
      default:
        return 0;
    }
  });

  const getDiscountPercentage = (original, current) => {
    return original ? Math.round(((original - current) / original) * 100) : 0;
  };

  const getStockColor = (stock) => {
    if (stock > 10) return 'bg-emerald-500';
    if (stock > 0) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStockStatus = (stock) => {
    if (stock > 10) return 'متوفر';
    if (stock > 0) return 'محدود';
    return 'نفد';
  };

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const handleDelete = (id) => {
    setSelectedProductId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    // في التطبيق الحقيقي، هنا ستكون API call
    toast.success(`تم حذف المنتج رقم ${selectedProductId} بنجاح`, {
      position: "top-right",
      autoClose: 3000,
    });
    setDeleteModalOpen(false);
    setSelectedProductId(null);
  };


  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-nsr-dark' : 'bg-gray-50'}`} dir="rtl">
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
                هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.
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
                  إدارة المنتجات
                </h1>
                <p className={`mt-2 text-lg transition-colors duration-300 ${isDark ? 'text-nsr-neutral' : 'text-gray-800'}`}>إدارة شاملة لجميع منتجاتك</p>
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

              {/* Add Product Button */}
              <Link to="/products/add">
                <_motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl px-8 py-4 bg-gradient-to-r from-nsr-accent to-nsr-primary text-white shadow-lg shadow-nsr-accent/25 transition-all duration-500 hover:shadow-xl hover:shadow-nsr-accent/40"
                >
                  <Plus className="h-6 w-6 transition-all duration-500 group-hover:rotate-180" />
                  <span className="font-semibold text-lg">إضافة منتج جديد</span>
                </_motion.button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { title: "إجمالي المنتجات", value: demoProducts.length, icon: ShoppingCart, color: "from-nsr-accent to-nsr-primary", change: "+12%" },
            { title: "الأكثر مبيعاً", value: demoProducts.filter(p => p.isBestSeller).length, icon: TrendingUp, color: "from-emerald-600 to-emerald-800", change: "+23%" },
            { title: "المنتجات الجديدة", value: demoProducts.filter(p => p.isNew).length, icon: Zap, color: "from-purple-600 to-purple-800", change: "+8%" },
            { title: "المنتجات المميزة", value: demoProducts.filter(p => p.rating >= 4.8).length, icon: Award, color: "from-yellow-600 to-yellow-800", change: "+15%" }
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
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
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
                  placeholder="البحث في المنتجات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pr-12 pl-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${isDark ? 'bg-nsr-secondary/50 border-nsr-primary/30 text-nsr-primary placeholder-nsr-neutral focus:border-nsr-accent focus:ring-nsr-accent/20' : 'bg-white border-gray-300 text-black placeholder-gray-500 focus:border-nsr-accent focus:ring-nsr-accent/20 shadow-sm'}`}
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              {/* Category */}
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className={`px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${isDark ? 'bg-nsr-secondary/50 border-nsr-primary/30 text-nsr-primary focus:border-nsr-accent focus:ring-nsr-accent/20' : 'bg-white border-gray-300 text-black focus:border-nsr-accent focus:ring-nsr-accent/20 shadow-sm'}`}
              >
                <option value="all">جميع الفئات</option>
                <option value="laptops">لابتوبات</option>
                <option value="accessories">إكسسوارات</option>
              </select>

              {/* Brand */}
              <select
                value={filters.brand}
                onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                className={`px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${isDark ? 'bg-nsr-secondary/50 border-nsr-primary/30 text-nsr-primary focus:border-nsr-accent focus:ring-nsr-accent/20' : 'bg-white border-gray-300 text-black focus:border-nsr-accent focus:ring-nsr-accent/20 shadow-sm'}`}
              >
                <option value="all">جميع الماركات</option>
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>

              {/* Price Range */}
              <select
                value={filters.priceRange}
                onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                className={`px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${isDark ? 'bg-nsr-secondary/50 border-nsr-primary/30 text-nsr-primary focus:border-nsr-accent focus:ring-nsr-accent/20' : 'bg-white border-gray-300 text-black focus:border-nsr-accent focus:ring-nsr-accent/20 shadow-sm'}`}
              >
                <option value="all">جميع الأسعار</option>
                <option value="under-1000">أقل من {getCurrencySymbol()}1,000</option>
                <option value="1000-5000">{getCurrencySymbol()}1,000 - {getCurrencySymbol()}5,000</option>
                <option value="5000-10000">{getCurrencySymbol()}5,000 - {getCurrencySymbol()}10,000</option>
                <option value="over-10000">أكثر من {getCurrencySymbol()}10,000</option>
              </select>

              {/* Sort */}
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className={`px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${isDark ? 'bg-nsr-secondary/50 border-nsr-primary/30 text-nsr-primary focus:border-nsr-accent focus:ring-nsr-accent/20' : 'bg-white border-gray-300 text-black focus:border-nsr-accent focus:ring-nsr-accent/20 shadow-sm'}`}
              >
                <option value="newest">الأحدث</option>
                <option value="best-seller">الأكثر مبيعاً</option>
                <option value="price-low">السعر: من الأقل للأعلى</option>
                <option value="price-high">السعر: من الأعلى للأقل</option>
                <option value="rating">التقييم</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 flex items-center justify-between">
            <p className={`transition-colors duration-300 ${isDark ? 'text-nsr-neutral' : 'text-black'}`}>
              عرض {sortedProducts.length} من {demoProducts.length} منتج
            </p>
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-nsr-accent" />
              <span className={`text-sm transition-colors duration-300 ${isDark ? 'text-nsr-neutral' : 'text-gray-700'}`}>فلاتر نشطة</span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="px-8 pb-8">
        {sortedProducts.length === 0 ? (
          <div className="text-center py-20 bg-gradient-to-r from-slate-800/80 to-slate-900/80 rounded-2xl border border-white/10">
            <Search size={48} className="text-blue-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">لم يتم العثور على منتجات</h3>
            <p className="text-slate-400 mb-6">جرب تغيير الفلاتر أو البحث بكلمات مختلفة</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilters({ category: 'all', brand: 'all', priceRange: 'all', sortBy: 'newest' });
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
                    <th className="px-6 py-4 text-right text-blue-400 font-semibold">الصورة</th>
                    <th className="px-6 py-4 text-right text-blue-400 font-semibold">معلومات المنتج</th>
                    <th className="px-6 py-4 text-right text-blue-400 font-semibold">المواصفات</th>
                    <th className="px-6 py-4 text-right text-blue-400 font-semibold">السعر</th>
                    <th className="px-6 py-4 text-right text-blue-400 font-semibold">المخزون</th>
                    <th className="px-6 py-4 text-right text-blue-400 font-semibold">الحالة</th>
                    <th className="px-6 py-4 text-right text-blue-400 font-semibold">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {sortedProducts.map((product) => {
                    const discountPercentage = getDiscountPercentage(product.originalPrice, product.price);

                    return (
                      <tr key={product.id} className="hover:bg-white/5 transition-colors duration-300">
                        {/* الصورة */}
                        <td className="px-6 py-4">
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden group">
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            {product.isNew && (
                              <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                                جديد
                              </span>
                            )}
                          </div>
                        </td>

                        {/* معلومات المنتج */}
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-blue-400 font-medium bg-blue-500/10 px-2 py-1 rounded-lg">
                                {product.brand}
                              </span>
                              <div className="flex items-center gap-1">
                                <Star size={12} className="text-yellow-400 fill-current" />
                                <span className="text-xs text-slate-300">{product.rating}</span>
                                <span className="text-xs text-slate-500">({product.reviews})</span>
                              </div>
                            </div>
                            <h3 className="font-semibold text-white text-sm max-w-xs">
                              {product.title}
                            </h3>
                            <div className="flex flex-wrap gap-1">
                              {product.tags.slice(0, 2).map((tag, tagIndex) => (
                                <span key={tagIndex} className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded-lg text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </td>

                        {/* المواصفات */}
                        <td className="px-6 py-4">
                          <div className="space-y-1 text-xs">
                            {product.specifications.processor && (
                              <div className="text-slate-300">
                                <span className="font-medium text-blue-400">المعالج:</span> {product.specifications.processor}
                              </div>
                            )}
                            {product.specifications.ram && (
                              <div className="text-slate-300">
                                <span className="font-medium text-blue-400">الذاكرة:</span> {product.specifications.ram}
                              </div>
                            )}
                            {product.specifications.storage && (
                              <div className="text-slate-300">
                                <span className="font-medium text-blue-400">التخزين:</span> {product.specifications.storage}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* السعر */}
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="text-lg font-bold text-blue-400">
                              {getCurrencySymbol()}{convertCurrency(product.price).toLocaleString()}
                            </div>
                            {product.originalPrice && (
                              <div className="text-sm text-slate-500 line-through">
                                {getCurrencySymbol()}{convertCurrency(product.originalPrice).toLocaleString()}
                              </div>
                            )}
                            {discountPercentage > 0 && (
                              <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                                -{discountPercentage}%
                              </span>
                            )}
                          </div>
                        </td>

                        {/* المخزون */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${getStockColor(product.stock)}`}></div>
                            <span className="text-sm text-white font-medium">
                              {product.stock}
                            </span>
                          </div>
                        </td>

                        {/* الحالة */}
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            {product.isBestSeller && (
                              <span className="bg-orange-500/20 text-orange-300 px-2 py-1 rounded-lg text-xs text-center border border-orange-500/30">
                                الأكثر مبيعاً
                              </span>
                            )}
                            <span className={`px-2 py-1 rounded-lg text-xs text-center border ${product.stock > 10
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : product.stock > 0
                                ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                                : 'bg-red-500/20 text-red-300 border-red-500/30'
                              }`}>
                              {getStockStatus(product.stock)}
                            </span>
                          </div>
                        </td>

                        {/* الإجراءات */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Link to={`/products/${product.id}`}>
                              <_motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="group p-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-xl hover:bg-blue-500/30 transition-all duration-300"
                              >
                                <Eye size={16} className="group-hover:scale-110 transition-transform" />
                              </_motion.button>
                            </Link>

                            <Link to={`/products/edit/${product.id}`}>
                              <_motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="group p-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-xl hover:bg-emerald-500/30 transition-all duration-300"
                              >
                                <Edit size={16} className="group-hover:scale-110 transition-transform" />
                              </_motion.button>
                            </Link>

                            <_motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDelete(product.id)}
                              className="group p-2 bg-red-500/20 border border-red-500/30 text-red-300 rounded-xl hover:bg-red-500/30 transition-all duration-300"
                            >
                              <Trash size={16} className="group-hover:scale-110 transition-transform" />
                            </_motion.button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>


    </div>
  );
}
