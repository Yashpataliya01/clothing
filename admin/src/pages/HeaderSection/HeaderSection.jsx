import React, { useState, useEffect, useRef } from "react";

const CLOUDINARY_UPLOAD_PRESET = "bg8efuux";
const CLOUDINARY_CLOUD_NAME = "dlyq8wjky";
const CLOUDINARY_API_KEY = "683781286465483";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
const CLOUDINARY_DESTROY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`;

const HeaderSection = () => {
  const [headers, setHeaders] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    tag: "New",
    publicId: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchHeaders();
  }, []);

  const fetchHeaders = async () => {
    try {
      const response = await fetch(
        "https://clothing-kg9h.onrender.com/api/header/"
      );
      if (!response.ok) throw new Error("Failed to fetch headers");
      const data = await response.json();
      setHeaders(data);
    } catch (err) {
      setError("Failed to fetch headers");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    uploadFormData.append("api_key", CLOUDINARY_API_KEY);

    try {
      const response = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: "POST",
        body: uploadFormData,
      });
      if (!response.ok) throw new Error("Failed to upload image");
      const data = await response.json();
      setFormData((prev) => ({
        ...prev,
        image: data.secure_url,
        publicId: data.public_id,
      }));
    } catch (err) {
      setError("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  const deleteImageFromCloudinary = async (publicId) => {
    try {
      const deleteFormData = new FormData();
      deleteFormData.append("public_id", publicId);
      deleteFormData.append("api_key", CLOUDINARY_API_KEY);

      await fetch(CLOUDINARY_DESTROY_URL, {
        method: "POST",
        body: deleteFormData,
      });
    } catch (err) {
      console.error("Error deleting image from Cloudinary:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.name ||
      !formData.description ||
      !formData.image ||
      !formData.tag
    ) {
      setError("All fields are required");
      return;
    }

    try {
      const url = editingId
        ? `https://clothing-kg9h.onrender.com/api/header/${editingId}`
        : "https://clothing-kg9h.onrender.com/api/header/create";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to submit header");

      resetForm();
      fetchHeaders();
    } catch (err) {
      setError("Submission failed");
    }
  };

  const handleEdit = (header) => {
    setFormData({
      name: header.name,
      description: header.description,
      image: header.image,
      tag: header.tag,
      publicId: header.publicId || "",
    });
    setEditingId(header._id);
    setModalOpen(true);
  };

  const handleDelete = async (header) => {
    if (!window.confirm("Are you sure you want to delete this header?")) return;

    try {
      if (header.publicId) {
        await deleteImageFromCloudinary(header.publicId);
      }

      const response = await fetch(
        `https://clothing-kg9h.onrender.com/api/header/${header._id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete header");
      fetchHeaders();
    } catch (err) {
      setError("Failed to delete header");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      image: "",
      tag: "New",
      publicId: "",
    });
    setEditingId(null);
    setModalOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Header Management</h1>
        {headers.length < 4 && (
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            + Create Header
          </button>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg relative">
            <button
              onClick={resetForm}
              className="absolute top-2 right-3 text-gray-600 hover:text-black"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? "Edit Header" : "Create Header"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded-md p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded-md p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Image
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="mt-1 block w-full"
                  disabled={loading}
                />
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="mt-2 h-32 object-cover rounded"
                  />
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Tag
                </label>
                <select
                  name="tag"
                  value={formData.tag}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded-md p-2"
                  required
                >
                  <option value="New">New</option>
                  <option value="Sale">Sale</option>
                  <option value="Trending">Trending</option>
                </select>
              </div>
              {error && <p className="text-red-500 mb-4">{error}</p>}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? "Processing..." : editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {headers.map((header) => (
          <div key={header._id} className="bg-white p-4 rounded-lg shadow-md">
            <img
              src={header.image}
              alt={header.name}
              className="h-48 w-full object-cover mb-4 rounded"
            />
            <h2 className="text-xl font-semibold">{header.name}</h2>
            <p className="text-gray-600">{header.description}</p>
            <p className="text-sm text-blue-500">{header.tag}</p>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => handleEdit(header)}
                className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(header)}
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeaderSection;
