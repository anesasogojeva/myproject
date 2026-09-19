import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Sparkles,
  MessageCircle,
  Package,
  ClipboardList,
  StickyNote,
  User as UserIcon,
  XCircle,
  Bookmark,
  Eye,
  Trash2,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import Badge from "../../components/UI/Badge";
import StatCard from "../../components/UI/StatCard";
import EmptyState from "../../components/UI/EmptyState";
import { PageSpinner } from "../../components/UI/Spinner";
import ImageWithFallback from "../../components/UI/ImageWithFallback";
import PaginationBar from "../../components/UI/PaginationBar";
import ConfirmDialog from "../../components/UI/ConfirmDialog";
import Modal from "../../components/UI/Modal";
import PlanResult from "../../components/AI/PlanResult";
import usePagination from "../../hooks/usePagination";
import { orderStatusVariant } from "../../utils/orderStatus";
import { API_URL } from "../../config";

const quickLinks = [
  {
    icon: Sparkles,
    title: "AI Nutrition Planner",
    text: "Generate a personalized meal and fitness plan.",
    to: "/ai-planner",
  },
  {
    icon: ShoppingBag,
    title: "Nutrition Shop",
    text: "Browse healthy foods and wellness products.",
    to: "/products",
  },
  {
    icon: MessageCircle,
    title: "Chat with Dietitian",
    text: "Get guidance from your certified dietitian.",
    to: "/chat",
  },
  {
    icon: Package,
    title: "Your Cart",
    text: "Review items before checking out.",
    to: "/cart",
  },
];

export default function UserDashboard() {
  const { user, token } = useAuth();
  const { cart } = useCart();
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [notes, setNotes] = useState([]);
  const [savedPlans, setSavedPlans] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [viewingPlan, setViewingPlan] = useState(null);
  const [deletePlanTarget, setDeletePlanTarget] = useState(null);
  const [deletingPlan, setDeletingPlan] = useState(false);

  const loadOrders = () => {
    if (!token) return;
    setLoadingOrders(true);
    axios
      .get(`${API_URL}/api/order/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrders(res.data))
      .catch(() => setOrders([]))
      .finally(() => setLoadingOrders(false));
  };

  useEffect(loadOrders, [token]);

  const handleCancelOrder = async () => {
    setCancelling(true);
    try {
      await axios.delete(`${API_URL}/api/order/${cancelTarget.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Order cancelled");
      loadOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel order.");
    } finally {
      setCancelling(false);
      setCancelTarget(null);
    }
  };

  useEffect(() => {
    if (!user?.id) return;
    axios
      .get(`${API_URL}/api/notes/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setNotes(res.data))
      .catch(() => setNotes([]))
      .finally(() => setLoadingNotes(false));
  }, [user?.id, token]);

  const loadSavedPlans = () => {
    if (!token) return;
    setLoadingPlans(true);
    axios
      .get(`${API_URL}/api/saved-plans`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setSavedPlans(res.data))
      .catch(() => setSavedPlans([]))
      .finally(() => setLoadingPlans(false));
  };

  useEffect(loadSavedPlans, [token]);

  const handleDeletePlan = async () => {
    setDeletingPlan(true);
    try {
      await axios.delete(`${API_URL}/api/saved-plans/${deletePlanTarget.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Saved plan deleted");
      loadSavedPlans();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete saved plan.");
    } finally {
      setDeletingPlan(false);
      setDeletePlanTarget(null);
    }
  };

  const {
    page: orderPage,
    setPage: setOrderPage,
    totalPages: orderTotalPages,
    pageItems: pagedOrders,
    itemsPerPage: orderItemsPerPage,
    setItemsPerPage: setOrderItemsPerPage,
    totalItems: orderTotalItems,
  } = usePagination(orders, 5);

  const {
    page: notePage,
    setPage: setNotePage,
    totalPages: noteTotalPages,
    pageItems: pagedNotes,
    itemsPerPage: noteItemsPerPage,
    setItemsPerPage: setNoteItemsPerPage,
    totalItems: noteTotalItems,
  } = usePagination(notes, 5);

  const {
    page: planPage,
    setPage: setPlanPage,
    totalPages: planTotalPages,
    pageItems: pagedPlans,
    itemsPerPage: planItemsPerPage,
    setItemsPerPage: setPlanItemsPerPage,
    totalItems: planTotalItems,
  } = usePagination(savedPlans, 5);

  return (
    <div className="container-app py-10 sm:py-14">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-stone-900">
          Welcome back{user?.name ? `, ${user.name}` : ""}
        </h1>
        <p className="text-stone-500 mt-2">Here's an overview of your nutrition journey.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard icon={Package} label="Items in Cart" value={cart.length} tone="emerald" />
        <StatCard icon={ClipboardList} label="Total Orders" value={loadingOrders ? "–" : orderTotalItems} tone="sky" />
        <StatCard icon={StickyNote} label="Dietitian Notes" value={loadingNotes ? "–" : noteTotalItems} tone="amber" />
        <StatCard icon={Bookmark} label="Saved Plans" value={loadingPlans ? "–" : planTotalItems} tone="rose" />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        {quickLinks.map((q) => (
          <Card key={q.title} hoverable as={Link} to={q.to} className="block">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <q.icon className="w-5 h-5" />
            </div>
            <h3 className="font-display font-semibold text-stone-900 mb-1">{q.title}</h3>
            <p className="text-sm text-stone-500">{q.text}</p>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <h2 className="text-lg font-display font-bold text-stone-900 mb-5">Your Orders</h2>
          {loadingOrders ? (
            <PageSpinner label="Loading orders..." />
          ) : orders.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="No orders yet"
              description="Your past orders will show up here once you make a purchase."
              action={<Button to="/products">Start Shopping</Button>}
            />
          ) : (
            <>
              <div className="space-y-3">
                {pagedOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between gap-4 p-3 rounded-xl border border-stone-100"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <ImageWithFallback
                        src={order.OrderItems?.[0]?.Product?.image}
                        alt=""
                        className="w-11 h-11 rounded-lg object-cover border border-stone-100 shrink-0"
                        iconClassName="w-4 h-4"
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-stone-800 text-sm">Order #{order.id}</p>
                        <p className="text-xs text-stone-400 truncate">
                          {order.OrderItems.length} item{order.OrderItems.length !== 1 ? "s" : ""} ·{" "}
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold text-stone-900 text-sm">${order.total.toFixed(2)}</p>
                      <Badge variant={orderStatusVariant(order.status)} className="capitalize mt-1">
                        {order.status.replace("_", " ")}
                      </Badge>
                      {order.status !== "paid" && (
                        <button
                          onClick={() => setCancelTarget(order)}
                          className="flex items-center gap-1 text-xs text-stone-400 hover:text-rose-600 transition mt-1.5 ml-auto"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <PaginationBar
                page={orderPage}
                totalPages={orderTotalPages}
                setPage={setOrderPage}
                itemsPerPage={orderItemsPerPage}
                setItemsPerPage={setOrderItemsPerPage}
                totalItems={orderTotalItems}
                size="sm"
                layout="stack"
                className="mt-5"
              />
            </>
          )}
        </Card>

        <Card>
          <h2 className="text-lg font-display font-bold text-stone-900 mb-5">Notes from Your Dietitian</h2>
          {loadingNotes ? (
            <PageSpinner label="Loading notes..." />
          ) : notes.length === 0 ? (
            <EmptyState
              icon={StickyNote}
              title="No notes yet"
              description="Your dietitian's notes and recommendations will appear here."
            />
          ) : (
            <>
              <div className="space-y-3">
                {pagedNotes.map((note) => (
                  <div key={note.id} className="bg-stone-50 border border-stone-100 rounded-xl p-4">
                    <p className="text-stone-700 text-sm leading-relaxed">{note.content}</p>
                    <div className="flex items-center justify-between mt-3 text-xs text-stone-400">
                      <span>{note.dietitian?.name || "Your dietitian"}</span>
                      <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>

              <PaginationBar
                page={notePage}
                totalPages={noteTotalPages}
                setPage={setNotePage}
                itemsPerPage={noteItemsPerPage}
                setItemsPerPage={setNoteItemsPerPage}
                totalItems={noteTotalItems}
                size="sm"
                layout="stack"
                className="mt-5"
              />
            </>
          )}
        </Card>
      </div>

      <Card className="mt-8">
        <h2 className="text-lg font-display font-bold text-stone-900 mb-5">Saved Nutrition Plans</h2>
        {loadingPlans ? (
          <PageSpinner label="Loading saved plans..." />
        ) : savedPlans.length === 0 ? (
          <EmptyState
            icon={Bookmark}
            title="No saved plans yet"
            description="Generate a plan with the AI Nutrition Planner and save it to see it here later."
            action={<Button to="/ai-planner">Open AI Planner</Button>}
          />
        ) : (
          <>
            <div className="space-y-3">
              {pagedPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="flex items-center justify-between gap-4 p-3 rounded-xl border border-stone-100"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-stone-800 text-sm truncate">{plan.title}</p>
                    <p className="text-xs text-stone-400">
                      Saved {new Date(plan.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => setViewingPlan(plan)}
                      className="flex items-center gap-1 text-xs font-medium text-emerald-700 hover:text-emerald-800 transition"
                    >
                      <Eye className="w-3.5 h-3.5" /> View
                    </button>
                    <button
                      onClick={() => setDeletePlanTarget(plan)}
                      className="flex items-center gap-1 text-xs text-stone-400 hover:text-rose-600 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <PaginationBar
              page={planPage}
              totalPages={planTotalPages}
              setPage={setPlanPage}
              itemsPerPage={planItemsPerPage}
              setItemsPerPage={setPlanItemsPerPage}
              totalItems={planTotalItems}
              size="sm"
              layout="stack"
              className="mt-5"
            />
          </>
        )}
      </Card>

      <Card className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <UserIcon className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-stone-900 truncate">{user?.name}</p>
            <p className="text-sm text-stone-500 truncate">{user?.email}</p>
          </div>
        </div>
        <Badge variant="neutral" className="capitalize w-fit">
          {user?.role}
        </Badge>
      </Card>

      <ConfirmDialog
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancelOrder}
        loading={cancelling}
        title="Cancel this order?"
        description={`Order #${cancelTarget?.id} will be cancelled. This can't be undone.`}
        confirmLabel="Cancel Order"
      />

      <Modal
        open={!!viewingPlan}
        onClose={() => setViewingPlan(null)}
        title={viewingPlan?.title}
        size="xl"
      >
        <PlanResult result={viewingPlan?.planData} />
      </Modal>

      <ConfirmDialog
        open={!!deletePlanTarget}
        onClose={() => setDeletePlanTarget(null)}
        onConfirm={handleDeletePlan}
        loading={deletingPlan}
        title="Delete this saved plan?"
        description={`"${deletePlanTarget?.title}" will be deleted. This can't be undone.`}
        confirmLabel="Delete Plan"
      />
    </div>
  );
}
