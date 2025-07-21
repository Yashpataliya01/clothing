import React, { useEffect, useState, Component } from "react";
import { useLocation, useParams } from "react-router-dom";

// Simple Error Boundary Component
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-600 text-center p-4">
          <h3>Error: {this.state.error?.message || "Something went wrong"}</h3>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const Products = () => {
  const { id } = useParams();
  const { state: { category } = {} } = useLocation();
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [error, setError] = useState(null);

  const initialFormState = {
    name: "",
    description: "",
    price: "",
    discountedPrice: "",
    category: category?._id || "",
    variants: [{ color: "", images: [] }],
    size: [],
    sizeInput: "",
    tag: "",
  };

  const [form, setForm] = useState(initialFormState);

  const CLOUDINARY_CONFIG = {
    UPLOAD_PRESET: "bg8efuux",
    CLOUD_NAME: "dlyq8wjky",
    API_KEY: "683781286465483",
    UPLOAD_URL: `https://api.cloudinary.com/v1_1/dlyq8wjky/image/upload`,
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `http://localhost:5000/api/product?category=${category._id}`
      );
      if (!res.ok)
        throw new Error(`Failed to fetch products: ${res.statusText}`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTags = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/api/tag/tags");
      if (!response.ok) {
        throw new Error(`Failed to fetch tags: ${response.statusText}`);
      }
      const data = await response.json();
      setTags(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch tags error:", err);
      setError(err.message);
      setTags([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (category?._id) {
      fetchProducts();
      fetchTags();
    }
  }, [category]);

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_CONFIG.UPLOAD_PRESET);
    formData.append("api_key", CLOUDINARY_CONFIG.API_KEY);
    try {
      const res = await fetch(CLOUDINARY_CONFIG.UPLOAD_URL, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Image upload failed");
      const data = await res.json();
      if (data.secure_url) {
        return { url: data.secure_url, publicId: data.public_id };
      }
      throw new Error("Image upload failed");
    } catch (err) {
      console.error("Error uploading image:", err);
      throw err;
    }
  };

  const deleteImageFromBackend = async (productId, publicId) => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/product/delete-image",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, publicId }),
        }
      );
      if (!res.ok) throw new Error("Failed to remove image from product");
    } catch (err) {
      console.error("Error removing image:", err);
      throw err;
    }
  };

  const openModal = (prod = null) => {
    setForm(
      prod
        ? {
            name: prod.name || "",
            description: prod.description || "",
            price: prod.price?.toString() || "",
            discountedPrice: prod.discountedPrice?.toString() || "",
            category: category?._id || "",
            variants: prod.variants?.map((v) => ({
              color: v.color || "",
              images:
                v.images?.map((img) => ({
                  url: img.url || img || "",
                  publicId: img.publicId || null,
                })) || [],
            })) || [{ color: "", images: [] }],
            size: prod.size || [],
            sizeInput: prod.size?.join(", ") || "",
            tag: prod.tag?.name || "",
          }
        : initialFormState
    );
    setEditMode(!!prod);
    setEditId(prod?._id || null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm(initialFormState);
    setEditMode(false);
    setEditId(null);
    setIsLoading(false);
    setError(null);
  };

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...form.variants];
    if (field === "color") updatedVariants[index].color = value;
    else if (field === "image")
      updatedVariants[index].images = [
        ...updatedVariants[index].images,
        ...Array.from(value),
      ];
    setForm((prev) => ({ ...prev, variants: updatedVariants }));
  };

  const handleSizeChange = (e) => {
    setForm((prev) => ({
      ...prev,
      sizeInput: e.target.value,
      size: e.target.value
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s),
    }));
  };

  const addVariant = () =>
    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, { color: "", images: [] }],
    }));

  const removeVariant = (index) => {
    const updated = form.variants.filter((_, i) => i !== index);
    setForm({
      ...form,
      variants: updated.length ? updated : [{ color: "", images: [] }],
    });
  };

  const removeImage = async (variantIndex, imgIndex) => {
    const updatedVariants = [...form.variants];
    const image = updatedVariants[variantIndex].images[imgIndex];
    if (editMode && image.publicId) {
      try {
        await deleteImageFromBackend(editId, image.publicId);
      } catch (err) {
        setError(err.message);
        return;
      }
    }
    updatedVariants[variantIndex].images.splice(imgIndex, 1);
    setForm({ ...form, variants: updatedVariants });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const processedVariants = await Promise.all(
        form.variants.map(async (variant) => {
          const uploadedImages = await Promise.all(
            variant.images.map(async (image) => {
              if (typeof image === "string" && image.startsWith("http")) {
                return {
                  url: image,
                  publicId:
                    variant.images.find((img) => img.url === image)?.publicId ||
                    null,
                };
              }
              if (image instanceof File) {
                return await uploadImageToCloudinary(image);
              }
              return image;
            })
          );
          return { color: variant.color, images: uploadedImages };
        })
      );

      if (editMode) {
        const existing = products.find((p) => p._id === editId);
        const existingIds =
          existing?.variants
            ?.flatMap((v) => v.images.map((img) => img.publicId))
            ?.filter(Boolean) || [];
        const currentIds = processedVariants
          .flatMap((v) => v.images.map((img) => img.publicId))
          .filter(Boolean);
        const removed = existingIds.filter((id) => !currentIds.includes(id));
        await Promise.all(
          removed.map((publicId) => deleteImageFromBackend(editId, publicId))
        );
      }

      const url = editMode
        ? `http://localhost:5000/api/product/update/${editId}`
        : "http://localhost:5000/api/product/create";
      const response = await fetch(url, {
        method: editMode ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price) || 0,
          discountedPrice: parseFloat(form.discountedPrice) || undefined,
          variants: processedVariants,
          category: category?._id || "",
          size: form.size,
          tag: form.tag || undefined, // Send tag name instead of _id
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save product");
      }
      closeModal();
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:5000/api/product/delete/${id}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete product");
      }
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4 sm:p-6 font-sans">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-gray-800">
          {category?.name || "Products"}
        </h2>
        {isLoading && (
          <div className="text-center p-4">Loading products...</div>
        )}
        {error && (
          <div className="text-red-600 text-center p-4">
            Error: {error}
            <button
              onClick={() => {
                fetchProducts();
                fetchTags();
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded ml-4"
            >
              Retry
            </button>
          </div>
        )}
        {!isLoading && !error && products.length === 0 && (
          <div className="text-center p-4">No products found.</div>
        )}
        <div className="flex justify-center mb-4 sm:mb-6">
          <button
            onClick={() => openModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 rounded-md text-sm sm:text-base"
          >
            + Add Product
          </button>
        </div>
        {!isLoading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {products.map((prod) => (
              <div
                key={prod._id}
                className="bg-white shadow-lg rounded-lg overflow-hidden relative"
              >
                {prod.tag?.name && (
                  <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
                    {prod.tag.name}
                  </span>
                )}
                <img
                  src={
                    prod.variants[0]?.images[0]?.url ||
                    "https://via.placeholder.com/150"
                  }
                  alt={prod.name || "Product"}
                  className="w-full h-40 sm:h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">
                    {prod.name || "N/A"}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mb-2 truncate">
                    {prod.description || "No description"}
                  </p>
                  <p className="text-gray-900 font-bold text-sm sm:text-base">
                    ₹{prod.discountedPrice || prod.price || 0}
                    {prod.discountedPrice && (
                      <span className="line-through text-gray-500 ml-2 text-xs sm:text-sm">
                        ₹{prod.price || 0}
                      </span>
                    )}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {prod.variants?.map((v) => (
                      <span
                        key={v.color}
                        className="inline-block px-2 py-0.5 bg-gray-200 text-gray-800 rounded text-xs"
                      >
                        {v.color || "N/A"}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => openModal(prod)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 sm:px-4 py-1 rounded text-xs sm:text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(prod._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-1 rounded text-xs sm:text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 overflow-y-auto py-4">
            <div className="bg-white w-full max-w-md sm:max-w-lg p-4 sm:p-6 rounded-lg shadow-xl">
              <h3 className="text-xl sm:text-2xl font-bold mb-4">
                {editMode ? "Edit Product" : "Add Product"}
              </h3>
              {error && (
                <div className="text-red-600 mb-4 text-sm">{error}</div>
              )}
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Name"
                  className="border p-2 rounded w-full text-sm sm:text-base"
                  required
                />
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Description"
                  className="border p-2 rounded w-full text-sm sm:text-base"
                  required
                />
                <input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Price"
                  className="border p-2 rounded w-full text-sm sm:text-base"
                  required
                />
                <input
                  name="discountedPrice"
                  type="number"
                  value={form.discountedPrice}
                  onChange={handleChange}
                  placeholder="Discounted Price"
                  className="border p-2 rounded w-full text-sm sm:text-base"
                />
                <input
                  name="sizeInput"
                  value={form.sizeInput}
                  onChange={handleSizeChange}
                  placeholder="Sizes (comma-separated, e.g., S, M, L)"
                  className="border p-2 rounded w-full text-sm sm:text-base"
                />
                <select
                  name="tag"
                  value={form.tag}
                  onChange={handleChange}
                  className="border p-2 rounded w-full text-sm sm:text-base"
                >
                  <option value="">None</option>
                  {tags.map((tag) => (
                    <option key={tag._id} value={tag.name}>
                      {tag.name}
                    </option>
                  ))}
                </select>
                {form.variants.map((variant, index) => (
                  <div key={index} className="space-y-2 border p-2 rounded">
                    <input
                      type="text"
                      value={variant.color}
                      onChange={(e) =>
                        handleVariantChange(index, "color", e.target.value)
                      }
                      placeholder="Color"
                      className="border p-2 rounded w-full text-sm sm:text-base"
                      required
                    />
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) =>
                        handleVariantChange(index, "image", e.target.files)
                      }
                      className="border p-2 rounded w-full text-sm sm:text-base"
                      required={!editMode || !variant.images.length}
                    />
                    {variant.images.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs sm:text-sm text-gray-600">
                          Uploaded Images:
                        </p>
                        {variant.images.map((img, i) => (
                          <div
                            key={i}
                            className="flex justify-between text-xs sm:text-sm"
                          >
                            <span className="truncate">
                              {img.name || img.url || "Image"}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeImage(index, i)}
                              className="text-red-600"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {form.variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-1 rounded text-xs sm:text-sm"
                      >
                        Remove Variant
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addVariant}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-4 py-1 rounded text-xs sm:text-sm"
                >
                  + Add Variant
                </button>
                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-300 px-3 sm:px-4 py-2 rounded text-xs sm:text-sm"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white px-4 sm:px-6 py-2 rounded text-xs sm:text-sm"
                    disabled={isLoading}
                  >
                    {isLoading
                      ? "Saving..."
                      : editMode
                      ? "Update Product"
                      : "Create Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Products;
