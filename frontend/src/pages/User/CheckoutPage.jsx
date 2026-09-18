// src/pages/User/CheckoutPage.jsx
import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import useAuth from "../../hooks/useAuth";
import { createCheckoutSession } from "../../api/paymentApi";
import { createCODOrder } from "../../api/codApi";
import { Minus, Plus, Trash2, CheckCircle2, CreditCard, Wallet } from "lucide-react";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import { Textarea } from "../../components/UI/FormField";
import Modal from "../../components/UI/Modal";
import { PageSpinner } from "../../components/UI/Spinner";
import EmptyState from "../../components/UI/EmptyState";
import { ShoppingBag } from "lucide-react";

export default function CheckoutPage() {
  const { token } = useAuth();
  const toast = useToast();
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [codLoading, setCodLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (cart) setLoading(false);
  }, [cart]);

  if (loading) return <PageSpinner label="Loading checkout..." />;

  if (!cart?.length && !showSuccess) {
    return (
      <div className="container-app py-14">
        <Card>
          <EmptyState
            icon={ShoppingBag}
            title="Your cart is empty"
            description="Add some products before proceeding to checkout."
          />
        </Card>
      </div>
    );
  }

  const subtotal = cart.reduce((sum, item) => sum + item.quantity * item.Product.price, 0);
  const shippingCost = 5;
  const total = subtotal + shippingCost;

  const handleStripeCheckout = async () => {
    if (!token) return toast.error("You must be logged in to checkout.");
    if (!address.trim()) return toast.error("Please enter your shipping address.");

    try {
      setCheckoutLoading(true);
      const { url } = await createCheckoutSession(token, address);

      if (url) {
        window.location.href = url;
      } else {
        toast.error("Failed to create Stripe checkout session.");
      }
    } catch (err) {
      console.error("Stripe error:", err);
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleCOD = async () => {
    if (!token) return toast.error("You must be logged in to checkout.");
    if (!address.trim()) return toast.error("Please enter your shipping address.");

    try {
      setCodLoading(true);
      await createCODOrder(token, address);
      clearCart();
      setShowSuccess(true);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setCodLoading(false);
    }
  };

  return (
    <div className="container-app py-10 sm:py-14">
      <h1 className="text-3xl sm:text-4xl font-display font-bold text-stone-900 mb-8">Checkout</h1>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        <Card className="md:col-span-2">
          <h2 className="text-lg font-display font-bold text-stone-900 mb-5">Cart Items</h2>
          <div className="divide-y divide-stone-100">
            {cart.map((item) => (
              <div key={item.id} className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-4 py-4">
                <div className="min-w-0">
                  <p className="font-medium text-stone-800">{item.Product.name}</p>
                  <p className="text-sm text-stone-400">
                    ${item.Product.price.toFixed(2)} × {item.quantity}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center border border-stone-200 rounded-lg hover:border-emerald-400 transition"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center border border-stone-200 rounded-lg hover:border-emerald-400 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-2 text-rose-500 hover:text-rose-600 transition"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="font-bold text-stone-900 ml-auto">
                  ${(item.quantity * item.Product.price).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-display font-bold text-stone-900 mb-4">Order Summary</h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-stone-500">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-stone-500">
              <span>Shipping</span>
              <span>${shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-stone-900 text-base pt-2 border-t border-stone-100">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-5">
            <Textarea
              label="Shipping Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street, City, Country"
              rows={3}
            />
          </div>

          <div className="mt-5 space-y-3">
            <Button
              onClick={handleStripeCheckout}
              loading={checkoutLoading}
              fullWidth
              size="lg"
              icon={CreditCard}
            >
              Pay with Card
            </Button>

            <Button
              onClick={handleCOD}
              loading={codLoading}
              fullWidth
              size="lg"
              variant="outline"
              icon={Wallet}
            >
              Cash on Delivery
            </Button>
          </div>
        </Card>
      </div>

      <Modal open={showSuccess} onClose={() => setShowSuccess(false)} size="sm">
        <div className="flex flex-col items-center text-center py-2">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-emerald-100 rounded-full">
            <CheckCircle2 className="w-8 h-8 text-emerald-700" />
          </div>
          <h2 className="text-xl font-display font-bold text-stone-900">Order Confirmed!</h2>
          <p className="text-stone-500 mt-2">
            Your order has been placed successfully. Please prepare payment when the product arrives.
          </p>
          <Button
            fullWidth
            size="lg"
            className="mt-6"
            onClick={() => (window.location.href = "/payment-success")}
          >
            Continue
          </Button>
        </div>
      </Modal>
    </div>
  );
}
