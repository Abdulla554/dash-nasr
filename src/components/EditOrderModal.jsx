import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { X, Save, User, Mail, Phone, MapPin, DollarSign, FileText, Plus, Package, Search } from 'lucide-react';
import { useProducts } from '../hooks/useProducts.js';

export default function EditOrderModal({ isOpen, onClose, order, onSave }) {
    const [formData, setFormData] = useState({
        status: '',
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        location: '',
        totalAmount: 0,
        notes: '',
        items: []
    });

    const [showAddProduct, setShowAddProduct] = useState(false);
    const [newProduct, setNewProduct] = useState({
        productId: '',
        quantity: 1
    });

    // استخدام useProducts hook
    const { products, loading: loadingProducts, fetchProducts } = useProducts();

    useEffect(() => {
        if (order) {
            setFormData({
                status: order.status || '',
                customerName: order.customerName || '',
                customerEmail: order.customerEmail || '',
                customerPhone: order.customerPhone || '',
                location: order.location || '',
                totalAmount: order.totalAmount || order.total || 0,
                notes: order.notes || '',
                items: order.items || []
            });
        }
    }, [order]);

    useEffect(() => {
        if (isOpen && products.length === 0) {
            fetchProducts();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]); // جلب المنتجات فقط إذا لم تكن موجودة

    const handleSubmit = (e) => {
        e.preventDefault();

        // تنظيف البيانات قبل الإرسال - إرسال جميع الحقول
        const cleanFormData = {
            status: formData.status === 'PROCESSING' ? 'CONFIRMED' : formData.status, // تحويل PROCESSING إلى CONFIRMED
            customerName: formData.customerName,
            customerEmail: formData.customerEmail,
            customerPhone: formData.customerPhone,
            location: formData.location,
            totalAmount: parseFloat(formData.totalAmount) || 0,
            notes: formData.notes,
            // تنظيف العناصر - إزالة الخصائص غير المسموحة
            items: (formData.items || []).map(item => ({
                productId: item.productId || item.product?.id,
                quantity: parseInt(item.quantity) || 1,
                price: parseFloat(item.price) || 0,
                notes: item.notes || ''
            }))
        };

        console.log('Cleaned form data:', cleanFormData); // للتأكد من البيانات
        onSave(cleanFormData);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddProduct = () => {
        if (newProduct.productId && newProduct.quantity > 0) {
            const selectedProduct = products.find(p => p.id === newProduct.productId);
            if (selectedProduct) {
                const product = {
                    id: Date.now().toString(),
                    productId: selectedProduct.id,
                    name: selectedProduct.name,
                    brand: selectedProduct.brand?.name || selectedProduct.brand,
                    price: parseFloat(selectedProduct.price),
                    quantity: parseInt(newProduct.quantity),
                    product: {
                        id: selectedProduct.id,
                        name: selectedProduct.name,
                        brand: { name: selectedProduct.brand?.name || selectedProduct.brand }
                    }
                };

                setFormData(prev => ({
                    ...prev,
                    items: [...(prev.items || []), product]
                }));

                // إعادة تعيين نموذج المنتج الجديد
                setNewProduct({
                    productId: '',
                    quantity: 1
                });

                setShowAddProduct(false);
            }
        }
    };

    const handleRemoveProduct = (productId) => {
        setFormData(prev => ({
            ...prev,
            items: (prev.items || []).filter(item => item.id !== productId)
        }));
    };

    const handleProductChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">تعديل الطلب</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <X size={24} className="text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* تنبيه للمستخدم */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <div className="flex items-center">
                            <div className="text-yellow-600 mr-3">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-yellow-800">تنبيه مهم</h3>
                                <p className="text-sm text-yellow-700 mt-1">
                                    يمكن تعديل جميع تفاصيل الطلب: الحالة، معلومات العميل، المبلغ، الملاحظات، والمنتجات.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            حالة الطلب
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-xl  text-gray-700 focus:ring-2 focus:ring-[#2C6D90] focus:border-transparent"
                        >
                            <option value="PENDING">في الانتظار</option>
                            <option value="CONFIRMED">مؤكد</option>
                            <option value="SHIPPED">تم الشحن</option>
                            <option value="DELIVERED">تم التسليم</option>
                            <option value="CANCELLED">ملغي</option>
                        </select>
                    </div>

                    {/* Customer Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <User size={16} className="inline mr-2" />
                                اسم العميل
                            </label>
                            <input
                                type="text"
                                name="customerName"
                                value={formData.customerName}
                                onChange={handleChange}
                                className="w-full p-3 border    border-gray-300 rounded-xl  text-gray-700 focus:ring-2 focus:ring-[#2C6D90] focus:border-transparent"
                                placeholder="اسم العميل"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <Mail size={16} className="inline mr-2" />
                                البريد الإلكتروني
                            </label>
                            <input
                                type="email"
                                name="customerEmail"
                                value={formData.customerEmail}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-xl  text-gray-700 focus:ring-2 focus:ring-[#2C6D90] focus:border-transparent"
                                placeholder="البريد الإلكتروني"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <Phone size={16} className="inline mr-2" />
                                رقم الهاتف
                            </label>
                            <input
                                type="tel"
                                name="customerPhone"
                                value={formData.customerPhone}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-xl  text-gray-700 focus:ring-2 focus:ring-[#2C6D90] focus:border-transparent"
                                placeholder="رقم الهاتف"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <MapPin size={16} className="inline mr-2" />
                                العنوان
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-xl  text-gray-700 focus:ring-2 focus:ring-[#2C6D90] focus:border-transparent"
                                placeholder="العنوان"
                            />
                        </div>
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <DollarSign size={16} className="inline mr-2" />
                            المبلغ الإجمالي (د.ع)
                        </label>
                        <input
                            type="number"
                            name="totalAmount"
                            value={formData.totalAmount}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-xl  text-gray-700 focus:ring-2 focus:ring-[#2C6D90] focus:border-transparent"
                            placeholder="المبلغ الإجمالي"
                            step="0.01"
                        />
                    </div>

                    {/* Products Section */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <label className="block text-sm font-semibold text-gray-700">
                                <Package size={16} className="inline mr-2" />
                                منتجات الطلب
                            </label>
                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowAddProduct(!showAddProduct)}
                                className="flex items-center gap-2 px-4 py-2 bg-[#2C6D90] text-white rounded-xl font-semibold hover:bg-[#2C6D90]/90 transition-colors"
                            >
                                <Plus size={16} />
                                إضافة منتج
                            </motion.button>
                        </div>

                        {/* Add Product Form */}
                        {showAddProduct && (
                            <div className="mb-4 p-4 bg-gray-50 rounded-xl border-2 border-[#2C6D90]/20">
                                <h4 className="text-lg font-semibold text-gray-800 mb-3">إضافة منتج جديد</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            <Search size={16} className="inline mr-2" />
                                            اختر المنتج
                                        </label>
                                        {loadingProducts ? (
                                            <div className="w-full p-3 border border-gray-300 rounded-xl bg-gray-100 flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#2C6D90]"></div>
                                                <span className="mr-2">جاري تحميل المنتجات...</span>
                                            </div>
                                        ) : (
                                            <select
                                                name="productId"
                                                value={newProduct.productId}
                                                onChange={handleProductChange}
                                                className="w-full p-3 border border-gray-300 rounded-xl  text-gray-700 focus:ring-2 focus:ring-[#2C6D90] focus:border-transparent"
                                            >
                                                <option value="">اختر منتج من القائمة</option>
                                                {products.map((product) => (
                                                    <option key={product.id} value={product.id}>
                                                        {product.name} - {product.brand?.name || product.brand} - {product.price?.toLocaleString()} د.ع
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            الكمية
                                        </label>
                                        <input
                                            type="number"
                                            name="quantity"
                                            value={newProduct.quantity}
                                            onChange={handleProductChange}
                                            className="w-full p-3 border border-gray-300 rounded-xl  text-gray-700 focus:ring-2 focus:ring-[#2C6D90] focus:border-transparent"
                                            placeholder="الكمية"
                                            min="1"
                                        />
                                    </div>
                                </div>

                                {/* عرض تفاصيل المنتج المختار */}
                                {newProduct.productId && (
                                    <div className="mt-4 p-3 bg-white rounded-xl border border-gray-200">
                                        {(() => {
                                            const selectedProduct = products.find(p => p.id === newProduct.productId);
                                            return selectedProduct ? (
                                                <div>
                                                    <div className="font-semibold text-gray-800">{selectedProduct.name}</div>
                                                    <div className="text-sm text-gray-600">
                                                        الماركة: {selectedProduct.brand?.name || selectedProduct.brand} •
                                                        السعر: {selectedProduct.price?.toLocaleString()} د.ع •
                                                        الكمية: {newProduct.quantity}
                                                    </div>
                                                    <div className="text-sm font-bold text-[#2C6D90] mt-1">
                                                        المجموع: {(selectedProduct.price * newProduct.quantity).toLocaleString()} د.ع
                                                    </div>
                                                </div>
                                            ) : null;
                                        })()}
                                    </div>
                                )}

                                <div className="flex gap-3 mt-4">
                                    <motion.button
                                        type="button"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleAddProduct}
                                        disabled={!newProduct.productId || newProduct.quantity < 1}
                                        className="px-6 py-2 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        إضافة المنتج
                                    </motion.button>
                                    <motion.button
                                        type="button"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setShowAddProduct(false)}
                                        className="px-6 py-2 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-colors"
                                    >
                                        إلغاء
                                    </motion.button>
                                </div>
                            </div>
                        )}

                        {/* Products List */}
                        <div className="space-y-3">
                            {(formData.items || []).map((item, index) => (
                                <div key={item.id || index} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl">
                                    <div className="flex-1">
                                        <div className="font-semibold text-gray-800">{item.name || item.product?.name}</div>
                                        <div className="text-sm text-gray-600">
                                            {item.brand || item.product?.brand?.name} •
                                            الكمية: {item.quantity} •
                                            السعر: {item.price?.toLocaleString()} د.ع
                                        </div>
                                    </div>
                                    <motion.button
                                        type="button"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleRemoveProduct(item.id || index)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <X size={16} />
                                    </motion.button>
                                </div>
                            ))}

                            {(formData.items || []).length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <Package size={48} className="mx-auto mb-2 text-gray-300" />
                                    <p>لا توجد منتجات في هذا الطلب</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <FileText size={16} className="inline mr-2" />
                            ملاحظات
                        </label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={3}
                            className="w-full p-3 border border-gray-300 rounded-xl  text-gray-700 focus:ring-2 focus:ring-[#2C6D90] focus:border-transparent"
                            placeholder="ملاحظات إضافية"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <motion.button
                            type="button"
                            onClick={onClose}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                        >
                            إلغاء
                        </motion.button>
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 px-6 py-3 bg-[#2C6D90] text-white rounded-xl font-semibold hover:bg-[#2C6D90]/90 transition-colors flex items-center justify-center gap-2"
                        >
                            <Save size={20} />
                            حفظ التغييرات
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
