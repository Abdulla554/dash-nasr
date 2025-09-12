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

export default function LuxuryCategoriesPage() {
  const [isDark, setIsDark] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewMode, setViewMode] = useState("grid");

  // Demo Categories Data
  const demoCategoriesData = [
    {
      id: 1,
      title: "أجهزة الكمبيوتر المكتبية",
      titleEn: "Desktop PCs",
      description: "أجهزة كمبيوتر مكتبية عالية الأداء للمنزل والمكتب مع أحدث التقنيات",
      image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&h=400&fit=crop",
      category: "pc",
      productCount: 45,
      isActive: true,
      createdAt: "2024-01-15",
      growth: "+15%",
      icon: Monitor
    },
    {
      id: 2,
      title: "أجهزة اللابتوب",
      titleEn: "Laptops",
      description: "لابتوبات متنوعة للأعمال والترفيه والدراسة بأداء استثنائي",
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=400&fit=crop",
      category: "laptop",
      productCount: 32,
      isActive: true,
      createdAt: "2024-01-10",
      growth: "+23%",
      icon: Laptop
    },
    {
      id: 3,
      title: "إكسسوارات الكمبيوتر",
      titleEn: "Computer Accessories",
      description: "فأرات، لوحات مفاتيح، سماعات، وملحقات عالية الجودة",
      image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=400&fit=crop",
      category: "accessories",
      productCount: 78,
      isActive: true,
      createdAt: "2024-01-20",
      growth: "+31%",
      icon: MousePointer
    },
    {
      id: 4,
      title: "أجهزة الألعاب",
      titleEn: "Gaming PCs",
      description: "أجهزة كمبيوتر مخصصة للألعاب بأداء عالي وتبريد متطور",
      image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&h=400&fit=crop",
      category: "pc",
      productCount: 28,
      isActive: true,
      createdAt: "2024-01-25",
      growth: "+42%",
      icon: Gamepad2
    },
    {
      id: 5,
      title: "لابتوبات الألعاب",
      titleEn: "Gaming Laptops",
      description: "لابتوبات عالية الأداء مخصصة للألعاب بكروت شاشة قوية",
      image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=400&fit=crop",
      category: "laptop",
      productCount: 19,
      isActive: true,
      createdAt: "2024-01-18",
      growth: "+28%",
      icon: Gamepad2
    },
    {
      id: 6,
      title: "أجهزة الخوادم",
      titleEn: "Servers",
      description: "خوادم قوية للشركات والمؤسسات بموثوقية عالية",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&h=400&fit=crop",
      category: "pc",
      productCount: 15,
      isActive: true,
      createdAt: "2024-01-08",
      growth: "+18%",
      icon: Server
    }
  ];

  // Filter and sort categories
  const filteredAndSortedCategories = React.useMemo(() => {
    let filtered = demoCategoriesData;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(category =>
        category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category type
    if (filterCategory !== "all") {
      filtered = filtered.filter(category => category.category === filterCategory);
    }

    // Sort categories
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "name":
          aValue = a.title;
          bValue = b.title;
          break;
        case "products":
          aValue = a.productCount;
          bValue = b.productCount;
          break;
        case "date":
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        default:
          aValue = a.title;
          bValue = b.title;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [searchTerm, filterCategory, sortBy, sortOrder]);

  const getCategoryBadge = (categoryType) => {
    switch (categoryType) {
      case "pc":
        return { text: "أجهزة كمبيوتر", color: "from-blue-600 to-blue-800", textColor: "text-white" };
      case "laptop":
        return { text: "لابتوبات", color: "from-emerald-600 to-emerald-800", textColor: "text-white" };
      case "accessories":
        return { text: "إكسسوارات", color: "from-purple-600 to-purple-800", textColor: "text-white" };
      default:
        return { text: "فئة", color: "from-slate-600 to-slate-800", textColor: "text-white" };
    }
  };

  const toggleSort = () => setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black" dir="rtl">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-black/95 backdrop-blur-sm border-b border-slate-700/50">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10"></div>
        <div className="relative px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  فئات المنتجات
                </h1>
                <p className="text-slate-400 mt-2 text-lg">إدارة شاملة لجميع فئات منتجاتك</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="group p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-purple-500/30 transition-all duration-300"
              >
                {isDark ? (
                  <Sun className="h-6 w-6 text-purple-400 group-hover:text-white transition-colors" />
                ) : (
                  <Moon className="h-6 w-6 text-purple-400 group-hover:text-white transition-colors" />
                )}
              </button>

              {/* Add Category Button */}
              <Link to="/categories/add">
              <button className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25 transition-all duration-500 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105">
                <Plus className="h-6 w-6 transition-all duration-500 group-hover:rotate-180" />
                <span className="font-semibold text-lg">إضافة فئة جديدة</span>
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
            { title: "إجمالي الفئات", value: demoCategoriesData.length, icon: Package, color: "from-purple-600 to-purple-800", change: "+12%" },
            { title: "فئات الكمبيوتر", value: demoCategoriesData.filter(c => c.category === 'pc').length, icon: Monitor, color: "from-blue-600 to-blue-800", change: "+23%" },
            { title: "فئات اللابتوب", value: demoCategoriesData.filter(c => c.category === 'laptop').length, icon: Laptop, color: "from-emerald-600 to-emerald-800", change: "+18%" },
            { title: "الإكسسوارات", value: demoCategoriesData.filter(c => c.category === 'accessories').length, icon: MousePointer, color: "from-orange-600 to-orange-800", change: "+31%" }
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
                  placeholder="البحث في الفئات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-12 pl-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                />
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap gap-4">
              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
              >
                <option value="all">جميع الفئات</option>
                <option value="pc">أجهزة الكمبيوتر</option>
                <option value="laptop">اللابتوبات</option>
                <option value="accessories">الإكسسوارات</option>
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
              >
                <option value="name">الاسم</option>
                <option value="products">عدد المنتجات</option>
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
              عرض {filteredAndSortedCategories.length} من {demoCategoriesData.length} فئة
            </p>
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-purple-400" />
              <span className="text-sm text-slate-400">فلاتر نشطة</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid/List */}
      <div className="px-8 pb-8">
        {filteredAndSortedCategories.length === 0 ? (
          <div className="text-center py-20 bg-gradient-to-r from-slate-800/80 to-slate-900/80 rounded-2xl border border-white/10">
            <Search size={48} className="text-purple-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">لم يتم العثور على فئات</h3>
            <p className="text-slate-400 mb-6">جرب تغيير الفلاتر أو البحث بكلمات مختلفة</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterCategory('all');
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
            {filteredAndSortedCategories.map((category) => {
              const badge = getCategoryBadge(category.category);
              const IconComponent = category.icon;

              return (
                <div key={category.id} className="group relative">
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${badge.color} rounded-2xl opacity-20 group-hover:opacity-30 transition-all duration-300`}></div>
                  
                  {/* Main Card */}
                  <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 group-hover:transform group-hover:scale-[1.02]">
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 right-4 z-20">
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${badge.color} ${badge.textColor}`}>
                        {badge.text}
                      </div>
                    </div>

                    {/* Growth Badge */}
                    <div className="absolute top-4 left-4 z-20">
                      <div className="px-2 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {category.growth}
                      </div>
                    </div>

                    {/* Image Container */}
                    <div className="relative overflow-hidden aspect-[4/3]">
                      <img
                        src={category.image}
                        alt={category.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                      
                      {/* Icon Overlay */}
                      <div className="absolute bottom-4 right-4">
                        <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors duration-300">
                          {category.title}
                        </h3>
                        <p className="text-sm text-slate-400 line-clamp-2 mb-3">
                          {category.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-blue-400" />
                            <span className="text-slate-300">{category.productCount} منتج</span>
                          </div>
                          <div className="text-slate-500">
                            {new Date(category.createdAt).toLocaleDateString('ar')}
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
          <p className="text-slate-500 text-sm">© 2025 نظام إدارة الفئات الفخم - جميع الحقوق محفوظة</p>
        </div>
      </div>
    </div>
  );
}