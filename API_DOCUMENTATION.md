# Dash Nasr API Documentation

## 📋 Overview

هذا التوثيق يوضح جميع الـ API endpoints المتاحة في نظام Dash Nasr لإدارة المنتجات.

## 🔧 Setup

### Environment Variables

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=Dash Nasr
VITE_APP_VERSION=1.0.0
```

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## 📚 API Endpoints

### 🏠 Health Check

```
GET /api/health
```

### 📦 Products

```
GET    /products                    # جميع المنتجات مع الصفحات
GET    /products/search             # البحث المتقدم
GET    /products/featured           # المنتجات المميزة
GET    /products/bestsellers        # الأكثر مبيعاً
GET    /products/new                # المنتجات الجديدة
GET    /products/category/:id       # منتجات فئة معينة
GET    /products/brand/:id          # منتجات ماركة معينة
GET    /products/stats              # إحصائيات المنتجات
GET    /products/low-stock          # المنتجات منخفضة المخزون
POST   /products                    # إنشاء منتج
GET    /products/:id                # منتج واحد
PUT    /products/:id                # تحديث منتج
PATCH  /products/:id                # تحديث جزئي
PUT    /products/:id/stock          # تحديث المخزون
DELETE /products/:id                # حذف منتج
```

### 🏷️ Categories

```
GET    /categories                  # جميع الفئات
GET    /categories/:id              # فئة واحدة
POST   /categories                  # إنشاء فئة
PUT    /categories/:id              # تحديث فئة
PATCH  /categories/:id              # تحديث جزئي
DELETE /categories/:id              # حذف فئة
```

### 🏢 Brands

```
GET    /brands                      # جميع الماركات
GET    /brands/:id                  # ماركة واحدة
POST   /brands                      # إنشاء ماركة
PUT    /brands/:id                  # تحديث ماركة
PATCH  /brands/:id                  # تحديث جزئي
DELETE /brands/:id                  # حذف ماركة
```

### 🛒 Orders

```
GET    /orders                      # جميع الطلبات
GET    /orders?status=PENDING       # طلبات بحالة معينة
GET    /orders/:id                  # طلب واحد
POST   /orders                      # إنشاء طلب
PUT    /orders/:id                  # تحديث طلب
PATCH  /orders/:id                  # تحديث جزئي
DELETE /orders/:id                  # حذف طلب
```

### 🖼️ Banners

```
GET    /banners                     # جميع الإعلانات
GET    /banners/active              # الإعلانات النشطة
GET    /banners/:id                 # إعلان واحد
POST   /banners                     # إنشاء إعلان
PUT    /banners/:id                 # تحديث إعلان
PATCH  /banners/:id                 # تحديث جزئي
DELETE /banners/:id                 # حذف إعلان
```

### 📁 الرفع (Upload)

```
POST   /upload/image                # رفع صورة واحدة
POST   /upload/images               # رفع عدة صور
DELETE /upload/:imageId             # حذف صورة
```

### 📊 الداشبورد (Dashboard)

```
GET    /dashboard/stats             # إحصائيات الداشبورد
GET    /dashboard/revenue           # إحصائيات الإيرادات
GET    /dashboard/orders-chart      # مخطط الطلبات
GET    /dashboard/products-chart    # مخطط المنتجات
```

### 📈 التحليلات (Analytics)

```
GET    /analytics/overview          # نظرة عامة
GET    /analytics/sales             # تحليلات المبيعات
GET    /analytics/products          # تحليلات المنتجات
```

### 🔧 الخدمات المساعدة (Utilities)

```
GET    /health                      # فحص حالة الخادم
GET    /currencies                  # العملات المتاحة
POST   /currencies                  # إضافة عملة
PUT    /currencies/:id              # تحديث عملة
GET    /settings                    # إعدادات النظام
PUT    /settings                    # تحديث الإعدادات
```

## 📝 Request/Response Examples

### Product Creation

```json
POST /api/products
{
  "title": "MacBook Pro 16-inch M3 Max",
  "description": "أقوى لابتوب من Apple",
  "price": 15999,
  "originalPrice": 17999,
  "category": "laptops",
  "brand": "Apple",
  "images": ["url1", "url2"],
  "specifications": {
    "processor": "Apple M3 Max",
    "ram": "32GB",
    "storage": "1TB SSD"
  },
  "stock": 15,
  "isNew": true,
  "isBestSeller": true,
  "tags": ["premium", "professional"]
}
```

### Response Format

```json
{
  "success": true,
  "message": "تم بنجاح",
  "data": { ... },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## 🎣 React Hooks Usage

### Products

```javascript
import { useProducts, useProduct } from "./hooks";

// Get all products
const {
  products,
  loading,
  error,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getFeaturedProducts,
  getBestsellers,
  getNewProducts,
  getLowStockProducts,
  getProductsByCategory,
  getProductsByBrand,
} = useProducts();

// Get single product
const { product, loading, error, updateProduct, updateStock } =
  useProduct(productId);

// Search products with filters
const searchResults = await searchProducts({
  search: "iPhone",
  isNew: true,
  category: "smartphones",
  page: 1,
  limit: 10,
});

// Get featured products
const featuredProducts = await getFeaturedProducts();

// Get products by category
const categoryProducts = await getProductsByCategory("laptops");
```

### Categories

```javascript
import { useCategories, useCategory } from "./hooks";

// Get all categories
const {
  categories,
  loading,
  error,
  createCategory,
  updateCategory,
  deleteCategory,
} = useCategories();

// Get single category
const { category, loading, error } = useCategory(categoryId);
```

### Brands

```javascript
import { useBrands, useBrand } from "./hooks";

// Get all brands
const { brands, loading, error, createBrand, updateBrand, deleteBrand } =
  useBrands();

// Get single brand
const { brand, loading, error } = useBrand(brandId);
```

### Orders

```javascript
import { useOrders, useOrder } from "./hooks";

// Get all orders
const { orders, loading, error, createOrder, updateOrder, deleteOrder } =
  useOrders();

// Get single order
const { order, loading, error, updateOrder } = useOrder(orderId);
```

### Banners

```javascript
import { useBanners, useBanner } from "./hooks";

// Get all banners
const { banners, loading, error, createBanner, updateBanner, deleteBanner } =
  useBanners();

// Get single banner
const { banner, loading, error } = useBanner(bannerId);
```

### Dashboard

```javascript
import { useDashboard, useDashboardData, useAnalytics } from "./hooks";

// Get dashboard stats
const {
  stats,
  loading,
  error,
  getRevenueStats,
  getOrdersChart,
  getProductsChart,
} = useDashboard();

// Get all dashboard data at once
const { dashboardData, loading, error, refetch } = useDashboardData();

// Get analytics
const { analytics, loading, error, getSalesAnalytics, getProductsAnalytics } =
  useAnalytics();
```

### Currencies

```javascript
import { useCurrencies } from "./hooks";

// Get all currencies
const { currencies, loading, error, createCurrency, updateCurrency } =
  useCurrencies();
```

### Settings

```javascript
import { useSettings } from "./hooks";

// Get and update settings
const { settings, loading, error, updateSettings } = useSettings();
```

### Upload

```javascript
import { useUpload, compressImage, validateFile } from "./hooks";

// Upload functionality
const { uploading, progress, uploadImage, uploadImages, deleteImage } =
  useUpload();

// Compress image before upload
const compressedFile = await compressImage(file);

// Validate file
const { isValid, errors } = validateFile(file);
```

## 🔒 Error Handling

جميع الـ API calls تحتوي على error handling تلقائي مع رسائل باللغة العربية:

- **400**: بيانات غير صحيحة
- **401**: غير مصرح لك بالوصول
- **403**: ممنوع الوصول
- **404**: المورد غير موجود
- **409**: تضارب في البيانات
- **422**: بيانات غير صالحة
- **500**: خطأ في الخادم

## 📱 Features

- ✅ Error handling تلقائي
- ✅ Loading states
- ✅ Toast notifications
- ✅ Image compression
- ✅ File validation
- ✅ Pagination support
- ✅ Search functionality
- ✅ Arabic language support
- ✅ TypeScript ready
- ✅ Responsive design

## 🚀 Getting Started

1. قم بتثبيت التبعيات
2. اضبط متغيرات البيئة
3. ابدأ الخادم
4. استخدم الـ hooks في مكوناتك

```javascript
// Example usage in component
import { useProducts } from "./hooks";

function ProductsPage() {
  const { products, loading, error, createProduct } = useProducts();

  if (loading) return <div>جاري التحميل...</div>;
  if (error) return <div>خطأ: {error}</div>;

  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>{product.title}</div>
      ))}
    </div>
  );
}
```
