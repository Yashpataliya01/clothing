import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

const Products = () => {
  const { id } = useParams();
  const location = useLocation();
  const category = location.state?.category;

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    discountedPrice: "",
    category: category?._id || "",
    variants: [{ color: "", images: [] }],
    size: [],
    tag: "",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Cloudinary configuration
  const CLOUDINARY_UPLOAD_PRESET = "bg8efuux";
  const CLOUDINARY_CLOUD_NAME = "dlyq8wjky";
  const CLOUDINARY_API_KEY = "683781286465483";
  const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

  // Tag options
  const tagOptions = [
    { value: "", label: "None" },
    { value: "New", label: "New" },
    { value: "Trending", label: "Trending" },
    { value: "Sale", label: "Sale" },
  ];

  async function fetchProducts() {
    if (!category?._id) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/product?category=${category._id}`
      );
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, [category]);

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
        "http://localhost:5000/api/products/delete-image",
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

  const openModal = (prod = null) => {
    if (prod) {
      setForm({
        name: prod.name,
        description: prod.description,
        price: prod.price.toString(),
        discountedPrice: prod.discountedPrice?.toString() || "",
        category: category?._id || "",
        variants: prod.variants.map((variant) => ({
          color: variant.color,
          images: variant.images.map((img) => ({
            url: img.url || img,
            publicId: img.publicId || null,
          })),
        })),
        size: prod.size,
        tag: prod.tag || "",
      });
      setEditMode(true);
      setEditId(prod._id);
    } else {
      setForm({
        name: "",
        description: "",
        price: "",
        discountedPrice: "",
        category: category?._id || "",
        variants: [{ color: "", images: [] }],
        size: [],
        tag: "",
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
      description: "",
      price: "",
      discountedPrice: "",
      category: category?._id || "",
      variants: [{ color: "", images: [] }],
      size: [],
      tag: "",
    });
    setEditMode(false);
    setEditId(null);
    setIsLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...form.variants];
    if (field === "color") {
      newVariants[index].color = value;
    } else if (field === "image") {
      newVariants[index].images = [
        ...newVariants[index].images,
        ...Array.from(value),
      ];
    }
    setForm({ ...form, variants: newVariants });
  };

  const handleSizeChange = (value) => {
    const sizes = value
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);
    setForm({ ...form, size: sizes });
  };

  const addVariant = () => {
    setForm({
      ...form,
      variants: [...form.variants, { color: "", images: [] }],
    });
  };

  const removeVariant = (index) => {
    const newVariants = form.variants.filter((_, i) => i !== index);
    setForm({
      ...form,
      variants:
        newVariants.length > 0 ? newVariants : [{ color: "", images: [] }],
    });
  };

  const removeImage = (variantIndex, imageIndex) => {
    const newVariants = [...form.variants];
    newVariants[variantIndex].images = newVariants[variantIndex].images.filter(
      (_, i) => i !== imageIndex
    );
    setForm({ ...form, variants: newVariants });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Process variants for Cloudinary upload
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
              const result = await uploadImageToCloudinary(image);
              return result;
            })
          );
          return { color: variant.color, images: uploadedImages };
        })
      );

      // Delete old images in edit mode
      if (editMode) {
        const existingProduct = products.find((p) => p._id === editId);
        const oldImagePublicIds = existingProduct.variants
          .flatMap((v) => v.images.map((img) => img.publicId))
          .filter(
            (id) =>
              id &&
              !processedVariants.some((v) =>
                v.images.some((img) => img.publicId === id)
              )
          );
        await Promise.all(
          oldImagePublicIds.map((publicId) =>
            deleteImageFromCloudinary(publicId)
          )
        );
      }

      const url = editMode
        ? `http://localhost:5000/api/product/update/${editId}`
        : "http://localhost:5000/api/product/create";
      const method = editMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          discountedPrice: parseFloat(form.discountedPrice) || undefined,
          variants: processedVariants,
          category: category?._id,
          tag: form.tag,
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const product = products.find((p) => p._id === id);
      const publicIds = product.variants
        .flatMap((v) => v.images.map((img) => img.publicId))
        .filter((id) => id);
      await Promise.all(
        publicIds.map((publicId) => deleteImageFromCloudinary(publicId))
      );

      await fetch(`http://localhost:5000/api/product/delete/${id}`, {
        method: "DELETE",
      });
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        {category?.name} Products
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
            className="bg-white shadow-lg rounded-lg overflow-hidden relative"
          >
            {prod.tag && (
              <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
                {prod.tag}
              </span>
            )}
            <img
              src={
                prod.variants[0]?.images[0]?.url ||
                prod.variants[0]?.images[0] ||
                "https://via.placeholder.com/150"
              }
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
                {prod.variants.map((v) => (
                  <span
                    key={v.color}
                    className="inline-block px-2 py-0.5 bg-gray-200 text-gray-800 rounded"
                  >
                    {v.color}
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

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 overflow-y-auto py-4">
          <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-xl relative">
            <h3 className="text-2xl font-bold mb-4">
              {editMode ? "Edit Product" : "Add Product"}
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
                name="size"
                autoComplete="off"
                value={form.size.join(",")}
                onChange={(e) => {
                  const value = e.target.value;
                  setForm({
                    ...form,
                    size: value.split(",").map((s) => s.trim()),
                  });
                }}
                placeholder="Sizes (comma-separated)"
                className="border p-2 rounded w-full"
              />

              <select
                name="tag"
                value={form.tag}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              >
                {tagOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {form.variants.map((variant, index) => (
                <div key={index} className="space-y-2">
                  <input
                    type="text"
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
                    accept="image/*"
                    multiple
                    onChange={(e) =>
                      handleVariantChange(index, "image", e.target.files)
                    }
                    className="border p-2 rounded w-full"
                    required={!editMode || !variant.images.length}
                  />
                  {variant.images.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">Uploaded Images:</p>
                      {variant.images.map((img, imgIndex) => (
                        <div
                          key={imgIndex}
                          className="flex items-center space-x-2"
                        >
                          <span className="text-sm text-gray-600">
                            {typeof img === "string" ? img : img.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeImage(index, imgIndex)}
                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {editMode && variant.images.length > 0 && (
                    <p className="text-sm text-gray-600">
                      Current images will be kept unless new ones are uploaded
                    </p>
                  )}
                  {form.variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                    >
                      Remove Variant
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addVariant}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
              >
                Add Variant
              </button>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-300 px-4 py-2 rounded"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded"
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

export default Products;
