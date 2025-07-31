import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", image: null });
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [imagePublicId, setImagePublicId] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // New loading state

  // Cloudinary configuration
  const CLOUDINARY_UPLOAD_PRESET = "bg8efuux";
  const CLOUDINARY_CLOUD_NAME = "dlyq8wjky";
  const CLOUDINARY_API_KEY = "683781286465483";
  const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(
        "https://clothing-kg9h.onrender.com/api/categorie/?gender=men"
      );
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("api_key", CLOUDINARY_API_KEY);

    try {
      const res = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        return { url: data.secure_url, publicId: data.public_id };
      } else {
        throw new Error("Image upload failed");
      }
    } catch (err) {
      console.error("Error uploading image to Cloudinary:", err);
      throw err;
    }
  };

  const deleteImageFromCloudinary = async (publicId) => {
    try {
      const res = await fetch(
        "https://clothing-kg9h.onrender.com/api/categorie/delete-image",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId }),
        }
      );
      if (!res.ok) throw new Error("Failed to delete image from Cloudinary");
    } catch (err) {
      console.error("Error deleting image from Cloudinary:", err);
    }
  };

  const openModal = (category = null) => {
    if (category) {
      setForm({ name: category.name, image: null });
      setImagePublicId(category.imagePublicId || null);
      setEditId(category._id);
      setEditMode(true);
    } else {
      setForm({ name: "", image: null });
      setImagePublicId(null);
      setEditId(null);
      setEditMode(false);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm({ name: "", image: null });
    setImagePublicId(null);
    setEditMode(false);
    setEditId(null);
    setIsLoading(false); // Reset loading state
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files[0]) {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state to true

    let imageUrl = editMode ? form.image : null;
    let newPublicId = imagePublicId;

    // Upload new image if provided
    if (form.image instanceof File) {
      try {
        const { url, publicId } = await uploadImageToCloudinary(form.image);
        imageUrl = url;
        newPublicId = publicId;

        // If editing and new image uploaded, delete old image from Cloudinary
        if (editMode && imagePublicId) {
          await deleteImageFromCloudinary(imagePublicId);
        }
      } catch (err) {
        console.error("Image upload failed:", err);
        setIsLoading(false); // Reset loading state on error
        return;
      }
    } else if (editMode) {
      // If no new image uploaded in edit mode, use existing image URL
      imageUrl = categories.find((cat) => cat._id === editId)?.image;
    }

    const url = editMode
      ? `https://clothing-kg9h.onrender.com/api/categorie/update/${editId}`
      : "https://clothing-kg9h.onrender.com/api/categorie/create";
    const method = editMode ? "PUT" : "POST";

    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          image: imageUrl,
          imagePublicId: newPublicId,
          gender: "men",
        }),
      });

      closeModal();
      fetchCategories();
    } catch (err) {
      console.error("Error saving category:", err);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const handleDelete = async (id) => {
    try {
      const category = categories.find((cat) => cat._id === id);
      if (category.imagePublicId) {
        await deleteImageFromCloudinary(category.imagePublicId);
      }

      const res = await fetch(
        `https://clothing-kg9h.onrender.com/api/categorie/delete/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Failed to delete");

      fetchCategories();
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

      {modalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacityಸ1
          bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300"
        >
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
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required={!editMode}
              />
              {editMode && form.image === null && (
                <p className="text-sm text-gray-600">
                  Current image will be kept unless a new one is uploaded
                </p>
              )}

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : editMode ? "Update" : "Create"}
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
