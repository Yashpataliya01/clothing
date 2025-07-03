import React from "react";
import { ChevronDown } from "lucide-react";

const FilterBar = ({ setIsFilterModalOpen, setIsSortModalOpen }) => (
  <div className="lg:hidden py-4 sticky top-0 z-10">
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
);

export default FilterBar;
