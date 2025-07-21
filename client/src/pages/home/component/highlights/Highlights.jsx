import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useGetTrendingProductsQuery } from "../../../../services/productsApi.js"; // Adjust path based on your project structure

export default function EditorialProductSpotlight() {
  const {
    data: products = [],
    isLoading,
    error,
  } = useGetTrendingProductsQuery();

  if (isLoading) {
    return (
      <section className="w-full py-10 md:py-20 sm:py-10 max-h-fit overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 flex justify-center items-center">
          <div className="flex items-center space-x-3">
            <svg
              className="animate-spin h-8 w-8 text-black"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            <span className="text-black text-lg">
              Loading trending products...
            </span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full py-10 md:py-20 sm:py-10 max-h-fit overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 flex justify-center items-center">
          <div className="p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Failed to load trending products. Please try again later.
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="w-full py-10 md:py-20 sm:py-10 max-h-fit overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 flex justify-center items-center">
          <div className="text-black text-lg">
            No product or no data available.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-10 md:py-20 sm:py-10 max-h-fit overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Product Image */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div className="relative overflow-hidden group">
            <img
              src={products[0]?.variants[0]?.images[0].url}
              alt="Product"
              className="w-full h-[550px] object-cover grayscale group-hover:grayscale-0 transition duration-700 ease-in-out"
            />
            <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full shadow text-sm font-medium">
              Most Trending
            </div>
          </div>
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-black mb-6 leading-tight">
            Most Trending Picks. <br />
            Curated for Style Leaders.
          </h2>
          <p className="text-gray-600 text-lg mb-6 leading-relaxed max-w-lg">
            Step into the spotlight with our most trending styles of the season.
            From bold cuts to statement colors, these handpicked pieces define
            what’s hot right now. Worn by the trendsetters, designed for you.
          </p>
          <Link
            to="/products"
            state={{ tags: products[0]?.tag }}
            className="bg-black text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-gray-900 transition"
          >
            Explore the Most Trending Collection
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
