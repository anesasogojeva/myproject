import React, { useEffect, useState } from "react";
import axios from "axios";

export default function OrdersDashboard() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("accessToken");

  const fetchOrders = () => {
    axios
      .get("http://localhost:5000/api/order", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancel = (id) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    axios
      .delete(`http://localhost:5000/api/order/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => fetchOrders())
      .catch((err) => console.error(err));
  };

  return (
    <div className="space-y-10">
      <h2 className="text-3xl font-bold mb-2">Orders Management</h2>
      <p className="text-gray-600 mb-6">View and manage all orders.</p>

      <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-700">
              <th className="p-3">Order ID</th>
              <th className="p-3">User ID</th>
              <th className="p-3">Total</th>
              <th className="p-3">Payment Method</th>
              <th className="p-3">Status</th>
              <th className="p-3">Items</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{order.id}</td>
                <td className="p-3">{order.userId}</td>
                <td className="p-3">${order.total.toFixed(2)}</td>
                <td className="p-3 capitalize">{order.paymentMethod || "N/A"}</td>
                <td className="p-3 capitalize">{order.status}</td>
                <td className="p-3">
                  {order.OrderItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 mb-1">
                      <img
                        src={item.Product.image}
                        alt={item.Product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <span>
                        {item.Product.name} x {item.quantity} (${item.price})
                      </span>
                    </div>
                  ))}
                </td>
                <td className="p-3 flex gap-2">
                  {order.status !== "paid" && (
                    <button
                      onClick={() => handleCancel(order.id)}
                      className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500 transition"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
