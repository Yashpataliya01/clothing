import React, { useState } from "react";
import { Link } from "react-router-dom";
import { User, ChevronDown, Settings, Bell, Shirt, Users } from "lucide-react";

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
          </div>

          {/* Right Icons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-800/95 rounded-xl shadow-2xl border border-slate-700/50 p-4 z-50">
                  <h3 className="text-white font-medium mb-2">Notifications</h3>
                  <div className="space-y-2">
                    <div className="p-3 bg-slate-700/40 rounded-lg text-sm text-slate-300">
                      New item added to Women's section
                      <p className="text-xs text-slate-400 mt-1">5 mins ago</p>
                    </div>
                    <div className="p-3 bg-slate-700/40 rounded-lg text-sm text-slate-300">
                      Stock updated for Men’s “Denim Jacket”
                      <p className="text-xs text-slate-400 mt-1">30 mins ago</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center space-x-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span>Admin</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    showProfileDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-700/50 py-2 z-50">
                  <div className="px-4 py-3 border-b border-slate-700/50">
                    <p className="text-white font-medium">John Doe</p>
                    <p className="text-slate-400 text-sm">admin@clothify.com</p>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-slate-300 hover:text-white hover:bg-white/10"
                  >
                    <User className="w-4 h-4 mr-3" />
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center px-4 py-2 text-slate-300 hover:text-white hover:bg-white/10"
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </Link>
                  <hr className="my-2 border-slate-700/50" />
                  <button className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10">
                    Sign Out
                  </button>
                </div>
              )}
            </div>
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
              to="/settings"
              className="flex items-center px-4 py-3 text-slate-300 hover:text-white hover:bg-white/10"
            >
              <Settings className="w-5 h-5 mr-3" />
              Settings
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
