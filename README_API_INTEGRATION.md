# 🚀 Dash Nasr - API Integration Guide

## 📋 Overview

هذا الدليل يوضح كيفية استخدام الـ API المحدث مع الفرونت إند في مشروع Dash Nasr.

## 🔧 Setup

### 1. Environment Variables

أنشئ ملف `.env` في مجلد المشروع:

```env
# API Configuration
VITE_API_URL=http://localhost:3000

# App Configuration
VITE_APP_NAME=Dash Nasr
VITE_APP_VERSION=1.0.0
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

## 📚 API Endpoints

### 🛍️ Products

- `GET /products` - جميع المنتجات
- `GET /products/search` - البحث المتقدم
- `GET /products/featured` - المنتجات المميزة
- `GET /products/bestsellers` - الأكثر مبيعاً
- `GET /products/new` - المنتجات الجديدة
- `GET /products/category/:id` - منتجات فئة معينة
- `GET /products/brand/:id` - منتجات ماركة معينة
- `GET /products/stats` - إحصائيات المنتجات
- `GET /products/low-stock` - المنتجات منخفضة المخزون
- `POST /products` - إنشاء منتج
- `GET /products/:id` - منتج واحد
- `PUT /products/:id` - تحديث منتج
- `PATCH /products/:id` - تحديث جزئي
- `PUT /products/:id/stock` - تحديث المخزون
- `DELETE /products/:id` - حذف منتج

### 🏷️ Categories

- `GET /categories` - جميع الفئات
- `GET /categories/:id` - فئة واحدة
- `POST /categories` - إنشاء فئة
- `PUT /categories/:id` - تحديث فئة
- `PATCH /categories/:id` - تحديث جزئي
- `DELETE /categories/:id` - حذف فئة

### 🏢 Brands

- `GET /brands` - جميع الماركات
- `GET /brands/:id` - ماركة واحدة
- `POST /brands` - إنشاء ماركة
- `PUT /brands/:id` - تحديث ماركة
- `PATCH /brands/:id` - تحديث جزئي
- `DELETE /brands/:id` - حذف ماركة

### 🛒 Orders

- `GET /orders` - جميع الطلبات
- `GET /orders?status=PENDING` - طلبات بحالة معينة
- `GET /orders/:id` - طلب واحد
- `POST /orders` - إنشاء طلب
- `PUT /orders/:id` - تحديث طلب
- `PATCH /orders/:id` - تحديث جزئي
- `DELETE /orders/:id` - حذف طلب

### 🖼️ Banners

- `GET /banners` - جميع الإعلانات
- `GET /banners/active` - الإعلانات النشطة
- `GET /banners/:id` - إعلان واحد
- `POST /banners` - إنشاء إعلان
- `PUT /banners/:id` - تحديث إعلان
- `PATCH /banners/:id` - تحديث جزئي
- `DELETE /banners/:id` - حذف إعلان

### 📁 Upload

- `POST /upload/image` - رفع صورة واحدة
- `POST /upload/images` - رفع عدة صور
- `DELETE /upload/:imageId` - حذف صورة

### 📊 Dashboard

- `GET /dashboard/stats` - إحصائيات الداشبورد
- `GET /dashboard/revenue` - إحصائيات الإيرادات
- `GET /dashboard/orders-chart` - مخطط الطلبات
- `GET /dashboard/products-chart` - مخطط المنتجات

### 📈 Analytics

- `GET /analytics/overview` - نظرة عامة
- `GET /analytics/sales` - تحليلات المبيعات
- `GET /analytics/products` - تحليلات المنتجات

### 🔧 Utilities

- `GET /health` - فحص حالة الخادم
- `GET /currencies` - العملات المتاحة
- `POST /currencies` - إضافة عملة
- `PUT /currencies/:id` - تحديث عملة
- `GET /settings` - إعدادات النظام
- `PUT /settings` - تحديث الإعدادات

## 🎣 React Hooks Usage

### Products Hook

```javascript
import { useProducts, useProduct } from "./hooks";

function ProductsPage() {
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

  // Search products with filters
  const handleSearch = async () => {
    const results = await searchProducts({
      search: "iPhone",
      isNew: true,
      category: "smartphones",
      page: 1,
      limit: 10,
    });
  };

  // Get featured products
  const handleGetFeatured = async () => {
    const featured = await getFeaturedProducts();
  };

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

### Dashboard Hook

```javascript
import { useDashboardData } from "./hooks";

function Dashboard() {
  const { dashboardData, loading, error, refetch } = useDashboardData();

  if (loading) return <div>جاري التحميل...</div>;
  if (error) return <div>خطأ: {error}</div>;

  return (
    <div>
      <h1>إحصائيات الداشبورد</h1>
      <p>إجمالي المنتجات: {dashboardData.stats?.totalProducts}</p>
      <p>إجمالي الطلبات: {dashboardData.stats?.totalOrders}</p>
      <p>الإيرادات: {dashboardData.stats?.monthlyRevenue}</p>
    </div>
  );
}
```

### Upload Hook

```javascript
import { useUpload, compressImage, validateFile } from "./hooks";

function ImageUpload() {
  const { uploading, progress, uploadImage, uploadImages, deleteImage } =
    useUpload();

  const handleUpload = async (file) => {
    // Validate file
    const { isValid, errors } = validateFile(file);
    if (!isValid) {
      console.error("File validation errors:", errors);
      return;
    }

    // Compress image
    const compressedFile = await compressImage(file);

    // Upload image
    const result = await uploadImage(compressedFile);
    console.log("Upload result:", result);
  };

  return (
    <div>
      <input type="file" onChange={(e) => handleUpload(e.target.files[0])} />
      {uploading && <div>جاري الرفع... {progress}%</div>}
    </div>
  );
}
```

## 📝 Request/Response Examples

### Product Creation

```javascript
const productData = {
  name: "iPhone 15 Pro",
  title: "iPhone 15 Pro Max 256GB",
  description: "أحدث iPhone من Apple",
  price: 4999.99,
  originalPrice: 5499.99,
  stock: 50,
  isNew: true,
  isBestSeller: true,
  isFeatured: true,
  specifications: {
    processor: "A17 Pro",
    storage: "256GB",
    camera: "48MP",
  },
  tags: ["premium", "smartphone"],
  categoryId: "your_category_id",
  brandId: "your_brand_id",
};

const response = await createProduct(productData);
```

### Search Products

```javascript
const searchParams = {
  search: "iPhone",
  isNew: true,
  category: "smartphones",
  brand: "Apple",
  minPrice: 1000,
  maxPrice: 5000,
  page: 1,
  limit: 10,
};

const results = await searchProducts(searchParams);
```

### Response Format

```json
{
  "success": true,
  "message": "تم بنجاح",
  "data": {
    "id": "uuid",
    "name": "iPhone 15 Pro",
    "title": "iPhone 15 Pro Max 256GB",
    "price": 4999.99,
    "stock": 50,
    "isNew": true,
    "isBestSeller": true,
    "isFeatured": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## 🔒 Error Handling

جميع الـ API calls تحتوي على error handling تلقائي:

```javascript
try {
  const result = await createProduct(productData);
  // Success handling
} catch (error) {
  // Error is automatically handled by axios interceptor
  // Toast notification is shown automatically
  console.error("Error:", error);
}
```

## 🚀 Features

- ✅ **Error handling تلقائي** مع رسائل باللغة العربية
- ✅ **Loading states** لجميع العمليات
- ✅ **Toast notifications** تلقائية
- ✅ **Image compression** قبل الرفع
- ✅ **File validation** للملفات
- ✅ **Pagination support** للقوائم الطويلة
- ✅ **Search functionality** متقدمة
- ✅ **Real-time data** للداشبورد
- ✅ **Arabic language support** كامل
- ✅ **TypeScript ready** للاستخدام المستقبلي

## 📱 Example Components

### Products List Component

```javascript
import { useProducts } from "./hooks";

function ProductsList() {
  const { products, loading, error, deleteProduct } = useProducts();

  const handleDelete = async (id) => {
    if (confirm("هل أنت متأكد من الحذف؟")) {
      await deleteProduct(id);
    }
  };

  if (loading) return <div>جاري التحميل...</div>;
  if (error) return <div>خطأ: {error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold">{product.title}</h3>
          <p className="text-gray-600">{product.description}</p>
          <p className="text-2xl font-bold text-blue-600">${product.price}</p>
          <button
            onClick={() => handleDelete(product.id)}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            حذف
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Dashboard Stats Component

```javascript
import { useDashboardData } from "./hooks";

function DashboardStats() {
  const { dashboardData, loading, error } = useDashboardData();

  if (loading) return <div>جاري التحميل...</div>;
  if (error) return <div>خطأ: {error}</div>;

  const stats = dashboardData.stats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-blue-500 text-white p-6 rounded-lg">
        <h3 className="text-lg font-semibold">إجمالي المنتجات</h3>
        <p className="text-3xl font-bold">{stats?.totalProducts || 0}</p>
      </div>
      <div className="bg-green-500 text-white p-6 rounded-lg">
        <h3 className="text-lg font-semibold">إجمالي الطلبات</h3>
        <p className="text-3xl font-bold">{stats?.totalOrders || 0}</p>
      </div>
      <div className="bg-yellow-500 text-white p-6 rounded-lg">
        <h3 className="text-lg font-semibold">الإيرادات</h3>
        <p className="text-3xl font-bold">${stats?.monthlyRevenue || 0}</p>
      </div>
      <div className="bg-purple-500 text-white p-6 rounded-lg">
        <h3 className="text-lg font-semibold">الزوار</h3>
        <p className="text-3xl font-bold">{stats?.monthlyVisitors || 0}</p>
      </div>
    </div>
  );
}
```

## 🎯 Best Practices

1. **استخدم الـ hooks** بدلاً من استدعاء API مباشرة
2. **تحقق من loading states** قبل عرض البيانات
3. **تعامل مع الأخطاء** بشكل مناسب
4. **استخدم pagination** للقوائم الطويلة
5. **اضغط الصور** قبل الرفع لتوفير المساحة
6. **تحقق من صحة الملفات** قبل الرفع
7. **استخدم search parameters** للبحث المتقدم
8. **حدث البيانات** بعد العمليات (CRUD)

## 🚀 Getting Started

1. **اضبط متغيرات البيئة** في ملف `.env`
2. **ابدأ الباك إند** على المنفذ 3000
3. **ابدأ الفرونت إند** على المنفذ 5173
4. **استخدم الـ hooks** في مكوناتك
5. **اختبر الـ API** مع البيانات الحقيقية

---

**🎊 تم تطوير هذا النظام بـ ❤️ باستخدام React و NestJS - نظام إدارة متكامل للتجارة الإلكترونية!**
