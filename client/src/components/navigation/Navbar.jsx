import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "Products",
      link: "/products",
    },
    {
      name: "About",
      link: "/about",
    },
    {
      name: "Contact",
      link: "/contact",
    },
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold text-gray-900 tracking-wide">
          Logo
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-8 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.link}
              to={link.link}
              className="text-gray-700 hover:text-black font-medium transition"
            >
              {link.name}
            </Link>
          ))}

          {/* Search */}
          <input
            type="text"
            placeholder="Search"
            className="border rounded-full px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          />

          {/* Cart Icon */}
          <ShoppingCart className="text-gray-700 hover:text-black cursor-pointer w-5 h-5" />
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-6 pb-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.link}
              className="block text-gray-700 hover:text-black text-lg font-medium"
            >
              {link.name}
            </Link>
          ))}
          <div className="mt-4 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search"
              className="w-full border rounded-full px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            <ShoppingCart className="text-gray-700 w-5 h-5" />
          </div>
        </div>
      )}
    </nav>
  );
}
