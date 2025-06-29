// src/components/ProductsPage.js
import React, { useState, useEffect, useMemo } from "react";
import { ChevronDown, ChevronUp, Grid3X3, List, X } from "lucide-react";
import { useLocation } from "react-router-dom";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    size: [],
    colors: [],
    gender: [],
    tags: [],
    minPrice: "",
    maxPrice: "",
  });
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState("grid");
  const [openFilters, setOpenFilters] = useState({
    price: true,
    discounts: true,
    size: true,
    color: true,
    stockStatus: true,
    preorder: true,
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);

  const location = useLocation();
  const categoryId = location.state?.categoryId;

  // Fetch products based on filters and category
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (categoryId) queryParams.append("category", categoryId);
      if (filters.size.length)
        queryParams.append("size", filters.size.join(","));
      if (filters.colors.length)
        queryParams.append("colors", filters.colors.join(","));
      if (filters.gender.length)
        queryParams.append("gender", filters.gender.join(","));
      if (filters.tags.length)
        queryParams.append("tags", filters.tags.join(","));
      if (filters.minPrice) queryParams.append("minPrice", filters.minPrice);
      if (filters.maxPrice) queryParams.append("maxPrice", filters.maxPrice);

      const res = await fetch(
        `http://localhost:5000/api/product?${queryParams}`
      );
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters, categoryId]);

  // Extract unique filter options from products
  const filterOptions = useMemo(() => {
    const sizes = new Set();
    const colors = new Set();
    const genders = new Set();
    const tags = new Set();

    products.forEach((product) => {
      product.size.forEach((s) => sizes.add(s.toUpperCase()));
      product.variants.forEach((variant) => colors.add(variant.color));
      if (product.category?.gender) genders.add(product.category.gender);
      if (product.tag) tags.add(product.tag);
    });

    return {
      sizes: Array.from(sizes).sort(),
      colors: Array.from(colors).sort(),
      genders: Array.from(genders).sort(),
      tags: Array.from(tags).sort(),
    };
  }, [products]);

  // Sort products locally (optional, since backend can handle sorting)
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];
    switch (sortBy) {
      case "price-low-high":
        result.sort(
          (a, b) =>
            (a.discountedPrice || a.price) - (b.discountedPrice || b.price)
        );
        break;
      case "price-high-low":
        result.sort(
          (a, b) =>
            (b.discountedPrice || b.price) - (a.discountedPrice || a.price)
        );
        break;
      default:
        break;
    }
    return result;
  }, [products, sortBy]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter((item) => item !== value)
        : [...prev[filterType], value],
    }));
  };

  const handlePriceChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value ? parseFloat(value) : "",
    }));
  };

  const clearFilters = () => {
    setFilters({
      size: [],
      colors: [],
      gender: [],
      tags: [],
      minPrice: "",
      maxPrice: "",
    });
  };

  const toggleFilterSection = (section) => {
    setOpenFilters((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Color parsing function from NewArrivalsGrid
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

  const FilterSection = ({ title, filterType, options, isOpen, onToggle }) => (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left font-medium text-gray-700 hover:text-gray-900 text-sm uppercase tracking-wide"
      >
        {title}
        {isOpen ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>
      {isOpen && filterType === "price" && (
        <div className="mt-3 space-y-2">
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min Price"
              value={filters.minPrice || ""}
              onChange={(e) => handlePriceChange("minPrice", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice || ""}
              onChange={(e) => handlePriceChange("maxPrice", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>
      )}
      {isOpen && options && (
        <div className="mt-3 space-y-2">
          {options.map((option) => (
            <label key={option} className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={filters[filterType]?.includes(option) || false}
                onChange={() => handleFilterChange(filterType, option)}
                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded-sm"
              />
              <span className="ml-2 text-gray-600 capitalize">{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );

  const ProductCard = ({ product }) => {
    const displayPrice = product.discountedPrice || product.price;
    const hasDiscount =
      product.discountedPrice && product.discountedPrice < product.price;
    const discountPercentage = hasDiscount
      ? Math.round((1 - product.discountedPrice / product.price) * 100)
      : 0;

    return (
      <div className="group cursor-pointer rounded-lg">
        <div className="relative aspect-[4/5] mb-4 overflow-hidden bg-gray-50">
          <img
            src={product.variants?.[0]?.images?.[0]?.url || ""}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-opacity duration-300"
          />
          <img
            src={
              product.variants?.[0]?.images?.[1]?.url ||
              product.variants?.[0]?.images?.[0]?.url ||
              ""
            }
            alt={`${product.name} Alt`}
            className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
          {product.tag && (
            <div className="absolute top-3 left-3 bg-black text-white px-3 py-1 text-xs font-medium">
              {product.tag}
            </div>
          )}
        </div>

        <div className="space-y-3 p-4">
          <h3 className="text-lg font-medium text-gray-900 leading-tight line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-lg font-medium text-gray-900">
              ₹{displayPrice.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.price.toLocaleString()}
              </span>
            )}
            {hasDiscount && (
              <span className="text-xs text-pink-500 font-medium">
                Save {discountPercentage}%
              </span>
            )}
          </div>
          {product.variants && product.variants.length > 0 && (
            <div className="flex items-center gap-2">
              {product.variants.slice(0, 5).map((variant, i) => (
                <div
                  key={i}
                  className="w-5 h-5 rounded-full border border-gray-200 transform transition-transform hover:scale-125"
                  style={{ backgroundColor: parseColor(variant.color) }}
                  title={variant.color}
                />
              ))}
              {product.variants.length > 5 && (
                <span className="text-xs text-gray-500 ml-1">
                  +{product.variants.length - 5}
                </span>
              )}
            </div>
          )}
          {product.size && product.size.length > 0 && (
            <div className="text-sm text-gray-600">
              {product.size.map((s) => s.toUpperCase()).join(" • ")}
            </div>
          )}
        </div>
      </div>
    );
  };

  const FilterModal = () => (
    <div className="fixed inset-0 bg-gradient-to-b from-gray-200/20 to-gray-300/20 backdrop-blur-lg z-50 flex justify-end">
      <div className="bg-white w-4/5 max-w-sm h-full p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-900">Filters</h2>
          <button
            onClick={() => setIsFilterModalOpen(false)}
            aria-label="Close filters"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="space-y-0">
          <FilterSection
            title="PRICE"
            filterType="price"
            options={null}
            isOpen={openFilters.price}
            onToggle={() => toggleFilterSection("price")}
          />
          <FilterSection
            title="DISCOUNTS"
            filterType="discounts"
            options={null}
            isOpen={openFilters.discounts}
            onToggle={() => toggleFilterSection("discounts")}
          />
          <FilterSection
            title="SIZE"
            filterType="size"
            options={filterOptions.sizes}
            isOpen={openFilters.size}
            onToggle={() => toggleFilterSection("size")}
          />
          <FilterSection
            title="COLOR"
            filterType="colors"
            options={filterOptions.colors}
            isOpen={openFilters.color}
            onToggle={() => toggleFilterSection("color")}
          />
          <FilterSection
            title="STOCK STATUS"
            filterType="stockStatus"
            options={null}
            isOpen={openFilters.stockStatus}
            onToggle={() => toggleFilterSection("stockStatus")}
          />
          <FilterSection
            title="PREORDER"
            filterType="preorder"
            options={null}
            isOpen={openFilters.preorder}
            onToggle={() => toggleFilterSection("preorder")}
          />
        </div>
        <button
          onClick={clearFilters}
          className="mt-4 w-full bg-gray-200 text-gray-700 py-2 rounded-md text-sm font-medium"
        >
          Clear Filters
        </button>
        <button
          onClick={() => setIsFilterModalOpen(false)}
          className="mt-2 w-full bg-black text-white py-2 rounded-md text-sm font-medium"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );

  const SortModal = () => (
    <div className="fixed inset-0 bg-gradient-to-b from-gray-200/20 to-gray-300/20 backdrop-blur-lg z-50 flex items-end">
      <div className="bg-white w-full p-6 rounded-t-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Sort By</h2>
          <button
            onClick={() => setIsSortModalOpen(false)}
            aria-label="Close sort options"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="space-y-2">
          {["relevance", "price-low-high", "price-high-low"].map((option) => (
            <label key={option} className="flex items-center text-sm">
              <input
                type="radio"
                checked={sortBy === option}
                onChange={() => {
                  setSortBy(option);
                  setIsSortModalOpen(false);
                }}
                className="h-4 w-4 text-black focus:ring-black border-gray-300"
              />
              <span className="ml-2 text-gray-600 capitalize">
                {option === "relevance"
                  ? "Relevance"
                  : option === "price-low-high"
                  ? "Price: Low to High"
                  : "Price: High to Low"}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Filter Bar */}
        <div className="lg:hidden border-b border-gray-200 py-4 sticky top-0 bg-gray-50 z-10">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsFilterModalOpen(true)}
              aria-label="Open filters"
              className="flex items-center space-x-2 text-gray-700 bg-white px-4 py-2 rounded-md shadow-sm"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="4" y1="21" x2="4" y2="14" />
                <line x1="4" y1="10" x2="4" y2="3" />
                <line x1="12" y1="21" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12" y2="3" />
                <line x1="20" y1="21" x2="20" y2="16" />
                <line x1="20" y1="12" x2="20" y2="3" />
                <line x1="1" y1="14" x2="7" y2="14" />
                <line x1="9" y1="8" x2="15" y2="8" />
                <line x1="17" y1="16" x2="23" y2="16" />
              </svg>
              <span className="text-sm font-medium">Filters</span>
            </button>

            <button
              onClick={() => setIsSortModalOpen(true)}
              aria-label="Open sort options"
              className="flex items-center space-x-2 text-gray-700 bg-white px-4 py-2 rounded-md shadow-sm"
            >
              <span className="text-sm font-medium">Sort</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Render Modals */}
        {isFilterModalOpen && <FilterModal />}
        {isSortModalOpen && <SortModal />}

        <div className="flex gap-8 py-6">
          {/* Left Sidebar - Filters (Desktop only) */}
          <div className="w-64 flex-shrink-0 hidden lg:block">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Filters
              </h2>
              <div className="space-y-0">
                <FilterSection
                  title="PRICE"
                  filterType="price"
                  options={null}
                  isOpen={openFilters.price}
                  onToggle={() => toggleFilterSection("price")}
                />
                <FilterSection
                  title="DISCOUNTS"
                  filterType="discounts"
                  options={null}
                  isOpen={openFilters.discounts}
                  onToggle={() => toggleFilterSection("discounts")}
                />
                <FilterSection
                  title="SIZE"
                  filterType="size"
                  options={filterOptions.sizes}
                  isOpen={openFilters.size}
                  onToggle={() => toggleFilterSection("size")}
                />
                <FilterSection
                  title="COLOR"
                  filterType="colors"
                  options={filterOptions.colors}
                  isOpen={openFilters.color}
                  onToggle={() => toggleFilterSection("color")}
                />
                <FilterSection
                  title="STOCK STATUS"
                  filterType="stockStatus"
                  options={null}
                  isOpen={openFilters.stockStatus}
                  onToggle={() => toggleFilterSection("stockStatus")}
                />
                <FilterSection
                  title="PREORDER"
                  filterType="preorder"
                  options={null}
                  isOpen={openFilters.preorder}
                  onToggle={() => toggleFilterSection("preorder")}
                />
              </div>
              <button
                onClick={clearFilters}
                className="mt-4 w-full bg-gray-200 text-gray-700 py-2 rounded-md text-sm font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Right Content - Products */}
          <div className="flex-1">
            {/* Desktop Top Bar */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                {loading ? (
                  <span className="text-sm font-medium text-gray-900">
                    Loading...
                  </span>
                ) : error ? (
                  <span className="text-sm font-medium text-red-600">
                    Error: {error}
                  </span>
                ) : (
                  <span className="text-sm font-medium text-gray-900">
                    {filteredAndSortedProducts.length} products
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1 ${
                      viewMode === "grid" ? "text-black" : "text-gray-400"
                    }`}
                    aria-label="Grid view"
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1 ${
                      viewMode === "list" ? "text-black" : "text-gray-400"
                    }`}
                    aria-label="List view"
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border-gray-300 bg-white text-sm text-gray-900 focus:ring-2 focus:ring-black rounded-md px-2 py-1"
                  aria-label="Sort products"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Mobile Product Count */}
            <div className="lg:hidden mb-4">
              {loading ? (
                <span className="text-sm font-medium text-gray-900">
                  Loading...
                </span>
              ) : error ? (
                <span className="text-sm font-medium text-red-600">
                  Error: {error}
                </span>
              ) : (
                <span className="text-sm font-medium text-gray-900">
                  {filteredAndSortedProducts.length} products
                </span>
              )}
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 mx-auto mb-6 animate-spin">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    className="w-full h-full text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 12a8 8 0 0116 0 8 8 0 01-16 0z"
                    />
                  </svg>
                </div>
                <p className="text-gray-600">Loading products...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 mx-auto mb-6 opacity-30">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    className="w-full h-full"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-light text-gray-800 mb-2">
                  Failed to load products
                </h3>
                <p className="text-gray-600">{error}</p>
              </div>
            ) : filteredAndSortedProducts.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 mx-auto mb-6 opacity-30">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    className="w-full h-full"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-light text-gray-800 mb-2">
                  No products available
                </h3>
                <p className="text-gray-600">
                  Check back soon for new arrivals
                </p>
              </div>
            ) : (
              <div
                className={`grid gap-4 lg:gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
