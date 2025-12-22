import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// Layout
import Header from "./components/UI/Header";
import MiniCart from "./components/UI/MiniCart";
import Footer from "./components/Layout/Footer";
import PaymentSuccessPage from "./pages/User/PaymentSuccessPage";
import PaymentCancelPage from "./pages/User/PaymentCancelPage";
import AIPlanner from "./components/AI/AIPlanner";

//Dietitian
import DietitianDashboard from "./pages/Dietitian/DietitianDashboard";
import NotesPage from "./pages/Dietitian/NotesPanel";
import MessagesPage from "./pages/Dietitian/MessagesPage";

//Admin
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Users from "./pages/Admin/Users";
import Products from "./pages/Admin/Products";
import Orders from "./pages/Admin/Orders";
import Contacts from "./pages/Admin/Contacts";

// Context
import { CartProvider } from "./context/CartContext";

// Pages
import HomePage from "./pages/User/HomePage";
import ProductsPage from "./pages/User/ProductsPage";
import CartPage from "./pages/User/CartPage";
import CheckoutPage from "./pages/User/CheckoutPage";
import AboutPage from "./pages/User/AboutPage";
import ProductPage from "./pages/User/ProductPage";
import ChatPage from "./pages/User/ChatPage";
import DieticianInbox from "./pages/Dietitian/DieticianInbox";
import DieticianChatPage from "./pages/Dietitian/DieticianChatPage";
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
          <Route path="/ai-planner" element={<AIPlanner />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />

           <Route path="/dietitian" element={<DietitianDashboard />}>
  <Route path="notes" element={<NotesPage />} />
  
  {/* Inbox list */}
  <Route path="messages" element={<DieticianChatPage />} />

  {/* Chat page */}
  <Route path="chat/:userId" element={<DieticianChatPage />} />
</Route>


          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />
          
<Route path="/chat" element={<ChatPage />} />

          <Route path="/payment-cancel" element={<PaymentCancelPage />} />    
          <Route path="/admin" element={<AdminDashboard />}>
        <Route path="users" element={<Users />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />
         <Route path="contacts" element={<Contacts />} />


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
