import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, User, ChevronDown } from "lucide-react";
import { auth, signOut } from "../../firebase";
import { AppContext } from "../../context/AuthContext";

// import logo
import Logo from "../../assets/home/mainlogo.png";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const navigate = useNavigate();
  const { favcart } = useContext(AppContext);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      (currentUser) => {
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

    const fetchCategories = async () => {
      try {
        const res = await fetch(
          "https://clothing-kg9h.onrender.com/api/categorie"
        );
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
    return () => unsubscribe();
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await signOut(auth);
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
    e.preventDefault();
    e.stopPropagation();
    if (user) {
      setDropdownOpen((prev) => !prev);
    } else {
      navigate("/login");
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownOpen && !e.target.closest(".user-dropdown")) {
        setDropdownOpen(false);
      }
      if (productsDropdownOpen && !e.target.closest(".products-dropdown")) {
        setProductsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [dropdownOpen, productsDropdownOpen]);

  // Filter categories by gender
  const menCategories = categories
    .filter((cat) => cat.gender === "men")
    .slice(0, 5);
  const womenCategories = categories
    .filter((cat) => cat.gender === "women")
    .slice(0, 5);

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
        <Link to="/" onClick={() => setMobileMenuOpen(false)}>
          <img src={Logo} alt="Logo" className="w-18 h-18" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-8 items-center">
          {navLinks.map((link) => (
            <div
              key={link.link}
              className="relative products-dropdown"
              onMouseEnter={() =>
                link.name === "Products" && setProductsDropdownOpen(true)
              }
              onMouseLeave={() =>
                link.name === "Products" && setProductsDropdownOpen(false)
              }
            >
              <Link
                to={link.link}
                className="text-gray-700 hover:text-black font-medium transition flex items-center"
              >
                {link.name}
                {link.name === "Products" && (
                  <ChevronDown className="w-4 h-4 ml-1" />
                )}
              </Link>
              {link.name === "Products" && productsDropdownOpen && (
                <div className="absolute left-0 w-64 bg-white border rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-2">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">
                      Men
                    </h3>
                    {menCategories.map((category) => (
                      <Link
                        key={category._id}
                        state={{ categoryId: category?._id }}
                        to="/products"
                        className="block px-2 py-1 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">
                      Women
                    </h3>
                    {womenCategories.map((category) => (
                      <Link
                        key={category._id}
                        state={{ categoryId: category?._id }}
                        to="/products"
                        className="block px-2 py-1 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Cart Icon */}
          <Link to="/cart" className="relative flex items-center">
            <ShoppingCart className="w-5 h-5 text-gray-600" />
            {favcart > 0 && (
              <div className="absolute bottom-3 left-4 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                {favcart}
              </div>
            )}
          </Link>

          {/* User Icon */}
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
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Icons */}
        <div className="md:hidden flex items-center space-x-3">
          <Link to="/cart" className="relative flex items-center">
            <ShoppingCart className="w-5 h-5 text-gray-600" />
            {favcart > 0 && (
              <div className="absolute bottom-3 left-4 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                {favcart}
              </div>
            )}
          </Link>

          <div className="relative user-dropdown">
            <User
              className="text-gray-700 w-5 h-5 cursor-pointer"
              onClick={handleUserClick}
            />
            {user && dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-2 z-50">
                <div className="px-4 py-2 text-sm text-gray-700">
                  {user.displayName || "User"}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Toggle */}
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
            <div key={link.name}>
              <div className="flex items-center justify-between">
                <Link
                  to={link.link}
                  className="block text-gray-700 hover:text-black text-lg font-medium"
                  onClick={() => {
                    if (link.name !== "Products") {
                      setMobileMenuOpen(false);
                    }
                  }}
                >
                  {link.name}
                </Link>
                {link.name === "Products" && (
                  <button
                    onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                    className="text-gray-700"
                  >
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${
                        mobileProductsOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                )}
              </div>
              {link.name === "Products" && mobileProductsOpen && (
                <div className="pl-4 mt-2 space-y-2">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">
                      Men
                    </h3>
                    {menCategories.map((category) => (
                      <Link
                        key={category._id}
                        to={`/products?category=${category._id}`}
                        className="block px-2 py-1 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setMobileProductsOpen(false);
                        }}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">
                      Women
                    </h3>
                    {womenCategories.map((category) => (
                      <Link
                        key={category._id}
                        to={`/products?category=${category._id}`}
                        className="block px-2 py-1 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setMobileProductsOpen(false);
                        }}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}
