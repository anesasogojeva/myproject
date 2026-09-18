import React from "react";
import { XCircle } from "lucide-react";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";

export default function PaymentCancelPage() {
  return (
    <div className="container-app py-20 flex justify-center">
      <Card className="max-w-md w-full text-center" padding="p-10">
        <div className="w-16 h-16 mx-auto mb-5 flex items-center justify-center bg-rose-100 rounded-full">
          <XCircle className="w-8 h-8 text-rose-600" />
        </div>
        <h1 className="text-2xl font-display font-bold text-stone-900 mb-3">Payment Canceled</h1>
        <p className="text-stone-500 mb-8">
          Your payment was canceled. You can try again or continue shopping.
        </p>
        <Button to="/checkout" fullWidth size="lg">
          Return to Checkout
        </Button>
      </Card>
    </div>
  );
}
