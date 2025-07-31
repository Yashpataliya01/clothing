import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  useContext,
} from "react";
import { ShoppingCart, X, Minus, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AppContext } from "../../context/AuthContext.jsx";
import CartPDFGenerator from "./component/PdfCreator.jsx";

const MyCart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState({});
  const [isSummaryOpen, setIsSummaryOpen] = useState(true);
  const [sizeUpdateError, setSizeUpdateError] = useState(null);
  const [discounts, setDiscounts] = useState([]);
  const debounceTimeout = useRef(null);
  const { setFavcart } = useContext(AppContext);

  const userInformation = JSON.parse(localStorage.getItem("user-info"));

  const parseColor = (colorName) => {
    if (!colorName) return "#cccccc";
    const tempElement = document.createElement("div");
    tempElement.style.color = colorName.toLowerCase().replace(/\s+/g, "");
    document.body.appendChild(tempElement);
    const computedColor = window.getComputedStyle(tempElement).color;
    document.body.removeChild(tempElement);
    if (
      computedColor &&
      computedColor !== "rgb(0, 0, 0)" &&
      colorName.toLowerCase() !== "black"
    ) {
      const rgbMatch = computedColor.match(/\d+/g);
      if (rgbMatch && rgbMatch.length >= 3) {
        const hex =
          "#" +
          rgbMatch
            .slice(0, 3)
            .map((x) => parseInt(x).toString(16).padStart(2, "0"))
            .join("");
        return hex;
      }
    }
    const colorMap = {
      "navy blue": "#000080",
      navyblue: "#000080",
      "light blue": "#ADD8E6",
      lightblue: "#ADD8E6",
      "dark blue": "#00008B",
      darkblue: "#00008B",
      "light green": "#90EE90",
      lightgreen: "#90EE90",
      "dark green": "#006400",
      darkgreen: "#006400",
      "light gray": "#D3D3D3",
      lightgray: "#D3D3D3",
      "dark gray": "#A9A9A9",
      darkgray: "#A9A9A9",
      "off white": "#F8F8FF",
      offwhite: "#F8F8FF",
    };
    const normalizedColor = colorName.toLowerCase().replace(/\s+/g, "");
    return colorMap[normalizedColor] || colorName.toLowerCase();
  };

  const fetchCart = useCallback(async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.uid) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(
        `https://clothing-kg9h.onrender.com/api/cart/${user.uid}`
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to fetch cart");
      setCart(json.cart);
      setSizeUpdateError(null);
    } catch (err) {
      console.error("Fetch cart error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDiscounts = useCallback(async () => {
    try {
      const res = await fetch(
        `https://clothing-kg9h.onrender.com/api/discounts/`
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to fetch discounts");
      setDiscounts(json.data);
    } catch (err) {
      console.error("Fetch discounts error:", err);
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    fetchCart();
    fetchDiscounts();
  }, [fetchCart, fetchDiscounts]);

  const updateCartItem = async (cartId, productId, quantity, size, color) => {
    try {
      setUpdating((prev) => ({ ...prev, [productId + size]: true }));
      const res = await fetch(
        `https://clothing-kg9h.onrender.com/api/cart/update/${cartId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, quantity, size, color }),
        }
      );
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Failed to update cart");
      }
      setCart(json.cart);
      setSizeUpdateError(null);
    } catch (err) {
      console.error("Update cart error:", err);
      setError(err.message || "Update failed");
      if (err.message.includes("size")) {
        setSizeUpdateError(err.message);
      }
    } finally {
      setUpdating((prev) => ({ ...prev, [productId + size]: false }));
    }
  };

  const deleteCartItem = async (cartId, productId, size) => {
    if (!window.confirm("Are you sure you want to remove this item?")) return;
    try {
      setUpdating((prev) => ({ ...prev, [productId + size]: true }));
      const res = await fetch(
        `https://clothing-kg9h.onrender.com/api/cart/delete/${cartId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, size }),
        }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to delete item");
      setCart(json.cart);
    } catch (err) {
      console.error("Delete cart error:", err);
      setError(err.message);
    } finally {
      setUpdating((prev) => ({ ...prev, [productId + size]: false }));
      setFavcart((prev) => prev - 1);
    }
  };

  const handleQuantityChange = (cartId, productId, size, delta, color) => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      const item = cart?.products?.find(
        (p) => p.product._id === productId && p.size === size
      );
      if (item) {
        const newQty = Math.min(Math.max(1, item.quantity + delta), 10);
        updateCartItem(cartId, productId, newQty, size, color || item.color);
      }
    }, 300);
  };

  const handleSizeChange = (cartId, productId, oldSize, newSize, color) => {
    const item = cart?.products?.find(
      (p) => p.product._id === productId && p.size === oldSize
    );
    if (item && newSize !== oldSize) {
      const isValidSize = item.product.size.includes(newSize);
      if (!isValidSize) {
        setSizeUpdateError(
          `Invalid size: ${newSize} not available for this product`
        );
        return;
      }
      updateCartItem(
        cartId,
        productId,
        item.quantity,
        newSize,
        color || item.color
      );
    }
  };

  const { subtotal, discountAmount, applicableDiscount } = useMemo(() => {
    if (!cart?.products)
      return { subtotal: 0, discountAmount: 0, applicableDiscount: null };
    let rawSubtotal = cart.products.reduce(
      (sum, item) =>
        sum +
        (item.product.discountedPrice || item.product.price) * item.quantity,
      0
    );
    let applicableDiscount = discounts
      .filter((d) => rawSubtotal >= d.price)
      .sort((a, b) => b.price - a.price)[0];
    let discountAmount = applicableDiscount
      ? (applicableDiscount.discountPercent / 100) * rawSubtotal
      : 0;
    return {
      subtotal: rawSubtotal - discountAmount,
      discountAmount,
      applicableDiscount,
    };
  }, [cart, discounts]);

  const totalItems =
    cart?.products?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const minOrderValue = 1000;
  const isCheckoutReady = subtotal >= minOrderValue;

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="text-gray-600 font-medium">
            Loading your cart...
          </span>
        </div>
      </div>
    );

  if (error) navigate("/login");

  if (!cart?.products?.length)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-600 mb-6">
          Looks like there's nothing here yet.
        </p>
        <Link
          to="/products"
          className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <ShoppingCart className="h-8 w-8 text-gray-900 mr-3" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600 mt-1">
              {totalItems} item{totalItems !== 1 ? "s" : ""} ready for checkout
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {cart.products.map((item, idx) => (
              <motion.div
                key={`${item.product._id}-${item.size}`}
                className="p-6 border-b border-gray-100 last:border-0 relative group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <button
                  className="absolute top-4 right-4 p-1 text-gray-500 bg-gray-50 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                  onClick={() =>
                    deleteCartItem(cart._id, item.product._id, item.size)
                  }
                  disabled={updating[item.product._id + item.size]}
                  aria-label={`Remove ${item.product.name}`}
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="flex gap-6">
                  <Link
                    to={`/products/${item.product._id}`}
                    key={item.product._id}
                  >
                    <motion.div
                      className="w-24 h-24 overflow-hidden rounded-lg bg-gray-100 relative"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      style={{ cursor: "pointer" }}
                    >
                      <div
                        className="w-full h-full bg-gray-200 animate-pulse"
                        style={{ display: loading ? "block" : "none" }}
                      />
                      <img
                        src={
                          item.product.variants?.[0]?.images?.[0]?.url ||
                          "https://via.placeholder.com/120"
                        }
                        alt={item.product.name}
                        className="w-full h-full object-cover transition-opacity duration-300 absolute top-0 left-0"
                        onLoad={(e) => (e.target.style.opacity = 1)}
                        onError={(e) =>
                          (e.target.src = "https://via.placeholder.com/120")
                        }
                        style={{ opacity: 0 }}
                        loading="lazy"
                      />
                      <span className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
                        {item.quantity} in cart
                      </span>
                    </motion.div>
                  </Link>
                  <div className="flex-1 relative">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.product.name}
                    </h3>
                    <div className="flex items-center gap-5 text-gray-600 mb-2">
                      <div className="text-xl font-bold text-gray-900">
                        ₹
                        {(
                          item.product.discountedPrice || item.product.price
                        ).toLocaleString()}
                        {item.product.discountedPrice && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            ₹{item.product.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <div
                        className="w-6 h-6 rounded-2xl border border-gray-400"
                        style={{ backgroundColor: parseColor(item.color) }}
                        title={`Color: ${item.color}`}
                      ></div>
                    </div>
                    <div className="flex gap-4 items-center mb-4">
                      <div>
                        <label
                          className="text-sm text-gray-600"
                          aria-describedby="size-help"
                        >
                          Size:
                        </label>
                        <select
                          value={item.size}
                          onChange={(e) =>
                            handleSizeChange(
                              cart._id,
                              item.product._id,
                              item.size,
                              e.target.value,
                              item.color
                            )
                          }
                          disabled={updating[item.product._id + item.size]}
                          className="ml-2 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                          aria-label={`Select size for ${item.product.name}`}
                          id="size-help"
                        >
                          {item.product.size.map((sz) => (
                            <option key={sz} value={sz}>
                              {sz}
                            </option>
                          ))}
                        </select>
                        {sizeUpdateError && (
                          <span className="text-xs text-red-500 ml-2">
                            {sizeUpdateError}
                          </span>
                        )}
                        <span
                          className="text-xs text-gray-500 ml-2"
                          id="size-help"
                        >
                          (Select your size)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <label
                          className="text-sm text-gray-600"
                          aria-describedby="qty-help"
                        >
                          Qty:
                        </label>
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <motion.button
                            className="px-2 py-1 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                            onClick={() =>
                              handleQuantityChange(
                                cart._id,
                                item.product._id,
                                item.size,
                                -1,
                                item.color
                              )
                            }
                            disabled={
                              updating[item.product._id + item.size] ||
                              item.quantity <= 1
                            }
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label="Decrease quantity"
                            title="Decrease quantity (min: 1)"
                          >
                            <Minus className="h-4 w-4" />
                          </motion.button>
                          <span className="px-3 text-gray-900">
                            {item.quantity}
                          </span>
                          <motion.button
                            className="px-2 py-1 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                            onClick={() =>
                              handleQuantityChange(
                                cart._id,
                                item.product._id,
                                item.size,
                                1,
                                item.color
                              )
                            }
                            disabled={
                              updating[item.product._id + item.size] ||
                              item.quantity >= 10
                            }
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label="Increase quantity"
                            title="Increase quantity (max: 10)"
                          >
                            <Plus className="h-4 w-4" />
                          </motion.button>
                        </div>
                        <span className="text-xs text-gray-500" id="qty-help">
                          (Max 10)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {updating[item.product._id + item.size] && (
                  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-2xl">
                    <div className="animate-spin h-6 w-6 border-b-2 border-teal-500 rounded-full"></div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Order Summary
              </h2>
              <button
                onClick={() => setIsSummaryOpen(!isSummaryOpen)}
                className="text-gray-500 hover:text-teal-600"
                aria-label="Toggle summary"
              >
                {isSummaryOpen ? "−" : "+"}
              </button>
            </div>
            <AnimatePresence>
              {isSummaryOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Available Discounts
                    </h3>
                    {discounts.length > 0 ? (
                      <ul className="space-y-2">
                        {discounts.map((discount) => (
                          <li
                            key={discount._id}
                            className="text-xs text-gray-600"
                          >
                            {discount.discountPercent}% off on orders of ₹
                            {discount.price.toLocaleString()} or more
                            {applicableDiscount?.price === discount.price &&
                              discountAmount > 0 && (
                                <span className="ml-2 text-green-600 font-medium">
                                  (Applied)
                                </span>
                              )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-gray-500">
                        No discounts available
                      </p>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-medium">
                        ₹{(subtotal + discountAmount).toLocaleString()}
                      </span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-gray-600">
                        <span>Discount</span>
                        <span className="text-green-600 font-medium">
                          -₹{discountAmount.toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span>₹{subtotal.toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Inclusive of all taxes
                      </p>
                    </div>
                    {!isCheckoutReady && (
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-teal-500 h-2.5 rounded-full transition-all duration-300"
                          style={{
                            width: `${(subtotal / minOrderValue) * 100}%`,
                          }}
                        ></div>
                      </div>
                    )}
                    {!isCheckoutReady && (
                      <p className="text-sm text-yellow-600">
                        Minimum order value of ₹{minOrderValue.toLocaleString()}{" "}
                        required
                      </p>
                    )}
                  </div>
                  <CartPDFGenerator
                    cart={cart}
                    subtotal={subtotal}
                    discountAmount={discountAmount}
                    applicableDiscount={applicableDiscount}
                    userInfo={userInformation}
                    onError={(message) => setError(message)}
                  />
                  <Link
                    to="/products"
                    className="w-full block text-center py-2 bg-gray-100 rounded-md hover:bg-gray-200 text-sm transition-colors"
                  >
                    Continue Shopping
                  </Link>
                  <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>Secure checkout with 256-bit SSL encryption</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCart;
