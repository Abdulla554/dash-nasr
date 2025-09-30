import React, { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Grid,
  List,
  Eye,
  Edit,
  Trash2,
  Sparkles,
  ArrowUpDown,
  TrendingUp,
  Package,
  Monitor,
  Laptop,
  Gamepad2,
  Server,
  MousePointer,
  Sun,
  Moon,
  Grid3X3
} from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "../../hooks/useCategoriesQuery";
import ConfirmationModal from "../../components/ConfirmationModal";

export default function LuxuryCategoriesPage() {
  // ثيم دارك ثابت - لا حاجة لمتغير isDark
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewMode, setViewMode] = useState("grid");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  // Use categories from API
  // eslint-disable-next-line no-unused-vars
  const { data: categories = [], isLoading } = useCategories();
  // eslint-disable-next-line no-unused-vars
  const createCategoryMutation = useCreateCategory();
  // eslint-disable-next-line no-unused-vars
  const updateCategoryMutation = useUpdateCategory();
  // eslint-disable-next-line no-unused-vars
  const deleteCategoryMutation = useDeleteCategory();

  // Filter and sort categories
  const filteredAndSortedCategories = React.useMemo(() => {
    let filtered = categories;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category type (removed since we don't have category field)
    // if (filterCategory !== "all") {
    //   filtered = filtered.filter(category => category.category === filterCategory);
    // }

    // Sort categories
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "name":
          aValue = a.name;
          bValue = b.name;
          break;
        case "products":
          aValue = 0; // We don't have productCount yet
          bValue = 0;
          break;
        case "date":
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [categories, searchTerm, sortBy, sortOrder]);


  const toggleSort = () => setSortOrder(sortOrder === "asc" ? "desc" : "asc");

  const handleConfirmDelete = () => {
    if (selectedCategoryId) {
      deleteCategoryMutation.mutate(selectedCategoryId);
    }
  };

  const handleDelete = (id) => {
    setSelectedCategoryId(id);
    setDeleteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]" dir="rtl" >
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this category? This action cannot be undone."
      />
      {/* Header */}
      <div className="relative backdrop-blur-sm border-b bg-[#1A1A2E]/30 border-[#2C6D90]/20">
        <div className="absolute inset-0 bg-gradient-to-r from-[#2C6D90]/10 to-[#2C6D90]/10"></div>
        <div className="relative px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col gap-4 lg:flex-row  md:items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 sm:p-4 bg-gradient-to-r from-[#2C6D90] to-[#2C6D90] rounded-xl sm:rounded-2xl">
                <Grid3X3 className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F9F3EF]">فئات المنتجات</h1>
                <p className="text-[#F9F3EF]/70 mt-1 sm:mt-2 text-sm sm:text-base lg:text-lg">إدارة شاملة لجميع فئات منتجاتك</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 w-full lg:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/categories/add'}
                className="group relative inline-flex items-center gap-2 sm:gap-3 overflow-hidden rounded-xl sm:rounded-2xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-[#2C6D90] hover:bg-[#2C6D90]/90 text-[#F9F3EF] shadow-lg shadow-[#2C6D90]/25 transition-all duration-500 hover:shadow-xl hover:shadow-[#2C6D90]/40 hover:scale-105 w-full lg:w-auto"
              >
                <span className="font-semibold text-sm sm:text-base lg:text-lg">إضافة فئة جديدة</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {[
            { title: "إجمالي الفئات", value: categories.length, icon: Package, color: "from-[#2C6D90] to-[#749BC2]", change: "+12%" },
            { title: "الفئات النشطة", value: categories.length, icon: Monitor, color: "from-[#2C6D90] to-[#749BC2]", change: "+23%" },
            { title: "الفئات الجديدة", value: categories.length, icon: Laptop, color: "from-[#2C6D90] to-[#749BC2]", change: "+18%" },
            { title: "إجمالي المنتجات", value: 0, icon: MousePointer, color: "from-[#2C6D90] to-[#749BC2]", change: "+31%" }
          ].map((stat, index) => (
            <div key={index} className="group relative">
              <div className={`absolute inset-0 bg-[#2C6D90] rounded-2xl opacity-30 group-hover:opacity-40 transition-all duration-300`}></div>
              <div className="relative backdrop-blur-sm border rounded-2xl p-4 sm:p-6 hover:border-[#2C6D90]/50 transition-all duration-300 group-hover:transform group-hover:scale-105 border-[#2C6D90]/20">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="p-2 sm:p-3 backdrop-blur-sm rounded-lg sm:rounded-xl border bg-[#2C6D90]/20 border-[#2C6D90]/30">
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

      {/* Search and Filters */}
      <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="البحث في الفئات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 sm:pr-12 pl-3 sm:pl-4 py-2.5 sm:py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg sm:rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-[#2C6D90] focus:ring-2 focus:ring-[#2C6D90]/20 transition-all duration-300 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4">
              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 sm:px-4 py-2 sm:py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg sm:rounded-xl text-white focus:outline-none focus:border-[#2C6D90] focus:ring-2 focus:ring-[#2C6D90]/20 transition-all duration-300 text-sm sm:text-base"
              >
                <option value="name">الاسم</option>
                <option value="products">عدد المنتجات</option>
                <option value="date">تاريخ الإنشاء</option>
              </select>

              {/* Sort Order */}
              <button
                onClick={toggleSort}
                className="group p-2 sm:p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg sm:rounded-xl hover:border-[#2C6D90]/30 transition-all duration-300"
                title={sortOrder === "asc" ? "ترتيب تنازلي" : "ترتيب تصاعدي"}
              >
                <ArrowUpDown className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 group-hover:text-[#2C6D90] transition-colors" />
              </button>

              {/* View Mode Toggle */}
              <div className="flex border border-slate-700/50 rounded-lg sm:rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 sm:p-3 transition-all duration-300 ${viewMode === "grid"
                    ? "bg-[#2C6D90] text-white"
                    : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-white"
                    }`}
                >
                  <Grid className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 sm:p-3 transition-all duration-300 ${viewMode === "list"
                    ? "bg-[#2C6D90] text-white"
                    : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-white"
                    }`}
                >
                  <List className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
            <p className="text-slate-300 text-sm sm:text-base">
              عرض {filteredAndSortedCategories.length} من {categories.length} فئة
            </p>
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-[#2C6D90] sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm text-slate-400">فلاتر نشطة</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid/List */}
      <div className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
        {filteredAndSortedCategories.length === 0 ? (
          <div className="text-center py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-slate-800/80 to-slate-900/80 rounded-xl sm:rounded-2xl border border-white/10">
            <Search size={32} className="text-[#2C6D90] mx-auto mb-3 sm:mb-4 sm:w-12 sm:h-12 lg:w-12 lg:h-12" />
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 text-white">لم يتم العثور على فئات</h3>
            <p className="text-slate-400 mb-4 sm:mb-6 text-sm sm:text-base">جرب تغيير الفلاتر أو البحث بكلمات مختلفة</p>
            <button
              onClick={() => {
                setSearchTerm('');
              }}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-[#2C6D90] hover:bg-[#2C6D90]/90 text-white rounded-lg sm:rounded-xl font-semibold transition-colors duration-300 text-sm sm:text-base"
            >
              إعادة تعيين الفلاتر
            </button>
          </div>
        ) : (
          <div className={`grid gap-4 sm:gap-6 ${viewMode === "grid"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "grid-cols-1"
            }`}>
            {filteredAndSortedCategories.map((category) => {
              return (
                <div key={category.id} className="group relative">
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#2C6D90] to-[#749BC2] rounded-xl sm:rounded-2xl opacity-20 group-hover:opacity-30 transition-all duration-300"></div>

                  {/* Main Card */}
                  <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl overflow-hidden hover:border-[#2C6D90]/30 transition-all duration-300 group-hover:transform group-hover:scale-[1.02]">

                    {/* Category Badge */}
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20">
                      <div className="px-2 sm:px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-[#2C6D90] to-[#749BC2] text-white">
                        فئة
                      </div>
                    </div>

                    {/* Image Container */}
                    <div className="relative overflow-hidden aspect-[4/3]">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#2C6D90] to-[#749BC2] flex items-center justify-center">
                          <Package className="w-12 h-12 sm:w-16 sm:h-16 text-white/50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                      {/* Icon Overlay */}
                      <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4">
                        <div className="p-2 sm:p-3 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/20">
                          <Package className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-[#2C6D90] transition-colors duration-300">
                          {category.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 mb-2 sm:mb-3">
                          {category.description || "لا يوجد وصف"}
                        </p>
                        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Package className="w-3 h-3 sm:w-4 sm:h-4 text-[#2C6D90]" />
                            <span className="text-slate-300">{category._count.products} منتج</span>
                          </div>
                          <div className="text-slate-500">
                            {new Date(category.createdAt).toLocaleDateString('ar')}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons - Only Delete Button */}
                      <div className="flex items-center justify-end pt-3 sm:pt-4 border-t border-white/10">
                        <button onClick={() => handleDelete(category.id)} className="group/btn p-2 sm:p-2.5 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg sm:rounded-xl hover:bg-red-500/30 transition-all duration-300 hover:scale-110">
                          <Trash2 size={14} className="sm:w-4 sm:h-4 group-hover/btn:scale-110 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6">
        <div className="text-center">
          <p className="text-slate-500 text-xs sm:text-sm">© 2025 نظام إدارة الفئات الفخم - جميع الحقوق محفوظة</p>
        </div>
      </div>
    </div>
  );
}