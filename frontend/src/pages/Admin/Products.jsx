import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Pencil, Trash2, ShoppingBag, Search } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import Modal from "../../components/UI/Modal";
import ConfirmDialog from "../../components/UI/ConfirmDialog";
import { Input, Textarea } from "../../components/UI/FormField";
import { TableRowSkeleton } from "../../components/UI/Skeleton";
import EmptyState from "../../components/UI/EmptyState";
import ImageWithFallback from "../../components/UI/ImageWithFallback";
import PaginationBar from "../../components/UI/PaginationBar";
import usePagination from "../../hooks/usePagination";
import { API_URL } from "../../config";

const emptyForm = { name: "", price: "", description: "", image: "", category: "" };

export default function Products() {
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  const {
    page,
    setPage,
    totalPages,
    pageItems: pagedProducts,
    itemsPerPage,
    setItemsPerPage,
    totalItems,
  } = usePagination(filteredProducts, 10);

  const token = localStorage.getItem("accessToken");

  const fetchProducts = () => {
    setLoading(true);
    axios
      .get(`${API_URL}/api/products`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openAdd = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image,
      category: product.category,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingProduct) {
        await axios.put(`${API_URL}/api/products/${editingProduct.id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Product updated successfully");
      } else {
        await axios.post(`${API_URL}/api/products`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Product added successfully");
      }
      fetchProducts();
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while saving the product.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`${API_URL}/api/products/${deleteTarget.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Product deleted");
      fetchProducts();
    } catch (err) {
      toast.error("Failed to delete product.");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-stone-900">Products</h1>
          <p className="text-stone-500 mt-1.5">Add, edit or remove store products.</p>
        </div>
        <Button icon={Plus} onClick={openAdd}>Add Product</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="field-input pl-10"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="field-input sm:w-52"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <Card padding="p-0" className="overflow-hidden">
        <div className="overflow-x-auto scroll-thin">
          <table className="w-full text-sm min-w-[720px]">
            <thead className="bg-stone-50 border-b border-stone-100">
              <tr className="text-left text-stone-500">
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => <TableRowSkeleton key={i} cols={4} />)
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <EmptyState
                      icon={ShoppingBag}
                      title="No products yet"
                      description="Add your first product to start selling."
                      action={<Button icon={Plus} onClick={openAdd}>Add Product</Button>}
                    />
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <EmptyState icon={Search} title="No matching products" description="Try a different search term or category." />
                  </td>
                </tr>
              ) : (
                pagedProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50/60 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <ImageWithFallback
                          src={p.image}
                          alt={p.name}
                          className="w-11 h-11 rounded-lg object-cover border border-stone-100 shrink-0"
                          iconClassName="w-4 h-4"
                        />
                        <span className="font-medium text-stone-800">{p.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-stone-500">{p.category}</td>
                    <td className="p-4 font-semibold text-stone-800">${p.price}</td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="w-9 h-9 flex items-center justify-center rounded-lg text-stone-500 hover:bg-stone-100 hover:text-emerald-700 transition"
                          aria-label="Edit product"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(p)}
                          className="w-9 h-9 flex items-center justify-center rounded-lg text-stone-500 hover:bg-rose-50 hover:text-rose-600 transition"
                          aria-label="Delete product"
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

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProduct ? "Edit Product" : "Add New Product"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Product Name" name="name" value={form.name} onChange={handleChange} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Price" name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required />
            <Input label="Category" name="category" value={form.category} onChange={handleChange} required />
          </div>
          <Textarea label="Description" name="description" value={form.description} onChange={handleChange} rows={3} />
          <Input label="Image URL" name="image" value={form.image} onChange={handleChange} />

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" fullWidth onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" fullWidth loading={saving}>
              {editingProduct ? "Save Changes" : "Add Product"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this product?"
        description={`"${deleteTarget?.name}" will be permanently removed from the store.`}
        confirmLabel="Delete"
      />
    </div>
  );
}
