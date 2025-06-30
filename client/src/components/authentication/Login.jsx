import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider, signInWithPopup, signOut } from "../../Firebase.js";
import { FaGoogle } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // Save user data to localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        })
      );
      navigate("/");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  signOut(auth)
    .then(() => console.log("Manual sign out worked"))
    .catch((err) => console.error("Manual sign out error:", err));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome to Our Clothing Store
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Sign in to explore the latest fashion trends
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-6">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <FaGoogle className="text-xl" />
          {loading ? "Signing In..." : "Sign in with Google"}
        </button>

        <p className="mt-6 text-center text-gray-500 text-sm">
          By signing in, you agree to our{" "}
          <a href="/terms" className="text-blue-600 hover:underline">
            Terms
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
