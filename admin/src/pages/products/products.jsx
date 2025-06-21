import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

const Products = () => {
  const { id } = useParams();
  const location = useLocation();
  const category = location.state?.category;

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    image: "",
    description: "",
    price: "",
    discountedPrice: "",
    category: category?._id,
    colors: "",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  async function fetchProducts() {
    if (!category?.gender) return;

    const res = await fetch(
      `http://localhost:5000/api/product?category=${category._id}`
    );
    const data = await res.json();
    setProducts(data);
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const openModal = (prod = null) => {
    if (prod) {
      setForm({
        name: prod.name,
        image: prod.image,
        description: prod.description,
        price: prod.price,
        discountedPrice: prod.discountedPrice || "",
        colors: prod.colors.join(","),
      });
      setEditMode(true);
      setEditId(prod._id);
    } else {
      setForm({
        name: "",
        image: "",
        description: "",
        price: "",
        discountedPrice: "",
        colors: "",
      });
      setEditMode(false);
      setEditId(null);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm({
      name: "",
      image: "",
      description: "",
      price: "",
      discountedPrice: "",
      colors: "",
    });
    setEditMode(false);
    setEditId(null);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editMode
      ? `http://localhost:5000/api/products/${editId}`
      : "http://localhost:5000/api/product/create";
    const method = editMode ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price),
        discountedPrice: parseFloat(form.discountedPrice) || undefined,
        colors: form.colors.split(",").map((c) => c.trim()),
        category: category?._id,
      }),
    });

    closeModal();
    fetchProducts();
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/products/${id}`, {
      method: "DELETE",
    });
    fetchProducts();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Product's
      </h2>
      <div className="flex justify-center mb-6">
        <button
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
        >
          + Add Product
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((prod) => (
          <div
            key={prod._id}
            className="bg-white shadow-lg rounded-lg overflow-hidden"
          >
            <img
              src={prod.image}
              alt={prod.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {prod.name}
              </h3>
              <p className="text-sm text-gray-500 mb-2">{prod.description}</p>
              <p className="text-gray-900 font-bold">
                ₹{prod.discountedPrice ? prod.discountedPrice : prod.price}
                {prod.discountedPrice && (
                  <span className="line-through text-gray-500 ml-2">
                    ₹{prod.price}
                  </span>
                )}
              </p>
              <div className="mt-2 space-x-2">
                {prod.colors.map((c) => (
                  <span
                    key={c}
                    className="inline-block px-2 py-0.5 bg-gray-200 text-gray-800 rounded"
                  >
                    {c}
                  </span>
                ))}
              </div>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => openModal(prod)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(prod._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-xl relative">
            <h3 className="text-2xl font-bold mb-4">
              {editMode ? "Edit" : "Add"} Product
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Name"
                className="border p-2 rounded w-full"
                required
              />
              <input
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="Image URL"
                className="border p-2 rounded w-full"
                required
              />
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                className="border p-2 rounded w-full"
                required
              />
              <input
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Price"
                type="number"
                className="border p-2 rounded w-full"
                required
              />
              <input
                name="discountedPrice"
                value={form.discountedPrice}
                onChange={handleChange}
                placeholder="Discounted Price"
                type="number"
                className="border p-2 rounded w-full"
              />
              <input
                name="colors"
                value={form.colors}
                onChange={handleChange}
                placeholder="Colors (comma-separated)"
                className="border p-2 rounded w-full"
              />
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded"
                >
                  {editMode ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
