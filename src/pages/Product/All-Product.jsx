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

// إزالة useTheme - استخدام ألوان ثابتة
import { useCurrency } from "../../contexts/CurrencyContext.jsx";
import { useProducts, useDeleteProduct } from "../../hooks/useProductsQuery";
import { useBrands } from "../../hooks/useBrandsQuery";
import { useCategories } from "../../hooks/useCategoriesQuery";

// Helper function to get full image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return '/logo.png';

  // If it's already a full URL (starts with http), return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // If it's a data URL (base64), return as is
  if (imagePath.startsWith('data:')) {
    return imagePath;
  }

  // If it's a relative path, prepend the API base URL
  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  return `${baseURL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

export default function LuxuryProductsPage() {
  // إزالة نظام الثيم - استخدام ألوان ثابتة فقط
  const { convertCurrency, getCurrencySymbol, getCurrencyCode, toggleCurrency } = useCurrency();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    brand: 'all',
    priceRange: 'all',
    sortBy: 'newest'
  });

  // React Query hooks
  const { data: productsData } = useProducts({
    search: searchTerm,
    category: filters.category !== 'all' ? filters.category : undefined,
    brand: filters.brand !== 'all' ? filters.brand : undefined,
    sort: filters.sortBy,
    page: 1,
    limit: 20
  });

  const deleteProductMutation = useDeleteProduct();
  const { data: brandsData } = useBrands();
  const { data: categoriesData } = useCategories();

  const products = productsData?.data || [];
  const brands = brandsData || [];
  const categories = categoriesData || [];

  console.log("Products data:", productsData);
  console.log("Products array:", products);
  console.log("Products length:", products.length);
  console.log("Brands:", brands);
  console.log("Categories:", categories);

  // Debug image URLs
  if (products.length > 0) {
    console.log("First product image URLs:", {
      image: products[0].image,
      images: products[0].images,
      fullImageUrl: getImageUrl(products[0].image),
      fullImagesUrl: products[0].images?.[0] ? getImageUrl(products[0].images[0]) : 'No images array'
    });
  }

  // Use products from API
  const displayProducts = products;

  // Filter products first
  const filteredProducts = displayProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filters.category === 'all' || product.categoryId === filters.category;
    const matchesBrand = filters.brand === 'all' || product.brandId === filters.brand;

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
    // First sort by sortOrder if available
    const aOrder = a.sortOrder || 999;
    const bOrder = b.sortOrder || 999;
    if (aOrder !== bOrder) {
      return aOrder - bOrder;
    }

    // Then sort by the selected criteria
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
        return (a.name || '').localeCompare(b.name || '');
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
    <div className="min-h-screen bg-[#1a1a2e]" dir="rtl">
      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="rounded-2xl p-8 max-w-md w-full mx-4 bg-[#F9F3EF]/10 border border-[#749BC2]/20">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#F9F3EF]">
                تأكيد الحذف
              </h3>
              <p className="mb-6 text-[#F9F3EF]/70">
                هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="flex-1 py-3 px-4 rounded-xl font-semibold bg-[#749BC2]/20 text-[#749BC2] hover:bg-[#749BC2]/30 transition-colors duration-300"
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
      <div className="relative backdrop-blur-sm border-b bg-[#F9F3EF]/5 border-[#749BC2]/20">
        <div className="absolute inset-0 bg-gradient-to-r from-[#2C6D90]/10 to-transparent"></div>
        <div className="relative px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-0">
            <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
              <div className="p-3 sm:p-4 bg-gradient-to-r from-[#2C6D90] to-[#749BC2] rounded-xl sm:rounded-2xl">
                <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F9F3EF]">
                  إدارة المنتجات
                </h1>
                <p className="mt-1 sm:mt-2 text-sm sm:text-base lg:text-lg text-[#F9F3EF]/70">إدارة شاملة لجميع منتجاتك</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 w-full lg:w-auto">
              {/* Currency Toggle */}
              <_motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleCurrency}
                className="group p-2 sm:p-3 backdrop-blur-sm border rounded-xl sm:rounded-2xl transition-all duration-300 flex items-center gap-1 sm:gap-2 bg-[#749BC2]/20 border-[#749BC2]/30 hover:border-[#2C6D90]/50 text-[#F9F3EF]"
              >
                <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 transition-colors text-[#2C6D90] group-hover:text-[#F9F3EF]" />
                <span className="font-semibold text-sm sm:text-base transition-colors text-[#2C6D90] group-hover:text-[#F9F3EF]">{getCurrencyCode()}</span>
              </_motion.button>

              {/* Add Product Button */}
              <Link to="/products/add" className="flex-1 lg:flex-none">
                <_motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative inline-flex items-center gap-2 sm:gap-3 overflow-hidden rounded-xl sm:rounded-2xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#2C6D90] to-[#749BC2] text-white shadow-lg shadow-[#2C6D90]/25 transition-all duration-500 hover:shadow-xl hover:shadow-[#2C6D90]/40 w-full lg:w-auto"
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
            { title: "إجمالي المنتجات", value: displayProducts.length, icon: ShoppingCart, color: "from-[#2C6D90] to-[#749BC2]", change: "+12%" },
            { title: "الأكثر مبيعاً", value: displayProducts.filter(p => p.isBestSeller).length, icon: TrendingUp, color: "from-emerald-600 to-emerald-800", change: "+23%" },
            { title: "المنتجات الجديدة", value: displayProducts.filter(p => p.isNew).length, icon: Zap, color: "from-purple-600 to-purple-800", change: "+8%" },
            { title: "المنتجات المميزة", value: displayProducts.filter(p => p.rating >= 4.8).length, icon: Award, color: "from-yellow-600 to-yellow-800", change: "+15%" }
          ].map((stat, index) => (
            <div key={index} className="group relative">
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl opacity-80 group-hover:opacity-90 transition-all duration-300`}></div>
              <div className="relative backdrop-blur-sm border rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all duration-300 group-hover:transform group-hover:scale-105 bg-[#F9F3EF]/10 border-[#749BC2]/20 hover:border-[#2C6D90]/50">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="p-2 sm:p-3 backdrop-blur-sm rounded-lg sm:rounded-xl border bg-[#749BC2]/20 border-[#749BC2]/30">
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
        <div className="backdrop-blur-sm border rounded-xl sm:rounded-2xl p-4 sm:p-6 bg-[#F9F3EF]/5 border-[#749BC2]/20">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#F9F3EF]/70" size={20} />
                <input
                  type="text"
                  placeholder="البحث في المنتجات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-12 pl-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 bg-[#F9F3EF]/10 border-[#749BC2]/30 text-[#F9F3EF] placeholder-[#F9F3EF]/50 focus:border-[#2C6D90] focus:ring-[#2C6D90]/20"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4">
              {/* Category */}
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="px-3 sm:px-4 py-2 sm:py-3 border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-sm sm:text-base bg-[#F9F3EF]/10 border-[#749BC2]/30 text-[#F9F3EF] focus:border-[#2C6D90] focus:ring-[#2C6D90]/20"
              >
                <option value="all">جميع الفئات</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>

              {/* Brand */}
              <select
                value={filters.brand}
                onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                className="px-3 sm:px-4 py-2 sm:py-3 border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-sm sm:text-base bg-[#F9F3EF]/10 border-[#749BC2]/30 text-[#F9F3EF] focus:border-[#2C6D90] focus:ring-[#2C6D90]/20"
              >
                <option value="all">جميع الماركات</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </select>

              {/* Price Range */}
              <select
                value={filters.priceRange}
                onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                className="px-3 sm:px-4 py-2 sm:py-3 border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-sm sm:text-base bg-[#F9F3EF]/10 border-[#749BC2]/30 text-[#F9F3EF] focus:border-[#2C6D90] focus:ring-[#2C6D90]/20"
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
                className="px-3 sm:px-4 py-2 sm:py-3 border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-sm sm:text-base bg-[#F9F3EF]/10 border-[#749BC2]/30 text-[#F9F3EF] focus:border-[#2C6D90] focus:ring-[#2C6D90]/20"
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
            <p className="text-sm sm:text-base text-[#F9F3EF]/70">
              عرض {sortedProducts.length} من {displayProducts.length} منتج
            </p>
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-[#2C6D90] sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm text-[#F9F3EF]/70">فلاتر نشطة</span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
        {sortedProducts.length === 0 ? (
          <div className="text-center py-12 sm:py-16 lg:py-20 rounded-xl sm:rounded-2xl border bg-gradient-to-r from-[#1a1a2e] to-[#2C6D90]/20 border-[#749BC2]/20">
            <Search size={32} className="text-[#2C6D90] mx-auto mb-3 sm:mb-4 sm:w-12 sm:h-12 lg:w-12 lg:h-12" />
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 text-[#F9F3EF]">لم يتم العثور على منتجات</h3>
            <p className="mb-4 sm:mb-6 text-sm sm:text-base text-[#F9F3EF]/70">جرب تغيير الفلاتر أو البحث بكلمات مختلفة</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilters({ category: 'all', brand: 'all', priceRange: 'all', sortBy: 'newest' });
              }}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-[#2C6D90] hover:bg-[#2C6D90]/90 text-white rounded-lg sm:rounded-xl font-semibold transition-colors duration-300 text-sm sm:text-base"
            >
              إعادة تعيين الفلاتر
            </button>
          </div>
        ) : (
          <div className="backdrop-blur-sm border rounded-xl sm:rounded-2xl overflow-hidden bg-[#F9F3EF]/5 border-[#749BC2]/20">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-gradient-to-r from-[#1a1a2e] to-[#2C6D90]/20">
                  <tr>
                    <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-right font-semibold text-xs sm:text-sm text-[#2C6D90]">الصورة</th>
                    <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-right font-semibold text-xs sm:text-sm text-[#2C6D90]">معلومات المنتج</th>
                    <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-right font-semibold text-xs sm:text-sm text-[#2C6D90]">المواصفات</th>
                    <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-right font-semibold text-xs sm:text-sm text-[#2C6D90]">السعر</th>
                    <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-right font-semibold text-xs sm:text-sm text-[#2C6D90]">المخزون</th>
                    <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-right font-semibold text-xs sm:text-sm text-[#2C6D90]">الحالة</th>
                    <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-right font-semibold text-xs sm:text-sm text-[#2C6D90]">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#749BC2]/10">
                  {sortedProducts.map((product) => {
                    const discountPercentage = getDiscountPercentage(product.originalPrice, product.price);

                    return (
                      <tr key={product.id} className="hover:bg-[#F9F3EF]/5 transition-colors duration-300">
                        {/* الصورة */}
                        <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                          <div className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-lg sm:rounded-xl overflow-hidden group">
                            <img
                              src={getImageUrl(product.image || product.images?.[0])}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              onError={(e) => {
                                e.target.src = '/logo.png';
                              }}
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
                              <span className="text-xs sm:text-sm font-medium px-1 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[#2C6D90] bg-[#2C6D90]/10">
                                {brands.find(b => b.id === product.brandId)?.name || 'Unknown Brand'}
                              </span>
                              <div className="flex items-center gap-1">
                                <Star size={10} className="text-yellow-400 fill-current sm:w-3 sm:h-3" />
                                <span className="text-xs text-[#F9F3EF]/70">{product.rating}</span>
                                <span className="text-xs text-[#F9F3EF]/70">({product.reviews})</span>
                              </div>
                            </div>
                            <h3 className="font-semibold text-xs sm:text-sm max-w-xs text-[#F9F3EF]">
                              {product.name}
                            </h3>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {product.isNew && (
                                <span className="px-1 sm:px-2 py-0.5 rounded-md sm:rounded-lg text-xs bg-green-500/20 text-green-300 border border-green-500/30">
                                  جديد
                                </span>
                              )}
                              {product.isBestSeller && (
                                <span className="px-1 sm:px-2 py-0.5 rounded-md sm:rounded-lg text-xs bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                                  الأكثر مبيعاً
                                </span>
                              )}
                              {product.isFeatured && (
                                <span className="px-1 sm:px-2 py-0.5 rounded-md sm:rounded-lg text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                  مميز
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {product.tags && product.tags.length > 0 ? (
                                product.tags.slice(0, 3).map((tag, tagIndex) => (
                                  <span key={tagIndex} className="px-1 sm:px-2 py-0.5 rounded-md sm:rounded-lg text-xs bg-[#749BC2]/20 text-[#F9F3EF]/70">
                                    #{tag}
                                  </span>
                                ))
                              ) : (
                                <span className="text-xs text-[#F9F3EF]/50">لا توجد علامات</span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* المواصفات */}
                        <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                          <div className="space-y-1 text-xs">
                            {product.specifications.processor && (
                              <div className="text-[#F9F3EF]/70">
                                <span className="font-medium text-[#2C6D90]">المعالج:</span> {product.specifications.processor}
                              </div>
                            )}
                            {product.specifications.ram && (
                              <div className="text-[#F9F3EF]/70">
                                <span className="font-medium text-[#2C6D90]">الذاكرة:</span> {product.specifications.ram}
                              </div>
                            )}
                            {product.specifications.storage && (
                              <div className="text-[#F9F3EF]/70">
                                <span className="font-medium text-[#2C6D90]">التخزين:</span> {product.specifications.storage}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* السعر */}
                        <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                          <div className="space-y-1">
                            <div className="text-sm sm:text-base lg:text-lg font-bold text-[#2C6D90]">
                              {getCurrencySymbol()}{convertCurrency(product.price).toLocaleString()}
                            </div>
                            {product.originalPrice && (
                              <div className="text-xs sm:text-sm line-through text-[#F9F3EF]/70">
                                {getCurrencySymbol()}{convertCurrency(product.originalPrice).toLocaleString()}
                              </div>
                            )}
                            {(discountPercentage > 0 || product.discountPercentage > 0) && (
                              <span className="bg-red-500 text-white px-1 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-xs font-semibold">
                                -{product.discountPercentage || discountPercentage}%
                              </span>
                            )}
                          </div>
                        </td>

                        {/* المخزون */}
                        <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getStockColor(product.stock)}`}></div>
                            <span className="text-xs sm:text-sm font-medium text-[#F9F3EF]">
                              {getStockStatus(product.stock)}
                            </span>
                            <span className="text-xs text-[#F9F3EF]/70">({product.stock})</span>
                          </div>
                        </td>

                        {/* الحالة */}
                        <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                          <div className="flex flex-col gap-1">
                            <span className={`text-xs sm:text-sm font-medium px-2 py-1 rounded-md ${product.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                              {product.isActive ? 'نشط' : 'غير نشط'}
                            </span>
                            {product.isBestSeller && (
                              <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-md">
                                الأكثر مبيعاً
                              </span>
                            )}
                          </div>
                        </td>

                        {/* الإجراءات */}
                        <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <button
                              className="p-1 sm:p-2 text-[#2C6D90] hover:text-[#F9F3EF] hover:bg-[#2C6D90]/20 rounded-lg transition-colors duration-300"
                              title="عرض"
                            >
                              <Eye size={14} className="sm:w-4 sm:h-4" />
                            </button>
                            <button
                              className="p-1 sm:p-2 text-[#749BC2] hover:text-[#F9F3EF] hover:bg-[#749BC2]/20 rounded-lg transition-colors duration-300"
                              title="تعديل"
                            >
                              <Edit size={14} className="sm:w-4 sm:h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="p-1 sm:p-2 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-colors duration-300"
                              title="حذف"
                            >
                              <Trash size={14} className="sm:w-4 sm:h-4" />
                            </button>
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