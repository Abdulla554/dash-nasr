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
  Moon
} from "lucide-react";
import { Link } from "react-router-dom";
import { useBrands, useCreateBrand, useUpdateBrand, useDeleteBrand } from "../../hooks/useBrandsQuery";
export default function AllBrands() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewMode, setViewMode] = useState("grid");

  // Use brands from API
  const { data: brands = [] } = useBrands();
  // eslint-disable-next-line no-unused-vars
  const createBrandMutation = useCreateBrand();
  // eslint-disable-next-line no-unused-vars
  const updateBrandMutation = useUpdateBrand();
  // eslint-disable-next-line no-unused-vars
  const deleteBrandMutation = useDeleteBrand();

  // Filter and sort brands
  const filteredAndSortedBrands = React.useMemo(() => {
    let filtered = brands;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(brand =>
        brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brand.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort brands
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "name":
          aValue = a.name;
          bValue = b.name;
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
  }, [brands, searchTerm, sortBy, sortOrder]);

  const toggleSort = () => setSortOrder(sortOrder === "asc" ? "desc" : "asc");

  return (
    <div className="min-h-screen bg-[#1a1a2e]" dir="rtl">
      {/* Header */}
      <div className="relative bg-[#F9F3EF]/5 backdrop-blur-sm border-b border-[#749BC2]/20">
        <div className="absolute inset-0 bg-gradient-to-r from-[#2C6D90]/10 to-[#749BC2]/10"></div>
        <div className="relative px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-gradient-to-r from-[#2C6D90] to-[#749BC2] rounded-2xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-[#F9F3EF]">
                  الماركات
                </h1>
                <p className="text-[#F9F3EF]/70 mt-2 text-lg">إدارة شاملة لجميع ماركاتك</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Add Brand Button */}
              <Link to="/brands/add">
                <button className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl px-8 py-4 bg-gradient-to-r from-[#2C6D90] to-[#749BC2] text-white shadow-lg shadow-[#2C6D90]/25 transition-all duration-500 hover:shadow-xl hover:shadow-[#2C6D90]/40 hover:scale-105">
                  <Plus className="h-6 w-6 transition-all duration-500 group-hover:rotate-180" />
                  <span className="font-semibold text-lg">إضافة ماركة جديدة</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { title: "إجمالي الماركات", value: brands.length, icon: Package, color: "from-purple-600 to-purple-800", change: "+12%" },
            { title: "الماركات النشطة", value: brands.length, icon: Monitor, color: "from-blue-600 to-blue-800", change: "+23%" },
            { title: "الماركات الجديدة", value: brands.length, icon: Laptop, color: "from-emerald-600 to-emerald-800", change: "+18%" },
            { title: "إجمالي المنتجات", value: 0, icon: MousePointer, color: "from-orange-600 to-orange-800", change: "+31%" }
          ].map((stat, index) => (
            <div key={index} className="group relative">
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl opacity-80 group-hover:opacity-90 transition-all duration-300`}></div>
              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300 group-hover:transform group-hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-emerald-400 font-semibold text-sm flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {stat.change}
                  </span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-white/80 text-sm">{stat.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="px-8 pb-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="البحث في الماركات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-12 pl-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                />
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap gap-4">
              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
              >
                <option value="name">الاسم</option>
                <option value="date">تاريخ الإنشاء</option>
              </select>

              {/* Sort Order */}
              <button
                onClick={toggleSort}
                className="group p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:border-purple-500/30 transition-all duration-300"
                title={sortOrder === "asc" ? "ترتيب تنازلي" : "ترتيب تصاعدي"}
              >
                <ArrowUpDown className="h-5 w-5 text-slate-400 group-hover:text-purple-400 transition-colors" />
              </button>

              {/* View Mode Toggle */}
              <div className="flex border border-slate-700/50 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 transition-all duration-300 ${viewMode === "grid"
                    ? "bg-purple-600 text-white"
                    : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-white"
                    }`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 transition-all duration-300 ${viewMode === "list"
                    ? "bg-purple-600 text-white"
                    : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-white"
                    }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-slate-300">
              عرض {filteredAndSortedBrands.length} من {brands.length} ماركة
            </p>
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-purple-400" />
              <span className="text-sm text-slate-400">فلاتر نشطة</span>
            </div>
          </div>
        </div>
      </div>

      {/* Brands Grid/List */}
      <div className="px-8 pb-8">
        {filteredAndSortedBrands.length === 0 ? (
          <div className="text-center py-20 bg-gradient-to-r from-slate-800/80 to-slate-900/80 rounded-2xl border border-white/10">
            <Search size={48} className="text-purple-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">لم يتم العثور على ماركات</h3>
            <p className="text-slate-400 mb-6">جرب تغيير الفلاتر أو البحث بكلمات مختلفة</p>
            <button
              onClick={() => {
                setSearchTerm('');
              }}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-colors duration-300"
            >
              إعادة تعيين الفلاتر
            </button>
          </div>
        ) : (
          <div className={`grid gap-6 ${viewMode === "grid"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "grid-cols-1"
            }`}>
            {filteredAndSortedBrands.map((brand) => {
              return (
                <div key={brand.id} className="group relative">
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl opacity-20 group-hover:opacity-30 transition-all duration-300"></div>

                  {/* Main Card */}
                  <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 group-hover:transform group-hover:scale-[1.02]">

                    {/* Brand Badge */}
                    <div className="absolute top-4 right-4 z-20">
                      <div className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-600 to-purple-800 text-white">
                        ماركة
                      </div>
                    </div>

                    {/* Image Container */}
                    <div className="relative overflow-hidden aspect-[4/3]">
                      {brand.logo ? (
                        <img
                          src={brand.logo}
                          alt={brand.name}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                          <Package className="w-16 h-16 text-white/50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                      {/* Icon Overlay */}
                      <div className="absolute bottom-4 right-4">
                        <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                          <Package className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors duration-300">
                          {brand.name}
                        </h3>
                        <p className="text-sm text-slate-400 line-clamp-2 mb-3">
                          {brand.description || "لا يوجد وصف"}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-blue-400" />
                            <span className="text-slate-300">0 منتج</span>
                          </div>
                          <div className="text-slate-500">
                            {new Date(brand.createdAt).toLocaleDateString('ar')}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex items-center gap-2">
                          <button className="group/btn p-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-xl hover:bg-blue-500/30 transition-all duration-300 hover:scale-110">
                            <Eye size={16} className="group-hover/btn:scale-110 transition-transform" />
                          </button>
                          <button className="group/btn p-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-xl hover:bg-emerald-500/30 transition-all duration-300 hover:scale-110">
                            <Edit size={16} className="group-hover/btn:scale-110 transition-transform" />
                          </button>
                        </div>

                        <button className="group/btn p-2 bg-red-500/20 border border-red-500/30 text-red-300 rounded-xl hover:bg-red-500/30 transition-all duration-300 hover:scale-110">
                          <Trash2 size={16} className="group-hover/btn:scale-110 transition-transform" />
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
      <div className="px-8 pb-6">
        <div className="text-center">
          <p className="text-slate-500 text-sm">© 2025 نظام إدارة الماركات الفخم - جميع الحقوق محفوظة</p>
        </div>
      </div>
    </div>
  );
}
