import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("accessToken");

  // Fetch all orders
  const fetchOrders = () => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle cancel order
  const handleCancel = (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      axios
        .delete(`http://localhost:5000/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => fetchOrders())
        .catch((err) => console.error(err));
    }
  };

  if (loading) return <div className="text-center py-20">Loading orders...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">All Orders</h2>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded shadow-md overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">Order ID</th>
                <th className="border p-2">User ID</th>
                <th className="border p-2">Total</th>
                <th className="border p-2">Items</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="border p-2">{order.id}</td>
                  <td className="border p-2">{order.userId}</td>
                  <td className="border p-2">${order.total.toFixed(2)}</td>
                  <td className="border p-2">
                    {order.OrderItems.map((item) => (
                      <div key={item.id} className="flex gap-2 items-center mb-1">
                        <img
                          src={item.Product.image}
                          alt={item.Product.name}
                          className="w-12 h-12 object-contain rounded"
                        />
                        <div>
                          <p className="font-semibold">{item.Product.name}</p>
                          <p className="text-sm">
                            ${item.price.toFixed(2)} x {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </td>
                  <td className="border p-2 flex gap-2">
                    <button
                      onClick={() => handleCancel(order.id)}
                      className="bg-red-500 px-2 py-1 rounded text-white hover:bg-red-400"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
