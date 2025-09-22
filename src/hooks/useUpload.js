import { useState } from 'react';
import { api } from '../lib/axios.jsx';

export const useUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadImage = async (file, onProgress = null) => {
    try {
      setUploading(true);
      setProgress(0);

      const formData = new FormData();
      formData.append('image', file);

      const response = await api.uploadImage(formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
          if (onProgress) onProgress(percentCompleted);
        }
      });

      return response.data.data;
    } catch (err) {
      throw err;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const uploadImages = async (files, onProgress = null) => {
    try {
      setUploading(true);
      setProgress(0);

      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`images`, file);
      });

      const response = await api.uploadImages(formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
          if (onProgress) onProgress(percentCompleted);
        }
      });

      return response.data.data;
    } catch (err) {
      throw err;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const deleteImage = async (imageId) => {
    try {
      await api.deleteImage(imageId);
    } catch (err) {
      throw err;
    }
  };

  return {
    uploading,
    progress,
    uploadImage,
    uploadImages,
    deleteImage
  };
};

// Utility function to compress images before upload
export const compressImage = async (file, maxWidth = 800, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(resolve, 'image/jpeg', quality);
    };

    img.src = URL.createObjectURL(file);
  });
};

// Utility function to validate file type and size
export const validateFile = (file, allowedTypes = ['image/jpeg', 'image/png', 'image/webp'], maxSize = 5 * 1024 * 1024) => {
  const errors = [];

  if (!allowedTypes.includes(file.type)) {
    errors.push('نوع الملف غير مدعوم');
  }

  if (file.size > maxSize) {
    errors.push('حجم الملف كبير جداً');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
