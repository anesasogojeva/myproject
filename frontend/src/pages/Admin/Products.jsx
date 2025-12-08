import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Products() {
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    category: "",
  });

  // separate state for editing form
  const [editingProduct, setEditingProduct] = useState(null);

  const token = localStorage.getItem("accessToken");

  const fetchProducts = () => {
    axios
      .get("http://localhost:5000/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ADD NEW PRODUCT
  const handleAdd = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/products", form, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        fetchProducts();
        setForm({
          name: "",
          price: "",
          description: "",
          image: "",
          category: "",
        });
      })
      .catch((err) => console.error(err));
  };

  // UPDATE PRODUCT
  const handleUpdate = (e) => {
    e.preventDefault();

    axios
      .put(`http://localhost:5000/api/products/${editingProduct.id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        fetchProducts();
        setEditingProduct(null);
        setForm({
          name: "",
          price: "",
          description: "",
          image: "",
          category: "",
        });
      })
      .catch((err) => console.error(err));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    axios
      .delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => fetchProducts())
      .catch((err) => console.error(err));
  };

  const startEdit = (product) => {
    setEditingProduct(product);

    setForm({
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image,
      category: product.category,
    });
  };

  return (
    <div className="space-y-10">
      <h2 className="text-3xl font-bold mb-2">Products Management</h2>
      <p className="text-gray-600 mb-6">Add, edit or remove store products.</p>

      {/* ADD PRODUCT FORM */}
      <form
        onSubmit={handleAdd}
        className="bg-white p-6 rounded-2xl shadow-lg border max-w-lg space-y-4"
      >
        <h3 className="text-xl font-semibold">Add New Product</h3>

        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="w-full border p-3 rounded-lg"
        />

        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full border p-3 rounded-lg"
        />

        <input
          type="text"
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          className="w-full border p-3 rounded-lg"
        />

        <input
          type="text"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border p-3 rounded-lg"
        />

        <input
          type="text"
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="Image URL"
          className="w-full border p-3 rounded-lg"
        />

        <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-500 transition">
          Add Product
        </button>
      </form>

      {/* SEPARATED EDIT FORM */}
      {editingProduct && (
        <form
          onSubmit={handleUpdate}
          className="bg-yellow-50 p-6 rounded-2xl shadow-lg border border-yellow-300 max-w-lg space-y-4"
        >
          <h3 className="text-xl font-semibold text-yellow-700">
            Editing: {editingProduct.name}
          </h3>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="text"
            name="image"
            value={form.image}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <div className="flex gap-3">
            <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-500 transition">
              Save Changes
            </button>

            <button
              type="button"
              onClick={() => setEditingProduct(null)}
              className="flex-1 bg-gray-400 text-white py-3 rounded-lg hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-700">
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Description</th>
              <th className="p-3">Image</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{p.id}</td>
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.category}</td>
                <td className="p-3">${p.price}</td>
                <td className="p-3">{p.description}</td>
                <td className="p-3">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                </td>
                <td className="p-3 flex gap-3">
                  <button
                    onClick={() => startEdit(p)}
                    className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(p.id)}
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
