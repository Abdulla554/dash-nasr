import React, { useState } from 'react';
import { FaTimes, FaDollarSign, FaExchangeAlt } from 'react-icons/fa';

const ExchangeRateModal = ({ isOpen, onClose, onUpdateRate, currentRate }) => {
    const [rate, setRate] = useState(currentRate.toString());
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const numRate = parseFloat(rate);

        if (isNaN(numRate) || numRate <= 0) {
            setError('يرجى إدخال سعر صرف صحيح');
            return;
        }

        if (numRate < 100 || numRate > 10000) {
            setError('سعر الصرف يجب أن يكون بين 100 و 10000');
            return;
        }

        onUpdateRate(numRate);
        setError('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <FaExchangeAlt className="text-blue-600 dark:text-blue-400 w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                            تحديث سعر الصرف
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <FaTimes className="text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            سعر الدولار بالدينار العراقي
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaDollarSign className="text-gray-400" />
                            </div>
                            <input
                                type="number"
                                value={rate}
                                onChange={(e) => {
                                    setRate(e.target.value);
                                    setError('');
                                }}
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${error
                                    ? 'border-red-300 dark:border-red-600'
                                    : 'border-gray-300 dark:border-slate-600'
                                    } bg-white dark:bg-slate-700 text-gray-900 dark:text-white`}
                                placeholder="مثال: 1500"
                                min="100"
                                max="10000"
                                step="0.01"
                            />
                        </div>
                        {error && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
                        )}
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                            <FaExchangeAlt className="w-4 h-4" />
                            <span>مثال: 1 دولار = {rate || '1500'} دينار عراقي</span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors font-medium"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                        >
                            <FaExchangeAlt className="w-4 h-4" />
                            تحديث
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExchangeRateModal;
