import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Grid3X3, List } from "lucide-react";
import FilterSection from "./components/FilterSection";
import FilterModal from "./components/FilterModal";
import SortModal from "./components/SortModal";
import ProductGrid from "./components/ProductGrid";
import FilterBar from "./components/FilterBar";
import { useGetProductsQuery } from "../../services/productsApi.js";

const ProductsPage = () => {
  const location = useLocation();
  const categoryId = location.state?.categoryId || null;
  const initialTag = location.state?.tags || null;
  const initialGender = location.state?.gender || null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const [filters, setFilters] = useState({
    size: [],
    colors: [],
    gender: initialGender ? [initialGender] : [],
    tags: initialTag ? [initialTag] : [],
    minPrice: "",
    maxPrice: "",
    category: categoryId ? [categoryId] : [],
    categoryName: [],
  });
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState("grid");
  const [openFilters, setOpenFilters] = useState({
    price: true,
    size: true,
    color: true,
    gender: true,
    tags: true,
    categoryName: true,
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);

  const {
    data: products = [],
    isLoading,
    error,
  } = useGetProductsQuery({
    category: categoryId || undefined,
    size: filters.size.length ? filters.size.join(",") : undefined,
    colors: filters.colors.length ? filters.colors.join(",") : undefined,
    gender: filters.gender.length ? filters.gender.join(",") : undefined,
    tags: filters.tags.length ? filters.tags.join(",") : undefined,
    minPrice: filters.minPrice || undefined,
    maxPrice: filters.maxPrice || undefined,
    categoryName: filters.categoryName.length
      ? filters.categoryName.join(",")
      : undefined,
  });

  const filterOptions = useMemo(() => {
    const sizes = new Set();
    const colors = new Set();
    const genders = new Set();
    const tags = new Set(initialTag ? [initialTag] : []);
    const categoryNames = new Set();

    products.forEach((product) => {
      if (product.size && Array.isArray(product.size)) {
        product.size.forEach((s) => sizes.add(s));
      }
      if (product.variants && Array.isArray(product.variants)) {
        product.variants.forEach((variant) => colors.add(variant.color));
      }
      if (product.category?.gender) {
        const normalizedGender =
          product.category.gender.charAt(0).toUpperCase() +
          product.category.gender.slice(1).toLowerCase();
        genders.add(normalizedGender);
      }
      if (product.tag) {
        tags.add(product.tag);
      }
      if (product.category?.name) {
        categoryNames.add(product.category.name);
      }
    });

    const options = {
      sizes: Array.from(sizes).sort(),
      colors: Array.from(colors).sort(),
      genders: Array.from(genders).sort(),
      tags: Array.from(tags).sort(),
      categoryNames: Array.from(categoryNames).sort(),
    };
    return options;
  }, [products, initialTag]);

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
    const normalizedValue =
      filterType === "gender"
        ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
        : value;
    setFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType].includes(normalizedValue)
        ? prev[filterType].filter((item) => item !== normalizedValue)
        : [...prev[filterType], normalizedValue],
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
      tags: initialTag ? [initialTag] : [],
      minPrice: "",
      maxPrice: "",
      category: categoryId ? [categoryId] : [],
      categoryName: [],
    });
  };

  const toggleFilterSection = (section) => {
    setOpenFilters((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
        <FilterBar
          setIsFilterModalOpen={setIsFilterModalOpen}
          setIsSortModalOpen={setIsSortModalOpen}
        />

        {isFilterModalOpen && (
          <FilterModal
            filters={filters}
            handleFilterChange={handleFilterChange}
            handlePriceChange={handlePriceChange}
            openFilters={openFilters}
            toggleFilterSection={toggleFilterSection}
            clearFilters={clearFilters}
            setIsFilterModalOpen={setIsFilterModalOpen}
            filterOptions={filterOptions}
          />
        )}
        {isSortModalOpen && (
          <SortModal
            sortBy={sortBy}
            setSortBy={setSortBy}
            setIsSortModalOpen={setIsSortModalOpen}
          />
        )}

        <div className="flex gap-8 py-6">
          <div className="w-l flex-shrink-0 hidden lg:block">
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
                  filters={filters}
                  handleFilterChange={handleFilterChange}
                  handlePriceChange={handlePriceChange}
                />
                <FilterSection
                  title="SIZE"
                  filterType="size"
                  options={filterOptions.sizes}
                  isOpen={openFilters.size}
                  onToggle={() => toggleFilterSection("size")}
                  filters={filters}
                  handleFilterChange={handleFilterChange}
                  handlePriceChange={handlePriceChange}
                />
                <FilterSection
                  title="COLOR"
                  filterType="colors"
                  options={filterOptions.colors}
                  isOpen={openFilters.color}
                  onToggle={() => toggleFilterSection("color")}
                  filters={filters}
                  handleFilterChange={handleFilterChange}
                  handlePriceChange={handlePriceChange}
                />
                <FilterSection
                  title="GENDER"
                  filterType="gender"
                  options={filterOptions.genders}
                  isOpen={openFilters.gender}
                  onToggle={() => toggleFilterSection("gender")}
                  filters={filters}
                  handleFilterChange={handleFilterChange}
                  handlePriceChange={handlePriceChange}
                />
                <FilterSection
                  title="TAGS"
                  filterType="tags"
                  options={filterOptions.tags}
                  isOpen={openFilters.tags}
                  onToggle={() => toggleFilterSection("tags")}
                  filters={filters}
                  handleFilterChange={handleFilterChange}
                  handlePriceChange={handlePriceChange}
                />
                <FilterSection
                  title="CATEGORY"
                  filterType="categoryName"
                  options={filterOptions.categoryNames}
                  isOpen={openFilters.categoryName}
                  onToggle={() => toggleFilterSection("categoryName")}
                  filters={filters}
                  handleFilterChange={handleFilterChange}
                  handlePriceChange={handlePriceChange}
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

          <div className="flex-1">
            <div className="hidden lg:flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                {isLoading ? (
                  <span className="text-sm font-medium text-gray-900">
                    Loading...
                  </span>
                ) : error ? (
                  <span className="text-sm font-medium text-red-600">
                    Error: Failed to load products
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

            <div className="lg:hidden mb-4">
              {isLoading ? (
                <span className="text-sm font-medium text-gray-900">
                  Loading...
                </span>
              ) : error ? (
                <span className="text-sm font-medium text-red-600">
                  Error: Failed to load products
                </span>
              ) : (
                <span className="text-sm font-medium text-gray-900">
                  {filteredAndSortedProducts.length} products
                </span>
              )}
            </div>

            <ProductGrid
              products={filteredAndSortedProducts}
              loading={isLoading}
              error={error ? "Failed to load products" : null}
              viewMode={viewMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
