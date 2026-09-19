import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Pencil, Trash2, Users as UsersIcon, Search } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import Modal from "../../components/UI/Modal";
import ConfirmDialog from "../../components/UI/ConfirmDialog";
import Badge from "../../components/UI/Badge";
import { Input, Select } from "../../components/UI/FormField";
import { TableRowSkeleton } from "../../components/UI/Skeleton";
import EmptyState from "../../components/UI/EmptyState";
import PaginationBar from "../../components/UI/PaginationBar";
import usePagination from "../../hooks/usePagination";
import { API_URL } from "../../config";

const allowedRoles = ["user", "admin", "dietitian"];
const emptyForm = { name: "", email: "", role: "user", password: "" };

const roleBadge = (role) => {
  if (role === "admin") return "danger";
  if (role === "dietitian") return "info";
  return "neutral";
};

export default function Users() {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingUser, setEditingUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((u) =>
    `${u.name || ""} ${u.email || ""}`.toLowerCase().includes(search.toLowerCase())
  );

  const {
    page,
    setPage,
    totalPages,
    pageItems: pagedUsers,
    itemsPerPage,
    setItemsPerPage,
    totalItems,
  } = usePagination(filteredUsers, 10);

  const token = localStorage.getItem("accessToken");

  const fetchUsers = () => {
    setLoading(true);
    axios
      .get(`${API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openAdd = () => {
    setEditingUser(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setForm({ name: user.name, email: user.email, role: user.role, password: "" });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingUser) {
        await axios.put(`${API_URL}/api/users/${editingUser.id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("User updated successfully");
      } else {
        await axios.post(`${API_URL}/api/users/create-user`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("User created successfully");
      }
      fetchUsers();
      setModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong while saving the user.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`${API_URL}/api/users/${deleteTarget.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("User deleted");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to delete user.");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-stone-900">Users</h1>
          <p className="text-stone-500 mt-1.5">Add, edit, or remove platform users.</p>
        </div>
        <Button icon={Plus} onClick={openAdd}>Add User</Button>
      </div>

      <div className="relative mb-5 max-w-sm">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="field-input pl-10"
        />
      </div>

      <Card padding="p-0" className="overflow-hidden">
        <div className="overflow-x-auto scroll-thin">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-stone-50 border-b border-stone-100">
              <tr className="text-left text-stone-500">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => <TableRowSkeleton key={i} cols={4} />)
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <EmptyState icon={UsersIcon} title="No users yet" description="Add your first platform user." />
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <EmptyState icon={Search} title="No matching users" description="Try a different name or email." />
                  </td>
                </tr>
              ) : (
                pagedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-stone-50/60 transition">
                    <td className="p-4 font-medium text-stone-800">{user.name}</td>
                    <td className="p-4 text-stone-500">{user.email}</td>
                    <td className="p-4">
                      <Badge variant={roleBadge(user.role)} className="capitalize">{user.role}</Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(user)}
                          className="w-9 h-9 flex items-center justify-center rounded-lg text-stone-500 hover:bg-stone-100 hover:text-emerald-700 transition"
                          aria-label="Edit user"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(user)}
                          className="w-9 h-9 flex items-center justify-center rounded-lg text-stone-500 hover:bg-rose-50 hover:text-rose-600 transition"
                          aria-label="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingUser ? "Edit User" : "Add New User"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" name="name" value={form.name} onChange={handleChange} required />
          <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
          {!editingUser && (
            <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} required />
          )}
          <Select label="Role" name="role" value={form.role} onChange={handleChange} required>
            {allowedRoles.map((r) => (
              <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
            ))}
          </Select>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" fullWidth onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" fullWidth loading={saving}>
              {editingUser ? "Save Changes" : "Add User"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this user?"
        description={`"${deleteTarget?.name}" will be permanently removed.`}
        confirmLabel="Delete"
      />
    </div>
  );
}
