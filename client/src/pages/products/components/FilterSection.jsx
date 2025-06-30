import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FilterSection = ({
  title,
  filterType,
  options,
  isOpen,
  onToggle,
  filters,
  handleFilterChange,
  handlePriceChange,
}) => (
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

export default FilterSection;
