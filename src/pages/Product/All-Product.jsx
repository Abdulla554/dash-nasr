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
import { useProducts, useDeleteProduct } from "../../hooks/useProductsQuery";
import { useBrands } from "../../hooks/useBrandsQuery";

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

  // React Query hooks
  const { data: productsData, isLoading, error, refetch } = useProducts({
    search: searchTerm,
    category: filters.category !== 'all' ? filters.category : undefined,
    brand: filters.brand !== 'all' ? filters.brand : undefined,
    sort: filters.sortBy,
    page: 1,
    limit: 20
  });

  const deleteProductMutation = useDeleteProduct();
  const { data: brandsData } = useBrands();

  const products = productsData?.data || [];
  const pagination = productsData?.pagination || {};
  const brands = brandsData || [];

  // Use products from API
  const displayProducts = products;

  // Filter products
  const filteredProducts = displayProducts.filter(product => {
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

  const handleConfirmDelete = async () => {
    try {
      await deleteProductMutation.mutateAsync(selectedProductId);
      toast.success(`تم حذف المنتج رقم ${selectedProductId} بنجاح`, {
        position: "top-right",
        autoClose: 3000,
      });
      setDeleteModalOpen(false);
      setSelectedProductId(null);
    } catch (error) {
      toast.error('فشل في حذف المنتج');
      console.error('Delete error:', error);
    }
  };


  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gradient-nsr-dark' : 'bg-gradient-nsr-light'}`} dir="rtl">
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
      <div className={`relative backdrop-blur-sm border-b transition-colors duration-300 ${isDark ? 'bg-nsr-secondary/50 border-nsr-primary/20' : 'bg-nsr-light/80 border-nsr-primary/20 shadow-sm'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-nsr-accent/10 to-transparent"></div>
        <div className="relative px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-0">
            <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
              <div className="p-3 sm:p-4 bg-gradient-nsr-elegant rounded-xl sm:rounded-2xl">
                <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold transition-colors duration-300 ${isDark ? 'text-nsr-light' : 'text-nsr-dark'}`}>
                  إدارة المنتجات
                </h1>
                <p className={`mt-1 sm:mt-2 text-sm sm:text-base lg:text-lg transition-colors duration-300 ${isDark ? 'text-nsr-light-200' : 'text-nsr-dark-600'}`}>إدارة شاملة لجميع منتجاتك</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 w-full lg:w-auto">
              {/* Theme Toggle */}
              <_motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className={`group p-2 sm:p-3 backdrop-blur-sm border rounded-xl sm:rounded-2xl transition-all duration-300 ${isDark ? 'bg-nsr-primary/10 border-nsr-primary/20 hover:border-nsr-accent/30' : 'bg-nsr-light-100 border-nsr-primary/20 hover:border-nsr-accent/30 shadow-sm'}`}
              >
                {isDark ? (
                  <Sun className={`h-5 w-5 sm:h-6 sm:w-6 transition-colors ${isDark ? 'text-nsr-accent group-hover:text-nsr-light' : 'text-nsr-dark group-hover:text-nsr-dark-800'}`} />
                ) : (
                  <Moon className={`h-5 w-5 sm:h-6 sm:w-6 transition-colors ${isDark ? 'text-nsr-accent group-hover:text-nsr-light' : 'text-nsr-dark group-hover:text-nsr-dark-800'}`} />
                )}
              </_motion.button>

              {/* Currency Toggle */}
              <_motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleCurrency}
                className={`group p-2 sm:p-3 backdrop-blur-sm border rounded-xl sm:rounded-2xl transition-all duration-300 flex items-center gap-1 sm:gap-2 ${isDark ? 'bg-nsr-primary/10 border-nsr-primary/20 hover:border-nsr-accent/30' : 'bg-nsr-light-100 border-nsr-primary/20 hover:border-nsr-accent/30 shadow-sm'}`}
              >
                <DollarSign className={`h-5 w-5 sm:h-6 sm:w-6 transition-colors ${isDark ? 'text-nsr-accent group-hover:text-nsr-light' : 'text-nsr-dark group-hover:text-nsr-dark-800'}`} />
                <span className={`font-semibold text-sm sm:text-base transition-colors ${isDark ? 'text-nsr-accent group-hover:text-nsr-light' : 'text-nsr-dark group-hover:text-nsr-dark-800'}`}>{getCurrencyCode()}</span>
              </_motion.button>

              {/* Add Product Button */}
              <Link to="/products/add" className="flex-1 lg:flex-none">
                <_motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative inline-flex items-center gap-2 sm:gap-3 overflow-hidden rounded-xl sm:rounded-2xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-gradient-nsr-elegant text-white shadow-lg shadow-nsr-accent/25 transition-all duration-500 hover:shadow-xl hover:shadow-nsr-accent/40 w-full lg:w-auto"
                >
                  <Plus className="h-5 w-5 sm:h-6 sm:w-6 transition-all duration-500 group-hover:rotate-180" />
                  <span className="font-semibold text-sm sm:text-base lg:text-lg">إضافة منتج جديد</span>
                </_motion.button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {[
            { title: "إجمالي المنتجات", value: displayProducts.length, icon: ShoppingCart, color: "from-nsr-accent to-nsr-primary", change: "+12%" },
            { title: "الأكثر مبيعاً", value: displayProducts.filter(p => p.isBestSeller).length, icon: TrendingUp, color: "from-emerald-600 to-emerald-800", change: "+23%" },
            { title: "المنتجات الجديدة", value: displayProducts.filter(p => p.isNew).length, icon: Zap, color: "from-purple-600 to-purple-800", change: "+8%" },
            { title: "المنتجات المميزة", value: displayProducts.filter(p => p.rating >= 4.8).length, icon: Award, color: "from-yellow-600 to-yellow-800", change: "+15%" }
          ].map((stat, index) => (
            <div key={index} className="group relative">
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl opacity-80 group-hover:opacity-90 transition-all duration-300`}></div>
              <div className={`relative backdrop-blur-sm border rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all duration-300 group-hover:transform group-hover:scale-105 ${isDark ? 'bg-nsr-secondary/30 border-nsr-primary/20 hover:border-nsr-accent/30' : 'bg-nsr-light/70 border-nsr-primary/20 hover:border-nsr-accent/30 shadow-sm'}`}>
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className={`p-2 sm:p-3 backdrop-blur-sm rounded-lg sm:rounded-xl border ${isDark ? 'bg-nsr-primary/10 border-nsr-primary/20' : 'bg-nsr-light-100/20 border-nsr-primary/20'}`}>
                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <span className="text-emerald-400 font-semibold text-xs sm:text-sm">{stat.change}</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-white/80 text-xs sm:text-sm">{stat.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6">
        <div className={`backdrop-blur-sm border rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-colors duration-300 ${isDark ? 'bg-nsr-secondary/30 border-nsr-primary/20' : 'bg-nsr-light/70 border-nsr-primary/20 shadow-sm'}`}>
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${isDark ? 'text-nsr-light-200' : 'text-nsr-dark-600'}`} size={20} />
                <input
                  type="text"
                  placeholder="البحث في المنتجات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pr-12 pl-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${isDark ? 'bg-nsr-secondary/50 border-nsr-primary/30 text-nsr-light placeholder-nsr-light-200 focus:border-nsr-accent focus:ring-nsr-accent/20' : 'bg-nsr-light border-nsr-primary/30 text-nsr-dark placeholder-nsr-dark-600 focus:border-nsr-accent focus:ring-nsr-accent/20 shadow-sm'}`}
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4">
              {/* Category */}
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className={`px-3 sm:px-4 py-2 sm:py-3 border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-sm sm:text-base ${isDark ? 'bg-nsr-secondary/50 border-nsr-primary/30 text-nsr-light focus:border-nsr-accent focus:ring-nsr-accent/20' : 'bg-nsr-light border-nsr-primary/30 text-nsr-dark focus:border-nsr-accent focus:ring-nsr-accent/20 shadow-sm'}`}
              >
                <option value="all">جميع الفئات</option>
                <option value="laptops">لابتوبات</option>
                <option value="accessories">إكسسوارات</option>
              </select>

              {/* Brand */}
              <select
                value={filters.brand}
                onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                className={`px-3 sm:px-4 py-2 sm:py-3 border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-sm sm:text-base ${isDark ? 'bg-nsr-secondary/50 border-nsr-primary/30 text-nsr-light focus:border-nsr-accent focus:ring-nsr-accent/20' : 'bg-nsr-light border-nsr-primary/30 text-nsr-dark focus:border-nsr-accent focus:ring-nsr-accent/20 shadow-sm'}`}
              >
                <option value="all">جميع الماركات</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.name}>{brand.name}</option>
                ))}
              </select>

              {/* Price Range */}
              <select
                value={filters.priceRange}
                onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                className={`px-3 sm:px-4 py-2 sm:py-3 border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-sm sm:text-base ${isDark ? 'bg-nsr-secondary/50 border-nsr-primary/30 text-nsr-light focus:border-nsr-accent focus:ring-nsr-accent/20' : 'bg-nsr-light border-nsr-primary/30 text-nsr-dark focus:border-nsr-accent focus:ring-nsr-accent/20 shadow-sm'}`}
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
                className={`px-3 sm:px-4 py-2 sm:py-3 border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-sm sm:text-base ${isDark ? 'bg-nsr-secondary/50 border-nsr-primary/30 text-nsr-light focus:border-nsr-accent focus:ring-nsr-accent/20' : 'bg-nsr-light border-nsr-primary/30 text-nsr-dark focus:border-nsr-accent focus:ring-nsr-accent/20 shadow-sm'}`}
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
          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
            <p className={`text-sm sm:text-base transition-colors duration-300 ${isDark ? 'text-nsr-light-200' : 'text-nsr-dark-600'}`}>
              عرض {sortedProducts.length} من {displayProducts.length} منتج
            </p>
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-nsr-accent sm:w-4 sm:h-4" />
              <span className={`text-xs sm:text-sm transition-colors duration-300 ${isDark ? 'text-nsr-light-200' : 'text-nsr-dark-600'}`}>فلاتر نشطة</span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
        {sortedProducts.length === 0 ? (
          <div className={`text-center py-12 sm:py-16 lg:py-20 rounded-xl sm:rounded-2xl border transition-colors duration-300 ${isDark ? 'bg-gradient-nsr-secondary border-nsr-primary/20' : 'bg-nsr-light/80 border-nsr-primary/20'}`}>
            <Search size={32} className="text-nsr-accent mx-auto mb-3 sm:mb-4 sm:w-12 sm:h-12 lg:w-12 lg:h-12" />
            <h3 className={`text-lg sm:text-xl lg:text-2xl font-bold mb-2 transition-colors duration-300 ${isDark ? 'text-nsr-light' : 'text-nsr-dark'}`}>لم يتم العثور على منتجات</h3>
            <p className={`mb-4 sm:mb-6 text-sm sm:text-base transition-colors duration-300 ${isDark ? 'text-nsr-light-200' : 'text-nsr-dark-600'}`}>جرب تغيير الفلاتر أو البحث بكلمات مختلفة</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilters({ category: 'all', brand: 'all', priceRange: 'all', sortBy: 'newest' });
              }}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-nsr-accent hover:bg-nsr-accent/90 text-white rounded-lg sm:rounded-xl font-semibold transition-colors duration-300 text-sm sm:text-base"
            >
              إعادة تعيين الفلاتر
            </button>
          </div>
        ) : (
          <div className={`backdrop-blur-sm border rounded-xl sm:rounded-2xl overflow-hidden transition-colors duration-300 ${isDark ? 'bg-nsr-secondary/30 border-nsr-primary/20' : 'bg-nsr-light/80 border-nsr-primary/20'}`}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className={`transition-colors duration-300 ${isDark ? 'bg-gradient-nsr-secondary' : 'bg-nsr-light-100'}`}>
                  <tr>
                    <th className={`px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-right font-semibold text-xs sm:text-sm transition-colors duration-300 ${isDark ? 'text-nsr-accent' : 'text-nsr-accent'}`}>الصورة</th>
                    <th className={`px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-right font-semibold text-xs sm:text-sm transition-colors duration-300 ${isDark ? 'text-nsr-accent' : 'text-nsr-accent'}`}>معلومات المنتج</th>
                    <th className={`px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-right font-semibold text-xs sm:text-sm transition-colors duration-300 ${isDark ? 'text-nsr-accent' : 'text-nsr-accent'}`}>المواصفات</th>
                    <th className={`px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-right font-semibold text-xs sm:text-sm transition-colors duration-300 ${isDark ? 'text-nsr-accent' : 'text-nsr-accent'}`}>السعر</th>
                    <th className={`px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-right font-semibold text-xs sm:text-sm transition-colors duration-300 ${isDark ? 'text-nsr-accent' : 'text-nsr-accent'}`}>المخزون</th>
                    <th className={`px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-right font-semibold text-xs sm:text-sm transition-colors duration-300 ${isDark ? 'text-nsr-accent' : 'text-nsr-accent'}`}>الحالة</th>
                    <th className={`px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-right font-semibold text-xs sm:text-sm transition-colors duration-300 ${isDark ? 'text-nsr-accent' : 'text-nsr-accent'}`}>الإجراءات</th>
                  </tr>
                </thead>
                <tbody className={`divide-y transition-colors duration-300 ${isDark ? 'divide-nsr-primary/20' : 'divide-nsr-primary/20'}`}>
                  {sortedProducts.map((product) => {
                    const discountPercentage = getDiscountPercentage(product.originalPrice, product.price);

                    return (
                      <tr key={product.id} className={`transition-colors duration-300 ${isDark ? 'hover:bg-nsr-primary/5' : 'hover:bg-nsr-light-100/50'}`}>
                        {/* الصورة */}
                        <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                          <div className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-lg sm:rounded-xl overflow-hidden group">
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            {product.isNew && (
                              <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded-full font-semibold">
                                جديد
                              </span>
                            )}
                          </div>
                        </td>

                        {/* معلومات المنتج */}
                        <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                          <div className="space-y-1 sm:space-y-2">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
                              <span className={`text-xs sm:text-sm font-medium px-1 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg transition-colors duration-300 ${isDark ? 'text-nsr-accent bg-nsr-accent/10' : 'text-nsr-accent bg-nsr-accent/10'}`}>
                                {product.brand}
                              </span>
                              <div className="flex items-center gap-1">
                                <Star size={10} className="text-yellow-400 fill-current sm:w-3 sm:h-3" />
                                <span className={`text-xs transition-colors duration-300 ${isDark ? 'text-nsr-light-200' : 'text-nsr-dark-600'}`}>{product.rating}</span>
                                <span className={`text-xs transition-colors duration-300 ${isDark ? 'text-nsr-light-200' : 'text-nsr-dark-600'}`}>({product.reviews})</span>
                              </div>
                            </div>
                            <h3 className={`font-semibold text-xs sm:text-sm max-w-xs transition-colors duration-300 ${isDark ? 'text-nsr-light' : 'text-nsr-dark'}`}>
                              {product.title}
                            </h3>
                            <div className="flex flex-wrap gap-1">
                              {product.tags.slice(0, 2).map((tag, tagIndex) => (
                                <span key={tagIndex} className={`px-1 sm:px-2 py-0.5 rounded-md sm:rounded-lg text-xs transition-colors duration-300 ${isDark ? 'bg-nsr-primary/20 text-nsr-light-200' : 'bg-nsr-light-200 text-nsr-dark-600'}`}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </td>

                        {/* المواصفات */}
                        <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                          <div className="space-y-1 text-xs">
                            {product.specifications.processor && (
                              <div className={`transition-colors duration-300 ${isDark ? 'text-nsr-light-200' : 'text-nsr-dark-600'}`}>
                                <span className="font-medium text-nsr-accent">المعالج:</span> {product.specifications.processor}
                              </div>
                            )}
                            {product.specifications.ram && (
                              <div className={`transition-colors duration-300 ${isDark ? 'text-nsr-light-200' : 'text-nsr-dark-600'}`}>
                                <span className="font-medium text-nsr-accent">الذاكرة:</span> {product.specifications.ram}
                              </div>
                            )}
                            {product.specifications.storage && (
                              <div className={`transition-colors duration-300 ${isDark ? 'text-nsr-light-200' : 'text-nsr-dark-600'}`}>
                                <span className="font-medium text-nsr-accent">التخزين:</span> {product.specifications.storage}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* السعر */}
                        <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                          <div className="space-y-1">
                            <div className="text-sm sm:text-base lg:text-lg font-bold text-nsr-accent">
                              {getCurrencySymbol()}{convertCurrency(product.price).toLocaleString()}
                            </div>
                            {product.originalPrice && (
                              <div className={`text-xs sm:text-sm line-through transition-colors duration-300 ${isDark ? 'text-nsr-light-200' : 'text-nsr-dark-600'}`}>
                                {getCurrencySymbol()}{convertCurrency(product.originalPrice).toLocaleString()}
                              </div>
                            )}
                            {discountPercentage > 0 && (
                              <span className="bg-red-500 text-white px-1 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-xs font-semibold">
                                -{discountPercentage}%
                              </span>
                            )}
                          </div>
                        </td>

                        {/* المخزون */}
                        <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${getStockColor(product.stock)}`}></div>
                            <span className={`text-xs sm:text-sm font-medium transition-colors duration-300 ${isDark ? 'text-nsr-light' : 'text-nsr-dark'}`}>
                              {product.stock}
                            </span>
                          </div>
                        </td>

                        {/* الحالة */}
                        <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                          <div className="flex flex-col gap-1">
                            {product.isBestSeller && (
                              <span className="bg-orange-500/20 text-orange-300 px-1 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-xs text-center border border-orange-500/30">
                                الأكثر مبيعاً
                              </span>
                            )}
                            <span className={`px-1 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-xs text-center border ${product.stock > 10
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
                        <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Link to={`/products/${product.id}`}>
                              <_motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="group p-1.5 sm:p-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg sm:rounded-xl hover:bg-blue-500/30 transition-all duration-300"
                              >
                                <Eye size={14} className="group-hover:scale-110 transition-transform sm:w-4 sm:h-4" />
                              </_motion.button>
                            </Link>

                            <Link to={`/products/edit/${product.id}`}>
                              <_motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="group p-1.5 sm:p-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-lg sm:rounded-xl hover:bg-emerald-500/30 transition-all duration-300"
                              >
                                <Edit size={14} className="group-hover:scale-110 transition-transform sm:w-4 sm:h-4" />
                              </_motion.button>
                            </Link>

                            <_motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDelete(product.id)}
                              className="group p-1.5 sm:p-2 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg sm:rounded-xl hover:bg-red-500/30 transition-all duration-300"
                            >
                              <Trash size={14} className="group-hover:scale-110 transition-transform sm:w-4 sm:h-4" />
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
