import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Allowed roles that admin can choose
  const allowedRoles = ["user", "admin", "dietitian"];

  // Add / edit form state
  const [form, setForm] = useState({ name: "", email: "", role: "user", password: "" });
  const [editingUser, setEditingUser] = useState(null);

  const token = localStorage.getItem("accessToken");

  // Fetch all users
  const fetchUsers = () => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add new user
  const handleAdd = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:5000/api/users/create-user", form, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        fetchUsers();
        setForm({ name: "", email: "", role: "user", password: "" });
      })
      .catch((err) => console.error(err));
  };

  // Update user
  const handleUpdate = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:5000/api/users/${editingUser.id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        fetchUsers();
        setEditingUser(null);
        setForm({ name: "", email: "", role: "user", password: "" });
      })
      .catch((err) => console.error(err));
  };

  const handleDelete = (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    axios
      .delete(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => fetchUsers())
      .catch((err) => console.error(err));
  };

  const startEdit = (user) => {
    setEditingUser(user);
    setForm({ name: user.name, email: user.email, role: user.role, password: "" });
  };

  if (loading) return <div className="text-center py-20">Loading users...</div>;

  return (
    <div className="space-y-10">
      <h2 className="text-3xl font-bold">Users Management</h2>
      <p className="text-gray-600">Add, edit, or remove users.</p>

      {/* ADD USER FORM */}
      <form
        onSubmit={handleAdd}
        className="bg-white p-6 rounded-2xl shadow-lg border max-w-lg space-y-4"
      >
        <h3 className="text-xl font-semibold">Add New User</h3>

        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full border p-3 rounded-lg"
          required
        />

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full border p-3 rounded-lg"
          required
        />

        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full border p-3 rounded-lg"
          required
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
          required
        >
          {allowedRoles.map((r) => (
            <option key={r} value={r}>
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </option>
          ))}
        </select>

        <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-500 transition">
          Add User
        </button>
      </form>

      {/* EDIT USER FORM */}
      {editingUser && (
        <form
          onSubmit={handleUpdate}
          className="bg-yellow-50 p-6 rounded-2xl shadow-lg border border-yellow-300 max-w-lg space-y-4"
        >
          <h3 className="text-xl font-semibold text-yellow-700">
            Editing: {editingUser.name}
          </h3>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          >
            <option value="">Select role</option>
            {allowedRoles.map((r) => (
              <option key={r} value={r}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </option>
            ))}
          </select>

          <div className="flex gap-3">
            <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-500 transition">
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setEditingUser(null)}
              className="flex-1 bg-gray-400 text-white py-3 rounded-lg hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* USERS TABLE */}
      <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-700">
              <th className="p-3">User ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{user.id}</td>
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.role}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => startEdit(user)}
                    className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
