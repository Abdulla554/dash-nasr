import { useState } from "react";
import { api } from "../lib/axios";
import {
  cloudConfig,
  validateFile,
  compressImage,
  getImageUrl,
} from "../config/cloudConfig";

export const useUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadImage = async (file, onProgress = null, options = {}) => {
    try {
      setUploading(true);
      setProgress(0);

      // التحقق من صحة الملف
      const validation = validateFile(file);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(", "));
      }

      // ضغط الصورة إذا كانت كبيرة
      let fileToUpload = file;
      if (
        file.size >
        cloudConfig.upload.compression.maxWidth *
          cloudConfig.upload.compression.maxHeight
      ) {
        fileToUpload = await compressImage(
          file,
          cloudConfig.upload.compression
        );
      }

      // إنشاء FormData للرفع
      const formData = new FormData();
      formData.append("image", fileToUpload);

      // إضافة خيارات إضافية
      if (options.folder) formData.append("folder", options.folder);
      if (options.publicId) formData.append("publicId", options.publicId);

      // رفع الصورة إلى السحابة
      const response = await api.uploadImage(formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
          if (onProgress) onProgress(percentCompleted);
        },
      });

      console.log("Cloud upload successful:", response.data);
      // إرجاع URL مباشرة بدلاً من الكائن كاملاً
      return response.data.data?.url || response.data.url || response.data;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const uploadImages = async (files, onProgress = null, options = {}) => {
    try {
      setUploading(true);
      setProgress(0);

      // التحقق من صحة الملفات
      const validationErrors = [];
      for (const file of files) {
        const validation = validateFile(file);
        if (!validation.isValid) {
          validationErrors.push(...validation.errors);
        }
      }

      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(", "));
      }

      // ضغط الصور الكبيرة
      const processedFiles = await Promise.all(
        files.map(async (file) => {
          if (
            file.size >
            cloudConfig.upload.compression.maxWidth *
              cloudConfig.upload.compression.maxHeight
          ) {
            return await compressImage(file, cloudConfig.upload.compression);
          }
          return file;
        })
      );

      // إنشاء FormData لرفع عدة صور
      const formData = new FormData();
      processedFiles.forEach((file) => {
        formData.append(`images`, file);
      });

      // إضافة خيارات إضافية
      if (options.folder) formData.append("folder", options.folder);

      // رفع الصور إلى السحابة
      const response = await api.uploadImages(formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
          if (onProgress) onProgress(percentCompleted);
        },
      });

      console.log("Cloud upload images successful:", response.data);
      // إرجاع URLs مباشرة بدلاً من الكائن كاملاً
      if (Array.isArray(response.data)) {
        return response.data.map((item) => item.data?.url || item.url || item);
      }
      return response.data.data?.url || response.data.url || response.data;
    } catch (error) {
      console.error("Upload images error:", error);
      throw error;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const deleteImage = async (imageId) => {
    try {
      const response = await api.deleteImage(imageId);
      console.log("Cloud delete image successful:", response.data);
      return response.data;
    } catch (error) {
      console.error("Delete image error:", error);
      throw error;
    }
  };

  // دالة مخصصة لرفع صور المنتجات (رفع كل صورة على حدة)
  const uploadProductImages = async (
    files,
    onProgress = null,
    options = {}
  ) => {
    try {
      setUploading(true);
      setProgress(0);

      // التحقق من صحة الملفات
      const validationErrors = [];
      for (const file of files) {
        const validation = validateFile(file);
        if (!validation.isValid) {
          validationErrors.push(...validation.errors);
        }
      }

      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(", "));
      }

      // ضغط الصور الكبيرة
      const processedFiles = await Promise.all(
        files.map(async (file) => {
          if (
            file.size >
            cloudConfig.upload.compression.maxWidth *
              cloudConfig.upload.compression.maxHeight
          ) {
            return await compressImage(file, cloudConfig.upload.compression);
          }
          return file;
        })
      );

      // رفع كل صورة على حدة
      const uploadPromises = processedFiles.map(async (file, index) => {
        const formData = new FormData();
        formData.append("file", file);

        // إضافة خيارات إضافية
        if (options.folder)
          formData.append("folder", options.folder || "products");
        if (options.productId) formData.append("productId", options.productId);

        const response = await api.uploadProductImage(formData, {
          onUploadProgress: (progressEvent) => {
            const fileProgress = ((index + 1) / processedFiles.length) * 100;
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            const totalProgress = Math.round(
              (fileProgress + percentCompleted) / 2
            );
            setProgress(totalProgress);
            if (onProgress) onProgress(totalProgress);
          },
        });

        return response.data.data?.url || response.data.url || response.data;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setProgress(100);
      if (onProgress) onProgress(100);

      console.log("Cloud upload product images successful:", uploadedUrls);
      return uploadedUrls;
    } catch (error) {
      console.error("Upload product images error:", error);
      throw error;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  // دالة للحصول على URL محسن للصورة
  const getOptimizedImageUrl = (imagePath, options = {}) => {
    return getImageUrl(imagePath, options);
  };

  // دوال محددة لرفع صور أنواع مختلفة من المحتوى
  const uploadCategoryImage = async (file, onProgress = null) => {
    try {
      setUploading(true);
      setProgress(0);

      // التحقق من صحة الملف
      const validation = validateFile(file);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(", "));
      }

      // ضغط الصورة إذا كانت كبيرة
      let fileToUpload = file;
      if (
        file.size >
        cloudConfig.upload.compression.maxWidth *
          cloudConfig.upload.compression.maxHeight
      ) {
        fileToUpload = await compressImage(
          file,
          cloudConfig.upload.compression
        );
      }

      // إنشاء FormData للرفع
      const formData = new FormData();
      formData.append("file", fileToUpload);

      // رفع صورة الفئة
      const response = await api.uploadCategoryImage(formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
          if (onProgress) onProgress(percentCompleted);
        },
      });

      console.log("Category image upload successful:", response.data);
      // إرجاع URL مباشرة بدلاً من الكائن كاملاً
      return response.data.data?.url || response.data.url || response.data;
    } catch (error) {
      console.error("Category image upload error:", error);
      throw error;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const uploadBrandImage = async (file, onProgress = null) => {
    try {
      setUploading(true);
      setProgress(0);

      // التحقق من صحة الملف
      const validation = validateFile(file);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(", "));
      }

      // ضغط الصورة إذا كانت كبيرة
      let fileToUpload = file;
      if (
        file.size >
        cloudConfig.upload.compression.maxWidth *
          cloudConfig.upload.compression.maxHeight
      ) {
        fileToUpload = await compressImage(
          file,
          cloudConfig.upload.compression
        );
      }

      // إنشاء FormData للرفع
      const formData = new FormData();
      formData.append("file", fileToUpload);

      // رفع صورة الماركة
      const response = await api.uploadBrandImage(formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
          if (onProgress) onProgress(percentCompleted);
        },
      });

      console.log("Brand image upload successful:", response.data);
      // إرجاع URL مباشرة بدلاً من الكائن كاملاً
      return response.data.data?.url || response.data.url || response.data;
    } catch (error) {
      console.error("Brand image upload error:", error);
      throw error;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const uploadBannerImage = async (file, onProgress = null) => {
    try {
      setUploading(true);
      setProgress(0);

      // التحقق من صحة الملف
      const validation = validateFile(file);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(", "));
      }

      // ضغط الصورة إذا كانت كبيرة
      let fileToUpload = file;
      if (
        file.size >
        cloudConfig.upload.compression.maxWidth *
          cloudConfig.upload.compression.maxHeight
      ) {
        fileToUpload = await compressImage(
          file,
          cloudConfig.upload.compression
        );
      }

      // إنشاء FormData للرفع
      const formData = new FormData();
      formData.append("file", fileToUpload);

      // رفع صورة البانر
      const response = await api.uploadBannerImage(formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
          if (onProgress) onProgress(percentCompleted);
        },
      });

      console.log("Banner image upload successful:", response.data);
      // إرجاع URL مباشرة بدلاً من الكائن كاملاً
      return response.data.data?.url || response.data.url || response.data;
    } catch (error) {
      console.error("Banner image upload error:", error);
      throw error;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const uploadSingleProductImage = async (file, onProgress = null) => {
    try {
      setUploading(true);
      setProgress(0);

      // التحقق من صحة الملف
      const validation = validateFile(file);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(", "));
      }

      // ضغط الصورة إذا كانت كبيرة
      let fileToUpload = file;
      if (
        file.size >
        cloudConfig.upload.compression.maxWidth *
          cloudConfig.upload.compression.maxHeight
      ) {
        fileToUpload = await compressImage(
          file,
          cloudConfig.upload.compression
        );
      }

      // إنشاء FormData للرفع
      const formData = new FormData();
      formData.append("file", fileToUpload);

      // رفع صورة المنتج
      const response = await api.uploadProductImage(formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
          if (onProgress) onProgress(percentCompleted);
        },
      });

      console.log("Product image upload successful:", response.data);
      // إرجاع URL مباشرة بدلاً من الكائن كاملاً
      return response.data.data?.url || response.data.url || response.data;
    } catch (error) {
      console.error("Product image upload error:", error);
      throw error;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return {
    uploading,
    progress,
    uploadImage,
    uploadImages,
    uploadProductImages,
    deleteImage,
    getOptimizedImageUrl,
    // دوال محددة للأنواع المختلفة
    uploadCategoryImage,
    uploadBrandImage,
    uploadBannerImage,
    uploadSingleProductImage,
  };
};
