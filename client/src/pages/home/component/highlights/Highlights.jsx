import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
export default function EditorialProductSpotlight() {
  const [products, setProducts] = useState([]);
  const fetchProducts = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/product?tags=${encodeURIComponent(
          "Most Trending"
        )}`
      );
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
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
