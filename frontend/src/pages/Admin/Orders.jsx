import React, { useEffect, useState } from "react";
import axios from "axios";
import { ListOrdered, XCircle, Search } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import Card from "../../components/UI/Card";
import Badge from "../../components/UI/Badge";
import ConfirmDialog from "../../components/UI/ConfirmDialog";
import { TableRowSkeleton } from "../../components/UI/Skeleton";
import EmptyState from "../../components/UI/EmptyState";
import ImageWithFallback from "../../components/UI/ImageWithFallback";
import PaginationBar from "../../components/UI/PaginationBar";
import usePagination from "../../hooks/usePagination";
import { orderStatusVariant as statusVariant } from "../../utils/orderStatus";
import { API_URL } from "../../config";

export default function OrdersDashboard() {
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const statuses = [...new Set(orders.map((o) => o.status).filter(Boolean))];

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      !search ||
      String(o.id).includes(search) ||
      String(o.userId).includes(search);
    const matchesStatus = status === "all" || o.status === status;
    return matchesSearch && matchesStatus;
  });

  const {
    page,
    setPage,
    totalPages,
    pageItems: pagedOrders,
    itemsPerPage,
    setItemsPerPage,
    totalItems,
  } = usePagination(filteredOrders, 10);

  const token = localStorage.getItem("accessToken");

  const fetchOrders = () => {
    setLoading(true);
    axios
      .get(`${API_URL}/api/order`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await axios.delete(`${API_URL}/api/order/${cancelTarget.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Order cancelled");
      fetchOrders();
    } catch (err) {
      toast.error("Failed to cancel order.");
    } finally {
      setCancelling(false);
      setCancelTarget(null);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-stone-900">Orders</h1>
        <p className="text-stone-500 mt-1.5">View and manage all customer orders.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order # or user #..."
            className="field-input pl-10"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="field-input sm:w-52 capitalize"
        >
          <option value="all">All Statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s} className="capitalize">{s}</option>
          ))}
        </select>
      </div>

      <Card padding="p-0" className="overflow-hidden">
        <div className="overflow-x-auto scroll-thin">
          <table className="w-full text-sm min-w-[760px]">
            <thead className="bg-stone-50 border-b border-stone-100">
              <tr className="text-left text-stone-500">
                <th className="p-4 font-medium">Order</th>
                <th className="p-4 font-medium">Items</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Payment</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 align-top">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => <TableRowSkeleton key={i} cols={6} />)
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState icon={ListOrdered} title="No orders yet" description="Orders placed by customers will appear here." />
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState icon={Search} title="No matching orders" description="Try a different search term or status." />
                  </td>
                </tr>
              ) : (
                pagedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50/60 transition">
                    <td className="p-4">
                      <p className="font-medium text-stone-800">#{order.id}</p>
                      <p className="text-xs text-stone-400">User #{order.userId}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-2 max-w-[220px]">
                        {order.OrderItems.map((item) => (
                          <div key={item.id} className="flex items-center gap-2">
                            <ImageWithFallback
                              src={item.Product.image}
                              alt={item.Product.name}
                              className="w-9 h-9 object-cover rounded-lg border border-stone-100 shrink-0"
                              iconClassName="w-3.5 h-3.5"
                            />
                            <span className="text-stone-600 text-xs truncate">
                              {item.Product.name} × {item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-stone-800">${order.total.toFixed(2)}</td>
                    <td className="p-4 text-stone-500 capitalize">{order.paymentMethod || "N/A"}</td>
                    <td className="p-4">
                      <Badge variant={statusVariant(order.status)} className="capitalize">{order.status}</Badge>
                    </td>
                    <td className="p-4">
                      {order.status !== "paid" && (
                        <div className="flex justify-end">
                          <button
                            onClick={() => setCancelTarget(order)}
                            className="w-9 h-9 flex items-center justify-center rounded-lg text-stone-500 hover:bg-rose-50 hover:text-rose-600 transition"
                            aria-label="Cancel order"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {!loading && (
        <PaginationBar
          page={page}
          totalPages={totalPages}
          setPage={setPage}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          totalItems={totalItems}
        />
      )}

      <ConfirmDialog
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancel}
        loading={cancelling}
        title="Cancel this order?"
        description={`Order #${cancelTarget?.id} will be cancelled. This can't be undone.`}
        confirmLabel="Cancel Order"
      />
    </div>
  );
}
