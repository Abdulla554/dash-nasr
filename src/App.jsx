import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Sidebar from "./components/Sidebars";
import AllProduct from "./pages/Product/AllProduct";
import AddProduct from "./pages/Product/AddProducts";
import AllCategories from "./pages/Categories/AllCategories";
import AddCategorie from "./pages/Categories/AddCategories";
import AllBrands from "./pages/Brands/All-brands";
import AddBrand from "./pages/Brands/Add-brands";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Auth/login";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token");

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen bg-nsr-dark">
      <Sidebar />
      <main className="flex-1 md:ml-64 bg-nsr-dark">
        {children}
      </main>
    </div>
  );
};

const queryClient = new QueryClient();

export default function App() {
  return (
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
      </Routes>
    </QueryClientProvider>
  );
}
