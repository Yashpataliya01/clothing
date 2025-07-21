import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Shirt, Users, Percent, TrendingUp } from "lucide-react";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <nav className="bg-slate-900 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50 shadow-2xl">
      <div className="w-full mx-auto px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="ml-3 text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Clothing Admin
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            <Link
              to="/"
              className="px-4 py-2 text-slate-300 hover:text-white hover:bg-white/10 font-medium rounded-lg transition-all duration-200"
            >
              Men
            </Link>
            <Link
              to="/women"
              className="px-4 py-2 text-slate-300 hover:text-white hover:bg-white/10 font-medium rounded-lg transition-all duration-200"
            >
              Women
            </Link>
            <Link
              to="/users"
              className="px-4 py-2 text-slate-300 hover:text-white hover:bg-white/10 font-medium rounded-lg transition-all duration-200"
            >
              Users
            </Link>
            <Link
              to="/headers"
              className="px-4 py-2 text-slate-300 hover:text-white hover:bg-white/10 font-medium rounded-lg transition-all duration-200"
            >
              Headers
            </Link>
            <Link
              to="/discount"
              className="px-4 py-2 text-slate-300 hover:text-white hover:bg-white/10 font-medium rounded-lg transition-all duration-200"
            >
              Discount
            </Link>
            <Link
              to="/tranding"
              className="px-4 py-2 text-slate-300 hover:text-white hover:bg-white/10 font-medium rounded-lg transition-all duration-200"
            >
              Tranding
            </Link>
            <Link
              to="/tags"
              className="px-4 py-2 text-slate-300 hover:text-white hover:bg-white/10 font-medium rounded-lg transition-all duration-200"
            >
              Tags
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-800/95 border-t border-slate-700/50">
          <div className="px-6 py-4 space-y-2">
            <Link
              to="/"
              className="flex items-center px-4 py-3 text-slate-300 hover:text-white hover:bg-white/10"
            >
              <Shirt className="w-5 h-5 mr-3" />
              Men
            </Link>
            <Link
              to="/women"
              className="flex items-center px-4 py-3 text-slate-300 hover:text-white hover:bg-white/10"
            >
              <Shirt className="w-5 h-5 mr-3" />
              Women
            </Link>
            <Link
              to="/users"
              className="flex items-center px-4 py-3 text-slate-300 hover:text-white hover:bg-white/10"
            >
              <Users className="w-5 h-5 mr-3" />
              Users
            </Link>
            <Link
              to="/headers"
              className="flex items-center px-4 py-3 text-slate-300 hover:text-white hover:bg-white/10"
            >
              <Users className="w-5 h-5 mr-3" />
              Headers
            </Link>
            <Link
              to="/discount"
              className="flex items-center px-4 py-3 text-slate-300 hover:text-white hover:bg-white/10"
            >
              <Percent className="w-5 h-5 mr-3" />
              Discount
            </Link>
            <Link
              to="/tranding"
              className="flex items-center px-4 py-3 text-slate-300 hover:text-white hover:bg-white/10"
            >
              <TrendingUp className="w-5 h-5 mr-3" />
              Tranding
            </Link>
            <Link
              to="/tags"
              className="flex items-center px-4 py-3 text-slate-300 hover:text-white hover:bg-white/10"
            >
              <Percent className="w-5 h-5 mr-3" />
              Tags
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
