import React from "react";
import ProductCard from "./ProductCard";

const ProductGrid = ({ products, loading, error, viewMode }) => {
  if (loading) {
    return (
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
    );
  }

  if (error) {
    return (
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
    );
  }

  if (products.length === 0) {
    return (
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
        <p className="text-gray-600">Check back soon for new arrivals</p>
      </div>
    );
  }

  return (
    <div
      className={`grid gap-4 lg:gap-6 ${
        viewMode === "grid"
          ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-3"
          : "grid-cols-1"
      }`}
    >
      {products.map((product) => (
        <ProductCard key={product._id} product={product} viewMode={viewMode} />
      ))}
    </div>
  );
};

export default ProductGrid;
