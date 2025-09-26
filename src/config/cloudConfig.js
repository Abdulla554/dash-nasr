// إعدادات الرفع للفرونت إند فقط
export const cloudConfig = {
  // إعدادات عامة للرفع
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    maxFiles: 10,
    compression: {
      quality: 0.8,
      maxWidth: 1920,
      maxHeight: 1080,
    },
  },
};

// دالة للحصول على URL الصورة (مبسطة)
export const getImageUrl = (imagePath) => {
  // إرجاع URL الصورة كما هو (الباك إند يتعامل مع التحسينات)
  return imagePath;
};

// دالة لضغط الصور قبل الرفع
export const compressImage = (file, options = {}) => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      const { maxWidth = 1920, maxHeight = 1080, quality = 0.8 } = options;

      let { width, height } = img;

      // حساب الأبعاد الجديدة
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = width * ratio;
        height = height * ratio;
      }

      canvas.width = width;
      canvas.height = height;

      // رسم الصورة المضغوطة
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(resolve, "image/jpeg", quality);
    };

    img.src = URL.createObjectURL(file);
  });
};

// دالة للتحقق من صحة الملف
export const validateFile = (file) => {
  const { maxFileSize, allowedTypes } = cloudConfig.upload;
  const errors = [];

  if (!allowedTypes.includes(file.type)) {
    errors.push("نوع الملف غير مدعوم");
  }

  if (file.size > maxFileSize) {
    errors.push(
      `حجم الملف كبير جداً (الحد الأقصى: ${Math.round(
        maxFileSize / 1024 / 1024
      )}MB)`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
