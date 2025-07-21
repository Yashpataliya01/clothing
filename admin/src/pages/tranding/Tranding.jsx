import React, { useEffect, useState, Component } from "react";

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
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null); // New state for error handling

  const initialFormState = {
    name: "",
    description: "",
    price: "",
    discountedPrice: "",
    category: "",
    variants: [{ color: "", images: [] }],
    size: [],
    tag: "",
  };

  const [form, setForm] = useState(initialFormState);

  const CLOUDINARY_UPLOAD_PRESET = "bg8efuux";
  const CLOUDINARY_CLOUD_NAME = "dlyq8wjky";
  const CLOUDINARY_API_KEY = "683781286465483";
  const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null); // Reset error state
    try {
      const res = await fetch(
        `http://localhost:5000/api/product?tags=${encodeURIComponent(
          "Most Trending"
        )}`
      );
      if (!res.ok) {
        throw new Error(`Failed to fetch products: ${res.statusText}`);
      }
      const data = await res.json();
      // Ensure data is an array; if not, set to empty array
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
      setProducts([]); // Ensure products is an array to prevent map error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/categorie");
        if (!res.ok) {
          throw new Error(`Failed to fetch categories: ${res.statusText}`);
        }
        const data = await res.json();
        // Ensure categories is an array
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError(err.message);
        setCategories([]);
      }
    };
    fetchCategories();
    fetchProducts();
  }, []);

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("api_key", CLOUDINARY_API_KEY);

    const res = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Image upload failed");
    }

    const data = await res.json();
    if (data.secure_url) {
      return { url: data.secure_url, publicId: data.public_id };
    }
    throw new Error("Upload failed");
  };

  const deleteImageFromCloudinary = async (publicId) => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/product/delete-image",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId }),
        }
      );
      if (!res.ok) {
        throw new Error("Failed to delete image");
      }
    } catch (err) {
      console.error("Delete image error:", err);
    }
  };

  const openModal = (prod = null) => {
    if (prod) {
      setForm({
        name: prod.name || "",
        description: prod.description || "",
        price: prod.price?.toString() || "",
        discountedPrice: prod.discountedPrice?.toString() || "",
        category: prod.category?._id || "",
        variants: prod.variants?.map((variant) => ({
          color: variant.color || "",
          images:
            variant.images?.map((img) => ({
              url: img.url || img || "",
              publicId: img.publicId || null,
            })) || [],
        })) || [{ color: "", images: [] }],
        size: prod.size || [],
        tag: "Most Trending",
      });
      setEditMode(true);
      setEditId(prod._id);
    } else {
      setForm(initialFormState);
      setEditMode(false);
      setEditId(null);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm(initialFormState);
    setEditMode(false);
    setEditId(null);
    setIsLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

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
    const sizes = e.target.value.split(",").map((s) => s.trim());
    setForm((prev) => ({ ...prev, size: sizes }));
  };

  const removeVariant = (index) => {
    const updated = form.variants.filter((_, i) => i !== index);
    setForm({
      ...form,
      variants: updated.length ? updated : [{ color: "", images: [] }],
    });
  };

  const removeImage = (variantIndex, imgIndex) => {
    const updated = [...form.variants];
    updated[variantIndex].images.splice(imgIndex, 1);
    setForm({ ...form, variants: updated });
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
              if (typeof image === "string" || image.url) {
                return image;
              }
              return await uploadImageToCloudinary(image);
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

        const currentIds = processedVariants.flatMap((v) =>
          v.images.map((img) => img.publicId)
        );

        const removed = existingIds.filter((id) => !currentIds.includes(id));
        await Promise.all(removed.map(deleteImageFromCloudinary));
      }

      const url = editMode
        ? `http://localhost:5000/api/product/update/${editId}`
        : "http://localhost:5000/api/product/create";

      const method = editMode ? "PUT" : "POST";

      const payload = {
        ...form,
        price: parseFloat(form.price) || 0,
        discountedPrice: parseFloat(form.discountedPrice) || undefined,
        variants: processedVariants,
        category: form.category || categories[0]?._id || "",
        tag: "Most Trending",
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to save");
      }

      closeModal();
      fetchProducts();
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const prod = products.find((p) => p._id === id);
      const publicIds =
        prod?.variants
          ?.flatMap((v) => v.images.map((img) => img.publicId))
          ?.filter(Boolean) || [];
      await Promise.all(publicIds.map(deleteImageFromCloudinary));

      const res = await fetch(
        `http://localhost:5000/api/product/delete/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete product");
      }

      fetchProducts();
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="max-w-6xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Trending Products
        </h2>

        {isLoading && (
          <div className="text-center p-4">Loading products...</div>
        )}
        {error && (
          <div className="text-red-600 text-center p-4">
            Error: {error}
            <button
              onClick={fetchProducts}
              className="bg-blue-600 text-white px-4 py-2 rounded ml-4"
            >
              Retry
            </button>
          </div>
        )}
        {!isLoading && !error && products.length === 0 && (
          <div className="text-center p-4">No products found.</div>
        )}

        <div className="flex justify-center mb-4">
          <button
            onClick={() => openModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            + Add Product
          </button>
        </div>

        {!isLoading && !error && products.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((prod) => (
              <div
                key={prod?._id}
                className="bg-white shadow p-4 rounded relative"
              >
                {prod?.tag && (
                  <span className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 text-xs rounded">
                    {prod?.tag}
                  </span>
                )}
                <img
                  src={
                    prod?.variants[0]?.images[0]?.url ||
                    prod?.variants[0]?.images[0] ||
                    "https://via.placeholder.com/150"
                  }
                  alt={prod?.name || "Product"}
                  className="w-full h-40 object-cover rounded"
                />
                <h3 className="font-semibold mt-2">{prod?.name || "N/A"}</h3>
                <p className="text-sm text-gray-Gfx600">
                  {prod?.description || "No description"}
                </p>
                <p className="text-lg font-bold">
                  ₹{prod?.discountedPrice || prod?.price || 0}
                  {prod?.discountedPrice && (
                    <span className="line-through ml-2 text-gray-400 text-sm">
                      ₹{prod?.price || 0}
                    </span>
                  )}
                </p>
                <div className="flex flex-wrap mt-2 gap-1">
                  {prod?.variants?.map((v) => (
                    <span
                      key={v?.color}
                      className="text-xs bg-gray-200 px-2 py-1 rounded"
                    >
                      {v?.color || "N/A"}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between mt-3">
                  <button
                    onClick={() => openModal(prod)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(prod._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-start justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-lg p-6 rounded shadow-lg">
              <h3 className="text-xl font-bold mb-4">
                {editMode ? "Edit Product" : "Add Product"}
              </h3>
              {error && <div className="text-red-600 mb-4">{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Product name"
                  className="border w-full p-2 rounded"
                  required
                />
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Description"
                  className="border w-full p-2 rounded"
                  required
                />
                <input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Price"
                  className="border w-full p-2 rounded"
                  required
                />
                <input
                  name="discountedPrice"
                  type="number"
                  value={form.discountedPrice}
                  onChange={handleChange}
                  placeholder="Discounted Price"
                  className="border w-full p-2 rounded"
                />
                <input
                  name="size"
                  value={form.size.join(",")}
                  onChange={handleSizeChange}
                  placeholder="Sizes (comma-separated)"
                  className="border w-full p-2 rounded"
                />
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="border w-full p-2 rounded"
                >
                  {categories.length === 0 ? (
                    <option value="">No categories available</option>
                  ) : (
                    categories.map((tag) => (
                      <option key={tag._id} value={tag._id}>
                        {tag.name + " " + (tag.gender || "None")}
                      </option>
                    ))
                  )}
                </select>

                {form.variants.map((variant, index) => (
                  <div key={index} className="border p-2 rounded space-y-2">
                    <input
                      value={variant.color}
                      onChange={(e) =>
                        handleVariantChange(index, "color", e.target.value)
                      }
                      placeholder="Color"
                      className="border p-2 rounded w-full"
                      required
                    />
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) =>
                        handleVariantChange(index, "image", e.target.files)
                      }
                      className="border notato sans p-2 rounded w-full"
                      required={!editMode || variant.images.length === 0}
                    />
                    {variant.images.length > 0 &&
                      variant.images.map((img, i) => (
                        <div
                          key={i}
                          className="flex justify-between text-sm overflow-hidden"
                        >
                          <span>{img.name || img.url || "Image"}</span>
                          <button
                            type="button"
                            onClick={() => removeImage(index, i)}
                            className="text-red-600 text-xs"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    {form.variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Remove Variant
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      variants: [...prev.variants, { color: "", images: [] }],
                    }))
                  }
                  className="bg-blue-500 text-white px-4 py-1 rounded"
                >
                  + Add Variant
                </button>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-300 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-6 py-2 rounded"
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
