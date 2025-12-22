// CartContext.js
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const token = localStorage.getItem("accessToken");

  // Load cart from backend
  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:5000/api/cart", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setCart(data?.CartItems || []))
      .catch(console.log);
  }, [token]);

  // Add product
  const addToCart = async (product, qty = 1) => {
    if (!token) {
      alert("Please login to add items to cart");
      return;
    }

    const res = await fetch("http://localhost:5000/api/cart/add", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ productId: product.id, quantity: qty }),
    });

    if (!res.ok) return alert("Failed to add to cart");

    const item = await res.json();

    setCart(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) {
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: item.quantity } : i
        );
      }
      return [...prev, { ...item, Product: product }];
    });
  };

  // Remove product
  const removeFromCart = async (cartItemId) => {
    if (!token) return;
    await fetch(`http://localhost:5000/api/cart/${cartItemId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setCart(prev => prev.filter(i => i.id !== cartItemId));
  };

  // Update quantity
  const updateQuantity = async (cartItemId, newQty) => {
    if (!token) return;
    if (newQty < 1) return removeFromCart(cartItemId);

    const cartItem = cart.find(i => i.id === cartItemId);
    if (!cartItem) return;

    const res = await fetch(`http://localhost:5000/api/cart/${cartItemId}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ quantity: newQty }),
    });

    if (!res.ok) return alert("Failed to update quantity");

    const updatedItem = await res.json();

    setCart(prev =>
      prev.map(i =>
        i.id === updatedItem.id ? { ...i, quantity: updatedItem.quantity } : i
      )
    );
  };

  // CLEAR CART (for after checkout)
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,  // <-- expose it
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
