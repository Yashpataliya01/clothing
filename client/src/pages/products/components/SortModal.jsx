import React from "react";
import { X } from "lucide-react";

const SortModal = ({ sortBy, setSortBy, setIsSortModalOpen }) => (
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

export default SortModal;
