import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Sidebar from "./components/Sidebars";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Auth/login";
import AllProduct from "./pages/Product/All-Product";
import AddProduct from "./pages/Product/Add-Products";
import ProductDetails from "./pages/Product/Product-Details";
import AllCategories from "./pages/Categories/All-Categories";
import AddCategorie from "./pages/Categories/Add-Categories";
import AllBrands from "./pages/Brands/All-brands";
import AddBrand from "./pages/Brands/Add-brands";
import AddBanner from "./pages/Banner/Add-Banner";
import AllBanner from "./pages/Banner/All-Banner";
import AllOrders from "./pages/Orders/All-Orders";
import OrderDetails from "./pages/Orders/Order-Details";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import { CurrencyProvider } from "./contexts/CurrencyContext.jsx";




const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token");

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64">
        {children}
      </main>
    </div>
  );
};

const queryClient = new QueryClient();

export default function App() {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <QueryClientProvider client={queryClient}>
          <ToastContainer position="top-center" rtl={true} theme="colored" />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <AllProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/add"
              element={
                <ProtectedRoute>
                  <AddProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/:id"
              element={
                <ProtectedRoute>
                  <ProductDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/categories"
              element={
                <ProtectedRoute>
                  <AllCategories />
                </ProtectedRoute>
              }
            />
            <Route
              path="/categories/add"
              element={
                <ProtectedRoute>
                  <AddCategorie />
                </ProtectedRoute>
              }
            />
            <Route
              path="/brands"
              element={
                <ProtectedRoute>
                  <AllBrands />
                </ProtectedRoute>
              }
            />
            <Route
              path="/brands/add"
              element={
                <ProtectedRoute>
                  <AddBrand />
                </ProtectedRoute>
              }
            />
            <Route
              path="/banner"
              element={
                <ProtectedRoute>
                  <AllBanner />
                </ProtectedRoute>
              }
            />
            <Route
              path="/banner/add"
              element={
                <ProtectedRoute>
                  <AddBanner />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <AllOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <ProtectedRoute>
                  <OrderDetails />
                </ProtectedRoute>
              }
            />
          </Routes>
        </QueryClientProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
}
