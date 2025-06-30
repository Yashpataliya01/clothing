import React from "react";
import { X } from "lucide-react";
import FilterSection from "./FilterSection";

const FilterModal = ({
  filters,
  handleFilterChange,
  handlePriceChange,
  openFilters,
  toggleFilterSection,
  clearFilters,
  setIsFilterModalOpen,
  filterOptions,
}) => (
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

export default FilterModal;
