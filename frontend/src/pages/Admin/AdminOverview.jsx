import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Users,
  ShoppingBag,
  ListOrdered,
  MessageSquare,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import StatCard from "../../components/UI/StatCard";
import Card from "../../components/UI/Card";
import HorizontalBarList from "../../components/UI/HorizontalBarList";
import ImageWithFallback from "../../components/UI/ImageWithFallback";
import { CardSkeleton } from "../../components/UI/Skeleton";
import EmptyState from "../../components/UI/EmptyState";

const quickActions = [
  { icon: Users, title: "Manage Users", text: "Add, edit or remove platform users.", to: "/admin/users" },
  { icon: ShoppingBag, title: "Manage Products", text: "Update your store's product catalog.", to: "/admin/products" },
  { icon: ListOrdered, title: "View Orders", text: "Track and manage customer orders.", to: "/admin/orders" },
  { icon: MessageSquare, title: "Contact Messages", text: "Respond to customer inquiries.", to: "/admin/contacts" },
];

export default function AdminOverview() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("accessToken");
  const admin = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      axios.get("http://localhost:5000/api/users", { headers }).then((r) => r.data).catch(() => []),
      axios.get("http://localhost:5000/api/products", { headers }).then((r) => r.data).catch(() => []),
      axios.get("http://localhost:5000/api/order", { headers }).then((r) => r.data).catch(() => []),
      axios.get("http://localhost:5000/api/contact", { headers }).then((r) => r.data).catch(() => []),
    ]).then(([u, p, o, c]) => {
      setUsers(u);
      setProducts(p);
      setOrders(o);
      setContacts(c);
      setLoading(false);
    });
  }, [token]);

  const cards = [
    { label: "Total Users", value: users.length, icon: Users, tone: "emerald", to: "/admin/users" },
    { label: "Products", value: products.length, icon: ShoppingBag, tone: "amber", to: "/admin/products" },
    { label: "Orders", value: orders.length, icon: ListOrdered, tone: "sky", to: "/admin/orders" },
    { label: "Contact Messages", value: contacts.length, icon: MessageSquare, tone: "rose", to: "/admin/contacts" },
  ];

  const roleCounts = users.reduce((acc, u) => {
    const role = (u.role || "user").toLowerCase();
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});
  const roleData = Object.entries(roleCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => ({ label: label.charAt(0).toUpperCase() + label.slice(1), value }));

  const categoryCounts = products.reduce((acc, p) => {
    const cat = p.category || "Uncategorized";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});
  const categoryData = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([label, value]) => ({ label, value }));

  const recentProducts = [...products]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0) || b.id - a.id)
    .slice(0, 5);

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-display font-bold text-stone-900">
        Welcome back{admin?.name ? `, ${admin.name}` : ""}
      </h1>
      <p className="text-stone-500 mt-1.5 mb-8">Here's what's happening across your store today.</p>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((c) => (
            <Link key={c.label} to={c.to}>
              <StatCard icon={c.icon} label={c.label} value={c.value} tone={c.tone} />
            </Link>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        <Card>
          <h2 className="font-display font-semibold text-stone-900 mb-5">Users by Role</h2>
          {loading ? <CardSkeleton /> : <HorizontalBarList data={roleData} tone="emerald" />}
        </Card>

        <Card>
          <h2 className="font-display font-semibold text-stone-900 mb-5">Products by Category</h2>
          {loading ? (
            <CardSkeleton />
          ) : (
            <HorizontalBarList data={categoryData} tone="amber" />
          )}
          {categoryCounts && Object.keys(categoryCounts).length > 8 && (
            <p className="text-xs text-stone-400 mt-3">
              +{Object.keys(categoryCounts).length - 8} more categories
            </p>
          )}
        </Card>
      </div>

      <Card className="mt-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-semibold text-stone-900">Recently Added Products</h2>
          <Link to="/admin/products" className="text-sm font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <CardSkeleton />
        ) : recentProducts.length === 0 ? (
          <EmptyState icon={Sparkles} title="No products yet" description="Products you add will show up here." />
        ) : (
          <div className="divide-y divide-stone-100">
            {recentProducts.map((p) => (
              <div key={p.id} className="flex items-center gap-3 py-3">
                <ImageWithFallback
                  src={p.image}
                  alt={p.name}
                  className="w-11 h-11 rounded-lg object-cover border border-stone-100 shrink-0"
                  iconClassName="w-4 h-4"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-stone-800 text-sm truncate">{p.name}</p>
                  <p className="text-xs text-stone-400">{p.category}</p>
                </div>
                <p className="font-semibold text-stone-900 text-sm shrink-0">${Number(p.price).toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
        {quickActions.map((a) => (
          <Card key={a.title} hoverable as={Link} to={a.to} className="block">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <a.icon className="w-5 h-5" />
            </div>
            <h3 className="font-display font-semibold text-stone-900 mb-1">{a.title}</h3>
            <p className="text-sm text-stone-500">{a.text}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
