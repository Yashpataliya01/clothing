import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", image: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/categorie/?gender=men"
      );
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const openModal = (category = null) => {
    if (category) {
      setForm({ name: category.name, image: category.image });
      setEditId(category._id);
      setEditMode(true);
    } else {
      setForm({ name: "", image: "" });
      setEditId(null);
      setEditMode(false);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm({ name: "", image: "" });
    setEditMode(false);
    setEditId(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editMode
      ? `http://localhost:5000/api/categorie/update/${editId}`
      : "http://localhost:5000/api/categorie/create";
    const method = editMode ? "PUT" : "POST";

    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, gender: "men" }),
      });

      closeModal();
      fetchCategories();
    } catch (err) {
      console.error("Error saving category:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/categorie/delete/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Failed to delete");

      fetchCategories(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Men's Categories
      </h2>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => openModal()}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md"
        >
          + Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 duration-300 overflow-hidden"
          >
            <div
              onClick={() =>
                navigate(`/product/${cat._id}`, { state: { category: cat } })
              }
              className="cursor-pointer"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-48 object-cover transition-all duration-300 hover:scale-105"
              />
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-800">
                  {cat.name}
                </h3>
              </div>
            </div>

            <div className="px-5 pb-5 flex justify-between items-center gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openModal(cat);
                }}
                className="flex-1 text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-all"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(cat._id);
                }}
                className="flex-1 text-sm font-medium bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white w-full max-w-lg rounded-xl p-8 shadow-2xl relative">
            <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
              {editMode ? "Edit Category" : "Add New Category"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Category Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <input
                type="text"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="Image URL"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow"
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

export default Home;
