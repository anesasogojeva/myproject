import React from "react";
import { useCart } from "../../context/CartContext";
import { ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import EmptyState from "../../components/UI/EmptyState";
import ImageWithFallback from "../../components/UI/ImageWithFallback";

export default function CartPage() {
  const { cart, removeFromCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="container-app py-10 sm:py-14">
      <h1 className="text-3xl sm:text-4xl font-display font-bold text-stone-900 mb-8">Your Cart</h1>

      {cart.length === 0 ? (
        <Card>
          <EmptyState
            icon={ShoppingBag}
            title="Your cart is empty"
            description="Looks like you haven't added any healthy products yet."
            action={<Button to="/products">Browse Products</Button>}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={item.id} padding="p-4 sm:p-5" className="flex items-center gap-4">
                <ImageWithFallback
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-stone-100 shrink-0"
                  iconClassName="w-7 h-7"
                />

                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-stone-900 truncate">{item.name}</h2>
                  {item.brand && <p className="text-sm text-stone-400">{item.brand}</p>}
                  <p className="font-bold text-emerald-700 mt-1">${item.price.toFixed(2)}</p>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-stone-300 hover:text-rose-500 transition shrink-0"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </Card>
            ))}
          </div>

          <Card className="lg:sticky lg:top-24">
            <h2 className="text-lg font-display font-bold text-stone-900 mb-4">Order Summary</h2>

            <div className="flex justify-between text-base text-stone-600 mb-6">
              <span>Total</span>
              <span className="text-xl font-bold text-stone-900">${total.toFixed(2)}</span>
            </div>

            <Button to="/checkout" fullWidth size="lg" iconRight={ArrowRight}>
              Proceed to Checkout
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}
