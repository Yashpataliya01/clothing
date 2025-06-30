import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MyCart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchCart = async () => {
      try {
        console.log("Fetching cart for userId:", user.uid); // Debug: Log userId
        const response = await fetch(
          `http://localhost:5000/api/cart/${user.uid}`
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch cart");
        }
        const data = await response.json();
        console.log("Cart data received:", data); // Debug: Log response
        setCart(data.cart);
        console.log(data.cart.size);
        setLoading(false);
      } catch (err) {
        console.error("Fetch cart error:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

  if (loading) {
    return <div className="text-center py-10">Loading cart...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  if (!cart || cart.products.length === 0) {
    return <div className="text-center py-10">Your cart is empty</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Cart</h2>
      <div className="space-y-6">
        {cart.products.map((item, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg shadow-md"
          >
            <div className="w-full sm:w-1/3">
              <img
                src={
                  item.product.variants?.[0]?.images?.[0]?.url ||
                  "https://via.placeholder.com/150"
                }
                alt={item.product.name}
                className="w-full h-40 object-cover rounded-lg"
              />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-lg font-medium text-gray-900">
                {item.product.name}
              </h3>
              <p className="text-sm text-gray-600">Size: {cart.size}</p>
              <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
              <p className="text-lg font-medium text-gray-900">
                ₹
                {(
                  item.product.discountedPrice || item.product.price
                ).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-right">
        <p className="text-xl font-bold text-gray-900">
          Total: ₹
          {cart.products
            .reduce(
              (sum, item) =>
                sum +
                (item.product.discountedPrice || item.product.price) *
                  item.quantity,
              0
            )
            .toLocaleString()}
        </p>
        <button
          className="mt-4 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => alert("Proceed to checkout (not implemented)")}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default MyCart;
