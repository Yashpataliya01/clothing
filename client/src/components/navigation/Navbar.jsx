import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, User } from "lucide-react";
import { auth, signOut } from "../../firebase";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Checking Firebase auth:", auth); // Debug: Verify auth object
    const unsubscribe = auth.onAuthStateChanged(
      (currentUser) => {
        console.log("Auth state changed:", currentUser); // Debug: Log auth state
        if (currentUser) {
          const storedUser = JSON.parse(localStorage.getItem("user"));
          setUser(
            storedUser || {
              uid: currentUser.uid,
              displayName: currentUser.displayName,
              email: currentUser.email,
              photoURL: currentUser.photoURL,
            }
          );
        } else {
          setUser(null);
          localStorage.removeItem("user");
          setDropdownOpen(false);
        }
      },
      (error) => {
        console.error("Auth state error:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault(); // Prevent any default behavior
    e.stopPropagation(); // Stop event bubbling
    console.log("Logout clicked"); // Debug: Confirm function is called
    try {
      await signOut(auth);
      console.log("Sign out successful");
      localStorage.removeItem("user");
      setUser(null);
      setDropdownOpen(false);
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
      alert("Failed to log out: " + err.message);
    }
  };

  const handleUserClick = (e) => {
    e.preventDefault(); // Prevent any default link behavior
    e.stopPropagation(); // Stop event bubbling
    console.log("User icon clicked, user:", user); // Debug: Confirm user click
    if (user) {
      setDropdownOpen((prev) => !prev); // Toggle dropdown
    } else {
      navigate("/login");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownOpen && !e.target.closest(".user-dropdown")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [dropdownOpen]);

  const navLinks = [
    { name: "Home", link: "/" },
    { name: "Products", link: "/products" },
    { name: "About", link: "/about" },
    { name: "Contact", link: "/contact" },
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
          <Link to="/cart">
            <ShoppingCart className="text-gray-700 hover:text-black cursor-pointer w-5 h-5" />
          </Link>

          {/* User Icon with Dropdown */}
          <div className="relative user-dropdown">
            <User
              className="text-gray-700 hover:text-black cursor-pointer w-5 h-5"
              onClick={handleUserClick}
            />
            {user && dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-2 z-50">
                <div className="px-4 py-2 text-sm text-gray-700">
                  {user.displayName || "User"}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
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
            <Link to="/cart">
              <ShoppingCart className="text-gray-700 w-5 h-5" />
            </Link>
            <div className="relative user-dropdown">
              <User
                className="text-gray-700 w-5 h-5 cursor-pointer"
                onClick={handleUserClick}
              />
              {user && dropdownOpen && (
                <div className="mt-2 w-full bg-white border rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-2 text-sm text-gray-700">
                    {user.displayName || "User"}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
