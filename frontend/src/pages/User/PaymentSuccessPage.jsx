// src/pages/User/PaymentSuccessPage.jsx
import React, { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { useCart } from "../../context/CartContext";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";

export default function PaymentSuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container-app py-20 flex justify-center">
      <Card className="max-w-md w-full text-center" padding="p-10">
        <div className="w-16 h-16 mx-auto mb-5 flex items-center justify-center bg-emerald-100 rounded-full">
          <CheckCircle2 className="w-8 h-8 text-emerald-700" />
        </div>
        <h1 className="text-2xl font-display font-bold text-stone-900 mb-3">Payment Successful</h1>
        <p className="text-stone-500 mb-8">
          Thank you for your purchase! Your order has been completed successfully.
        </p>
        <Button to="/home" fullWidth size="lg">
          Back to Home
        </Button>
      </Card>
    </div>
  );
}
