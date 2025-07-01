import { motion } from "framer-motion";
import img from "../../../../assets/home/headerStrap.png";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function NewArrivalsGrid({ products }) {
  const [data, setData] = useState([]);
  // State to track selected color for each product
  const [selectedColors, setSelectedColors] = useState({});

  console.log(data, "data");

  const getProductdata = async () => {
    const res = await fetch(
      `http://localhost:5000/api/product?category=${products?._id}`
    );
    const data = await res.json();
    setData(data);
  };

  useEffect(() => {
    getProductdata();
  }, [products]);

  // Better color parsing function that handles any color name
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

  // Handle color selection
  const handleColorClick = (productId, variant) => {
    setSelectedColors((prev) => ({
      ...prev,
      [productId]: variant.color,
    }));
  };

  // Get the image for the selected color
  const getSelectedImage = (product) => {
    const selectedColor = selectedColors[product._id];
    const selectedVariant =
      product.variants.find((variant) => variant.color === selectedColor) ||
      product.variants[0];
    return selectedVariant?.images?.[0]?.url || "";
  };

  return (
    <section className="w-full mx-auto py-16 px-4">
      {/* Minimal Header */}
      <motion.div
        className="text-center mb-16 p-7"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.25), rgba(255,255,255,0.25)), url(${img})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
          {products?.name}
        </h2>
        <div className="w-24 h-px bg-gray-300 mx-auto"></div>
      </motion.div>

      {data?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {data?.map((product, idx) => (
            <Link to={`/products/${product._id}`}>
              <motion.div
                key={product._id || idx}
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
              >
                {/* Clean Image Container */}
                <div className="relative aspect-[4/5] mb-4 overflow-hidden bg-gray-50">
                  <img
                    src={getSelectedImage(product)}
                    alt={product.name}
                    className="w-full h-full object-cover transition-opacity duration-300"
                  />
                  <img
                    src={
                      product.variants?.find(
                        (variant) =>
                          variant.color === selectedColors[product._id]
                      )?.images?.[1]?.url || getSelectedImage(product)
                    }
                    alt={`${product.name} Alt`}
                    className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />

                  {/* Simple Sale Tag */}
                  {product.tag && (
                    <div className="absolute top-3 left-3 bg-black text-white px-3 py-1 text-xs font-medium">
                      {product.tag}
                    </div>
                  )}
                </div>

                {/* Clean Product Info */}
                <div className="space-y-3">
                  {/* Product Name */}
                  <h3 className="text-lg font-medium text-gray-900 leading-tight">
                    {product.name}
                  </h3>

                  {/* Simple Pricing */}
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-medium text-gray-900">
                      ₹{product.discountedPrice?.toLocaleString()}
                    </span>
                    {product.price !== product.discountedPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ₹{product.price?.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Clean Color Swatches */}
                  {product.variants && product.variants.length > 0 && (
                    <div className="flex items-center gap-2">
                      {product.variants.slice(0, 5).map((variant, i) => (
                        <div
                          key={i}
                          className={`w-5 h-5 rounded-full border ${
                            selectedColors[product._id] === variant.color
                              ? "border-gray-900 ring-2 ring-offset-2 ring-gray-900"
                              : "border-gray-200"
                          } cursor-pointer`}
                          style={{ backgroundColor: parseColor(variant.color) }}
                          title={variant.color}
                          onClick={() => handleColorClick(product._id, variant)}
                        />
                      ))}
                      {product.variants.length > 5 && (
                        <span className="text-xs text-gray-500 ml-1">
                          +{product.variants.length - 5}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Simple Sizes */}
                  {product.size && product.size.length > 0 && (
                    <div className="text-sm text-gray-600">
                      {product.size.map((s) => s.toUpperCase()).join(" • ")}
                    </div>
                  )}
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      ) : (
        <motion.div
          className="text-center py-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-16 h-16 mx-auto mb-6 opacity-30">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              className="w-full h-full"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <h3 className="text-xl font-light text-gray-800 mb-2">
            No products available
          </h3>
          <p className="text-gray-600">Check back soon for new arrivals</p>
        </motion.div>
      )}
      {data?.length > 0 ? (
        <motion.div
          className="flex items-center justify-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div
            className=""
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to="/products"
              state={{ categoryId: products?._id }}
              className="relative inline-flex items-center px-8 py-3 text-sm font-medium text-gray-800"
            >
              <span className="relative z-10 flex items-center gap-2">
                View All Products
                <motion.svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  initial={{ x: 0 }}
                  animate={{ x: 0 }}
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.2 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </motion.svg>
              </span>

              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            </Link>

            <motion.div
              className="absolute bottom-0 left-1/2 h-px bg-gray-800"
              initial={{ width: 0, x: "-50%" }}
              whileHover={{ width: "80%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </motion.div>
        </motion.div>
      ) : null}
    </section>
  );
}
