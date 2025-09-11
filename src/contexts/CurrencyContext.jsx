import React, { useState, useEffect, useContext } from 'react';
import { CurrencyContext } from './CurrencyContext';

export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState(() => {
        return localStorage.getItem('currency') || 'USD';
    });

    const [exchangeRate, setExchangeRate] = useState(() => {
        const saved = localStorage.getItem('usdToIqdRate');
        return saved ? parseFloat(saved) : 1500; // Default rate
    });

    const [showExchangeModal, setShowExchangeModal] = useState(false);

    useEffect(() => {
        localStorage.setItem('currency', currency);
    }, [currency]);

    useEffect(() => {
        localStorage.setItem('usdToIqdRate', exchangeRate.toString());
    }, [exchangeRate]);

    const toggleCurrency = () => {
        if (currency === 'USD') {
            setShowExchangeModal(true);
        } else {
            setCurrency('USD');
        }
    };

    const updateExchangeRate = (rate) => {
        setExchangeRate(rate);
        setCurrency('IQD');
        setShowExchangeModal(false);
    };

    const convertCurrency = (amount) => {
        if (currency === 'USD') {
            return amount;
        } else {
            return (amount * exchangeRate).toFixed(0);
        }
    };

    const getCurrencySymbol = () => {
        return currency === 'USD' ? '$' : 'د.ع';
    };

    const getCurrencyCode = () => {
        return currency === 'USD' ? 'USD' : 'IQD';
    };

    const value = {
        currency,
        exchangeRate,
        showExchangeModal,
        setShowExchangeModal,
        toggleCurrency,
        updateExchangeRate,
        convertCurrency,
        getCurrencySymbol,
        getCurrencyCode,
    };

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    );
};

// Custom hook to use currency context
export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};
