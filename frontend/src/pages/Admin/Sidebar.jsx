import { NavLink } from "react-router-dom";
import { LayoutDashboard, ShoppingCart, Users, Mail } from "lucide-react";


export default function Sidebar() {
return (
<aside className="w-64 bg-gray-900 text-white min-h-screen p-6 space-y-6">
<h1 className="text-2xl font-bold tracking-wide">AdminPanel</h1>
<nav className="space-y-3">
<NavLink to="/" className="block px-4 py-2 rounded hover:bg-gray-800">Dashboard</NavLink>
<NavLink to="/products" className="block px-4 py-2 rounded hover:bg-gray-800">Products</NavLink>
<NavLink to="/users" className="block px-4 py-2 rounded hover:bg-gray-800">Users</NavLink>
<NavLink to="/orders" className="block px-4 py-2 rounded hover:bg-gray-800">Orders</NavLink>
<NavLink to="/contacts" className="block px-4 py-2 rounded hover:bg-gray-800">Contacts</NavLink>
</nav>
</aside>
);
}