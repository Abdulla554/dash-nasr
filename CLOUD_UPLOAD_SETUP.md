# إعداد الرفع على السحابة (Cloud Upload Setup)

## نظرة عامة

تم تحديث نظام الرفع ليدعم الرفع على السحابة بدلاً من الرفع المحلي. النظام يدعم عدة مزودي سحابة مختلفة.

## المزودون المدعومون

### 1. AWS S3

```javascript
// إعدادات AWS S3
const awsConfig = {
  bucket: "your-bucket-name",
  region: "us-east-1",
  accessKeyId: "your-access-key",
  secretAccessKey: "your-secret-key",
};
```

### 2. Cloudinary

```javascript
// إعدادات Cloudinary
const cloudinaryConfig = {
  cloudName: "your-cloud-name",
  apiKey: "your-api-key",
  apiSecret: "your-api-secret",
  uploadPreset: "ml_default",
};
```

### 3. Firebase Storage

```javascript
// إعدادات Firebase
const firebaseConfig = {
  projectId: "your-project-id",
  storageBucket: "your-bucket.appspot.com",
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
};
```

## متغيرات البيئة المطلوبة

أنشئ ملف `.env` في المجلد الجذر وأضف المتغيرات التالية:

```env
# API Configuration
VITE_API_URL=http://localhost:3000

# Cloud Storage Configuration
# AWS S3
VITE_AWS_BUCKET=your-bucket-name
VITE_AWS_REGION=us-east-1
VITE_AWS_ACCESS_KEY_ID=your-access-key
VITE_AWS_SECRET_ACCESS_KEY=your-secret-key

# Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_API_KEY=your-api-key
VITE_CLOUDINARY_API_SECRET=your-api-secret
VITE_CLOUDINARY_UPLOAD_PRESET=ml_default

# Firebase Storage
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
```

## كيفية الاستخدام

### 1. رفع صورة فئة

```javascript
import { useUpload } from "./hooks/useUpload";

const { uploadCategoryImage, uploading, progress } = useUpload();

const handleCategoryUpload = async (file) => {
  try {
    const result = await uploadCategoryImage(file, (progress) => {
      console.log(`Category upload progress: ${progress}%`);
    });

    console.log("Category image URL:", result.data.url);
    return result.data.url;
  } catch (error) {
    console.error("Category upload failed:", error);
  }
};
```

### 2. رفع صورة ماركة

```javascript
const { uploadBrandImage } = useUpload();

const handleBrandUpload = async (file) => {
  try {
    const result = await uploadBrandImage(file, (progress) => {
      console.log(`Brand upload progress: ${progress}%`);
    });

    console.log("Brand image URL:", result.data.url);
    return result.data.url;
  } catch (error) {
    console.error("Brand upload failed:", error);
  }
};
```

### 3. رفع صورة بانر

```javascript
const { uploadBannerImage } = useUpload();

const handleBannerUpload = async (file) => {
  try {
    const result = await uploadBannerImage(file, (progress) => {
      console.log(`Banner upload progress: ${progress}%`);
    });

    console.log("Banner image URL:", result.data.url);
    return result.data.url;
  } catch (error) {
    console.error("Banner upload failed:", error);
  }
};
```

### 4. رفع صورة منتج واحدة

```javascript
const { uploadSingleProductImage } = useUpload();

const handleProductUpload = async (file) => {
  try {
    const result = await uploadSingleProductImage(file, (progress) => {
      console.log(`Product upload progress: ${progress}%`);
    });

    console.log("Product image URL:", result.data.url);
    return result.data.url;
  } catch (error) {
    console.error("Product upload failed:", error);
  }
};
```

### 5. رفع عدة صور منتجات

```javascript
const { uploadProductImages } = useUpload();

const handleMultipleProductUpload = async (files) => {
  try {
    const results = await uploadProductImages(files, (progress) => {
      console.log(`Multiple products upload progress: ${progress}%`);
    });

    console.log("Product images URLs:", results);
    return results;
  } catch (error) {
    console.error("Multiple products upload failed:", error);
  }
};
```

### 2. رفع عدة صور

```javascript
const { uploadImages } = useUpload();

const handleMultipleUpload = async (files) => {
  try {
    const results = await uploadImages(
      files,
      (progress) => {
        console.log(`Upload progress: ${progress}%`);
      },
      {
        folder: "gallery",
      }
    );

    console.log("Uploaded images:", results);
  } catch (error) {
    console.error("Upload failed:", error);
  }
};
```

### 3. رفع صور المنتجات

```javascript
const { uploadProductImages } = useUpload();

const handleProductImages = async (files, productId) => {
  try {
    const results = await uploadProductImages(
      files,
      (progress) => {
        console.log(`Upload progress: ${progress}%`);
      },
      {
        folder: "products",
        productId: productId,
      }
    );

    console.log("Product images uploaded:", results);
  } catch (error) {
    console.error("Upload failed:", error);
  }
};
```

### 4. الحصول على URL محسن للصورة

```javascript
const { getOptimizedImageUrl } = useUpload();

const getImageUrl = (imagePath) => {
  return getOptimizedImageUrl(imagePath, {
    width: 800,
    height: 600,
    quality: 0.8,
    format: "webp",
  });
};
```

## الميزات الجديدة

### 1. التحقق من صحة الملفات

- التحقق من نوع الملف
- التحقق من حجم الملف
- دعم أنواع الملفات: JPEG, PNG, WebP, GIF

### 2. ضغط الصور التلقائي

- ضغط الصور الكبيرة تلقائياً
- تحسين الجودة والحجم
- دعم التحويل إلى WebP

### 3. تتبع التقدم

- عرض نسبة التقدم أثناء الرفع
- دعم callback للتقدم
- معالجة الأخطاء

### 4. إدارة الملفات

- حذف الملفات من السحابة
- الحصول على URLs محسنة
- تنظيم الملفات في مجلدات

## إعداد Backend

تأكد من أن backend يدعم الـ endpoints التالية:

```
POST /upload/category-image  - رفع صورة فئة
POST /upload/brand-image     - رفع صورة ماركة
POST /upload/banner-image    - رفع صورة بانر
POST /upload/product-image   - رفع صورة منتج واحدة
POST /upload/product-images  - رفع عدة صور منتجات
POST /upload/image           - رفع صورة عامة
POST /upload/images          - رفع عدة صور عامة
POST /upload/cloud           - رفع إلى السحابة
GET  /upload/cloud/:id/url   - الحصول على URL محسن
DELETE /upload/:id           - حذف صورة
DELETE /upload/cloud/:id     - حذف من السحابة
```

### مثال على Backend Controller (NestJS):

```typescript
@Controller("upload")
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post("category-image")
  @UseInterceptors(FileInterceptor("file"))
  async uploadCategoryImage(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException("No file uploaded");
    }

    const uploadedFile = await this.uploadService.saveFile(
      file,
      UploadFolder.CATEGORIES
    );
    return this.responseService.success(
      uploadedFile,
      "تم رفع صورة الفئة بنجاح"
    );
  }

  @Post("brand-image")
  @UseInterceptors(FileInterceptor("file"))
  async uploadBrandImage(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException("No file uploaded");
    }

    const uploadedFile = await this.uploadService.saveFile(
      file,
      UploadFolder.BRANDS
    );
    return this.responseService.success(
      uploadedFile,
      "تم رفع صورة الماركة بنجاح"
    );
  }

  @Post("banner-image")
  @UseInterceptors(FileInterceptor("file"))
  async uploadBannerImage(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException("No file uploaded");
    }

    const uploadedFile = await this.uploadService.saveFile(
      file,
      UploadFolder.BANNERS
    );
    return this.responseService.success(
      uploadedFile,
      "تم رفع صورة البانر بنجاح"
    );
  }

  @Post("product-image")
  @UseInterceptors(FileInterceptor("file"))
  async uploadProductImage(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException("No file uploaded");
    }

    const uploadedFile = await this.uploadService.saveFile(
      file,
      UploadFolder.PRODUCTS
    );
    return this.responseService.success(
      uploadedFile,
      "تم رفع صورة المنتج بنجاح"
    );
  }
}
```

## نصائح للاستخدام

1. **تحسين الأداء**: استخدم ضغط الصور لتقليل حجم الملفات
2. **الأمان**: لا تعرض مفاتيح API في الكود الأمامي
3. **التخزين**: نظم الملفات في مجلدات منطقية
4. **المراقبة**: راقب استخدام التخزين السحابي
5. **النسخ الاحتياطي**: تأكد من وجود نسخ احتياطية للملفات المهمة

## استكشاف الأخطاء

### خطأ في الرفع

- تحقق من صحة مفاتيح API
- تأكد من إعدادات CORS
- تحقق من حجم الملفات

### خطأ في الوصول

- تحقق من صلاحيات الحساب السحابي
- تأكد من إعدادات الأمان
- تحقق من URLs الصحيحة

### مشاكل الأداء

- استخدم ضغط الصور
- قلل من حجم الملفات
- استخدم CDN إذا أمكن
