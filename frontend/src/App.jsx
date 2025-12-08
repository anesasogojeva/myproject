import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// Layout
import Header from "./components/UI/Header";
import MiniCart from "./components/UI/MiniCart";
import Footer from "./components/Layout/Footer";

//Admin
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Users from "./pages/Admin/Users";
import Products from "./pages/Admin/Products";
import Orders from "./pages/Admin/Orders";

// Context
import { CartProvider } from "./context/CartContext";

// Pages
import HomePage from "./pages/User/HomePage";
import ProductsPage from "./pages/User/ProductsPage";
import CartPage from "./pages/User/CartPage";
import CheckoutPage from "./pages/User/CheckoutPage";
import AboutPage from "./pages/User/AboutPage";
import ProductPage from "./pages/User/ProductPage";
// Auth
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import ForgotPasswordPage from "./pages/Auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/Auth/ResetPasswordPage";

// Protected Route
import ProtectedRoute from "./components/Auth/ProtectedRoute";

function AppContent() {
  const [miniCartOpen, setMiniCartOpen] = useState(false);

  return (
    <>
      <Header setMiniCartOpen={setMiniCartOpen} />
      <MiniCart open={miniCartOpen} setOpen={setMiniCartOpen} />

      <div className="pt-24">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />

          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/admin" element={<AdminDashboard />}>
        <Route path="users" element={<Users />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />
        {/* <Route path="contacts" element={<Contacts />} /> */}
        </Route>
        </Routes>

        <Footer />
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </BrowserRouter>
  );
}
