import React, { useState } from "react";
import { Link } from "react-router-dom";

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

const ProductCard = ({ product, viewMode }) => {
  const [selectedColor, setSelectedColor] = useState(
    product.variants?.[0]?.color || ""
  );

  const displayPrice = product.discountedPrice || product.price;
  const hasDiscount =
    product.discountedPrice && product.discountedPrice < product.price;
  const discountPercentage = hasDiscount
    ? Math.round((1 - product.discountedPrice / product.price) * 100)
    : 0;

  const getSelectedImage = () => {
    const selectedVariant =
      product.variants?.find((variant) => variant.color === selectedColor) ||
      product.variants?.[0];
    return selectedVariant?.images?.[0]?.url || "";
  };

  const handleColorClick = (color) => {
    setSelectedColor(color);
  };

  return (
    <div
      className={`group rounded-lg ${
        viewMode === "list" ? "flex flex-col sm:flex-row" : ""
      }`}
    >
      <Link to={`/products/${product._id}`} className="group">
        <div
          className={`relative ${
            viewMode === "grid" ? "aspect-[4/5]" : "aspect-[4/5] sm:w-1/3"
          } mb-4 overflow-hidden bg-gray-50 cursor-pointer`}
        >
          <img
            src={getSelectedImage()}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-opacity duration-300"
          />
          <img
            src={
              product.variants?.find(
                (variant) => variant.color === selectedColor
              )?.images?.[1]?.url || getSelectedImage()
            }
            alt={`${product.name} Alt`}
            className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
          {product.tag && (
            <div className="absolute top-3 left-3 bg-black text-white px-3 py-1 text-xs font-medium">
              {product.tag}
            </div>
          )}
        </div>
      </Link>
      <div
        className={`space-y-3 ${viewMode === "list" ? "p-4 sm:w-2/3" : "p-4"}`}
      >
        <h3
          className={`text-lg font-medium text-gray-900 leading-tight ${
            viewMode === "list" ? "line-clamp-3" : "line-clamp-2"
          }`}
        >
          {product.name}
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-lg font-medium text-gray-900">
            ₹{displayPrice.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-500 line-through">
              ₹{product.price.toLocaleString()}
            </span>
          )}
          {hasDiscount && (
            <span className="text-xs text-pink-500 font-medium">
              Save {discountPercentage}%
            </span>
          )}
        </div>
        {product.variants && product.variants.length > 0 && (
          <div className="flex items-center gap-2">
            {product.variants.slice(0, 5).map((variant, i) => (
              <div
                key={i}
                className={`w-5 h-5 rounded-full border ${
                  selectedColor === variant.color
                    ? "border-gray-900 ring-0.5 ring-offset-2 ring-gray-900"
                    : "border-gray-200"
                } cursor-pointer transform transition-transform hover:scale-125`}
                style={{ backgroundColor: parseColor(variant.color) }}
                title={variant.color}
                onClick={() => handleColorClick(variant.color)}
                aria-label={`Select ${variant.color} color`}
              />
            ))}
            {product.variants.length > 5 && (
              <span className="text-xs text-gray-500 ml-1">
                +{product.variants.length - 5}
              </span>
            )}
          </div>
        )}
        {product.size && product.size.length > 0 && (
          <div className="text-sm text-gray-600">
            {product.size.map((s) => s.toUpperCase()).join(" • ")}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
