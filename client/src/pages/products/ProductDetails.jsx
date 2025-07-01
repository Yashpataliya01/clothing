import React, { useState, useEffect } from "react";
import {
  Heart,
  Share2,
  ShoppingCart,
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProductDetailPage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const navigate = useNavigate();

  const parseColor = (colorName) => {
    if (!colorName) return "#cccccc";

    const tempElement = document.createElement("div");
    tempElement.style.color = colorName.toLowerCase().replace(/\s+/g, "");
    document.body.appendChild(tempElement);

    const computedColor = window.getComputedStyle(tempElement).color;
    document.body.removeChild(tempElement);

    if (
      computedColor &&
      computedColor !== "rgb(0, 0, 0)" &&
      colorName.toLowerCase() !== "black"
    ) {
      const rgbMatch = computedColor.match(/\d+/g);
      if (rgbMatch && rgbMatch.length >= 3) {
        const hex =
          "#" +
          rgbMatch
            .slice(0, 3)
            .map((x) => parseInt(x).toString(16).padStart(2, "0"))
            .join("");
        return hex;
      }
    }

    const colorMap = {
      "navy blue": "#000080",
      navyblue: "#000080",
      "light blue": "#ADD8E6",
      lightblue: "#ADD8E6",
      "dark blue": "#00008B",
      darkblue: "#00008B",
      "light green": "#90EE90",
      lightgreen: "#90EE90",
      "dark green": "#006400",
      darkgreen: "#006400",
      "light gray": "#D3D3D3",
      lightgray: "#D3D3D3",
      "dark gray": "#A9A9A9",
      darkgray: "#A9A9A9",
      "off white": "#F8F8FF",
      offwhite: "#F8F8FF",
    };

    const normalizedColor = colorName.toLowerCase().replace(/\s+/g, "");
    return colorMap[normalizedColor] || colorName.toLowerCase();
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const id = window.location.pathname.split("/").pop(); // Extract ID from URL
        const res = await fetch(`http://localhost:5000/api/product/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setProduct(data);
        setSelectedSize(data.size?.[0] || null); // Set first size if available
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, []);

  const handleVariantChange = (variantIndex) => {
    setSelectedVariantIndex(variantIndex);
    setSelectedImageIndex(0); // Reset to first image of selected variant
  };

  const handleImageNavigation = (direction) => {
    const currentVariant = product?.variants[selectedVariantIndex];
    const maxIndex = currentVariant?.images.length - 1 || 0;

    if (direction === "next") {
      setSelectedImageIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    } else {
      setSelectedImageIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    }
  };

  const handleAddToCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
      return;
    }

    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    setIsAddingToCart(true);
    try {
      const response = await fetch("http://localhost:5000/api/cart/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
          productId: product._id,
          quantity,
          size: selectedSize,
          color: product.variants[selectedVariantIndex].color,
        }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to add to cart");
      alert("Item added to cart successfully!");
    } catch (err) {
      console.error("Add to cart error:", err);
      alert("Error adding to cart: " + err.message);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const currentVariant = product?.variants[selectedVariantIndex];
  const currentImage =
    currentVariant?.images[selectedImageIndex]?.url || "/placeholder.jpg";

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
          <p className="text-gray-600 animate-pulse">
            Loading amazing product...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😵</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Product not found
          </h2>
          <p className="text-gray-600">
            The product you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="text-sm text-gray-500">
            <span className="hover:text-gray-900 transition-colors">Home</span>
            <span className="mx-2">/</span>
            <span className="hover:text-gray-900 transition-colors">
              {product.category?.name}
            </span>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-start">
          {/* Product Images */}
          <div className="lg:sticky lg:top-8">
            {/* Main Image */}
            <div className="relative group">
              <div
                className="w-full aspect-square rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden shadow-2xl cursor-zoom-in"
                onClick={() => setShowImageModal(true)}
              >
                <img
                  src={currentImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Image Navigation Arrows */}
                {currentVariant?.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageNavigation("prev");
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 flex items-center justify-center"
                    >
                      <ArrowLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageNavigation("next");
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 flex items-center justify-center"
                    >
                      <ArrowRight className="w-5 h-5 text-gray-700" />
                    </button>
                  </>
                )}

                {/* Discount Badge */}
                {product.discountedPrice && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    -
                    {Math.round(
                      (1 - product.discountedPrice / product.price) * 100
                    )}
                    %
                  </div>
                )}
              </div>

              {/* Image Indicators */}
              {currentVariant?.images.length > 1 && (
                <div className="flex justify-center mt-4 gap-2">
                  {currentVariant.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-3 h-3 rounded-full  ${
                        selectedImageIndex === index
                          ? "bg-black scale-125"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-3 mt-6 overflow-x-auto pb-2">
              {currentVariant?.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-18 h-18 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg`}
                >
                  <img
                    src={img.url}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="mt-10 lg:mt-0">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                  {product.name}
                </h1>
                <p className="mt-2 text-sm text-gray-500 uppercase tracking-wider font-medium">
                  {product.category?.name}
                </p>
              </div>
            </div>

            {/* Price */}
            <div className="mb-8">
              <div className="flex items-baseline gap-4 mb-2">
                {product.discountedPrice ? (
                  <>
                    <span className="text-3xl font-bold text-gray-900">
                      ₹ {product.discountedPrice.toFixed(2)}
                    </span>
                    <span className="text-xl text-gray-400 line-through">
                      ₹{product.price.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-4xl font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>
              <p className="text-sm text-green-600 font-medium">
                Free shipping on orders over ₹1500
              </p>
            </div>

            {/* Color Selection */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Color</h3>
                <span className="text-sm text-gray-500">
                  {currentVariant?.name}
                </span>
              </div>
              <div className="flex gap-3">
                {product.variants.map((variant, index) => (
                  <button
                    key={index}
                    onClick={() => handleVariantChange(index)}
                    className={`relative w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                      selectedVariantIndex === index
                        ? "border-gray-900 ring-2 ring-offset-2 ring-gray-400 scale-110"
                        : "border-gray-300 hover:border-gray-500 hover:scale-105"
                    }`}
                    style={{ backgroundColor: parseColor(variant.color) }}
                  >
                    {selectedVariantIndex === index && (
                      <div className="absolute inset-0 rounded-full bg-white/20"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            {product.size && product.size.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Size</h3>
                  <button className="text-sm text-gray-500 hover:text-gray-700 underline">
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {product.size.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 px-4 border-2 rounded-xl font-medium transition-all duration-300 ${
                        selectedSize === size
                          ? "border-black bg-black text-white"
                          : "border-gray-200 bg-white text-gray-900 hover:border-gray-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quantity
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 py-3 font-semibold min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className={`w-full py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                  isAddingToCart
                    ? "bg-gray-900 text-white cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-900 hover:scale-[1.02] shadow-lg hover:shadow-xl"
                }`}
              >
                {isAddingToCart ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <ShoppingCart className="w-6 h-6" />
                    Add to Cart
                  </>
                )}
              </button>
            </div>

            {/* Product Details Tabs */}
            <div className="border-t border-gray-200 pt-8">
              <div className="flex border-b border-gray-200 mb-6">
                {["description"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-3 px-6 font-medium capitalize transition-all duration-300 border-b-2 ${
                      activeTab === tab
                        ? "border-black text-black"
                        : "border-transparent text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="prose prose-gray max-w-none">
                {activeTab === "description" && (
                  <p className="text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={currentImage}
              alt={product.name}
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
