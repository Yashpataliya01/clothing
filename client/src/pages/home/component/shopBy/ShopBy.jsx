import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import img from "../../../../assets/home/headerStrap.png";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 80,
    scale: 0.9,
    rotateX: 15,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      duration: 1,
      ease: [0.25, 0.46, 0.45, 0.94],
      type: "spring",
      stiffness: 80,
      damping: 15,
    },
  },
};

const imageVariants = {
  rest: {
    scale: 1,
    brightness: 1,
  },
  hover: {
    scale: 1.15,
    brightness: 1.1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const overlayVariants = {
  rest: {
    opacity: 0.6,
    background:
      "linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)",
  },
  hover: {
    opacity: 0.85,
    background:
      "linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%)",
    transition: { duration: 0.5 },
  },
};

const contentVariants = {
  rest: { y: 20, opacity: 0.9 },
  hover: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const glowVariants = {
  rest: { opacity: 0, scale: 0.8 },
  hover: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6 },
  },
};

export default function ShopByCategory({ categories }) {
  // Group categories by gender and limit to 4 items each
  const groupedCategories = categories.reduce((acc, category) => {
    const gender = category.gender?.toLowerCase() || "unisex";
    if (!acc[gender]) {
      acc[gender] = [];
    }
    if (acc[gender].length < 4) {
      acc[gender].push(category);
    }
    return acc;
  }, {});

  // Define gender display names and colors
  const genderConfig = {
    men: {
      title: "Men's Collection",
      color: "from-blue-600 to-blue-800",
      textColor: "text-blue-800",
    },
    women: {
      title: "Women's Collection",
      color: "from-pink-600 to-pink-800",
      textColor: "text-pink-800",
    },
    unisex: {
      title: "Unisex Collection",
      color: "from-purple-600 to-purple-800",
      textColor: "text-purple-800",
    },
  };

  return (
    <div className="w-full mx-auto py-16">
      {/* Enhanced Header */}
      <motion.div
        className="text-center mb-16 w-full"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.25), rgba(255,255,255,0.25)), url(${img})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
        }}
      >
        <motion.div
          className="relative inline-block"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-5xl md:text-6xl font-bold text-black mb-4 tracking-tight relative font-sans"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Categories
          </motion.h2>

          <motion.p
            className="text-gray-600 text-lg font-light max-w-md mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Find your perfect style by collection.
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Gender-based Categories */}
      {Object.entries(groupedCategories).map(([gender, genderCategories]) => (
        <motion.div
          key={gender}
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Gender Section Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.h3
              className={`text-4xl md:text-5xl font-bold mb-4 ${
                genderConfig[gender]?.textColor || "text-gray-800"
              }`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {genderConfig[gender]?.title ||
                `${
                  gender.charAt(0).toUpperCase() + gender.slice(1)
                } Collection`}
            </motion.h3>

            {/* Gender accent line */}
            <motion.div
              className={`h-1 w-24 mx-auto bg-gradient-to-r ${
                genderConfig[gender]?.color || "from-gray-400 to-gray-600"
              } rounded-full`}
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
            />
          </motion.div>

          {/* Categories Grid for this gender */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-6"
          >
            {genderCategories.map((category, index) => (
              <motion.div
                key={`${gender}-${category.name}-${index}`}
                variants={cardVariants}
                whileHover="hover"
                initial="rest"
                className="group relative"
              >
                <motion.div
                  className="relative h-96 sm:h-[450px] overflow-hidden cursor-pointer"
                  whileHover={{ y: -8 }}
                  transition={{
                    duration: 0.4,
                    ease: "easeOut",
                    delay: index * 0.1,
                    duration: 0.6,
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  {/* Glow Effect */}
                  <motion.div
                    variants={glowVariants}
                    className={`absolute -inset-1 bg-gradient-to-r ${
                      genderConfig[gender]?.color ||
                      "from-blue-500 to-purple-500"
                    } blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                  />

                  {/* Image Container */}
                  <div className="relative h-full overflow-hidden bg-gray-200 rounded-lg">
                    <motion.img
                      variants={imageVariants}
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />

                    {/* Enhanced Gradient Overlay */}
                    <motion.div
                      variants={overlayVariants}
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
                    />

                    {/* Shimmer Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
                      animate={{
                        translateX: ["100%", "200%"],
                      }}
                      transition={{
                        duration: 2,
                        ease: "linear",
                        repeat: Infinity,
                        repeatDelay: 3,
                      }}
                    />

                    {/* Content */}
                    <motion.div
                      variants={contentVariants}
                      className="absolute inset-0 flex flex-col justify-end p-8"
                    >
                      <h4 className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight">
                        {category.name}
                      </h4>

                      <p className="text-gray-200 text-base mb-6 font-light opacity-90">
                        {category.description}
                      </p>

                      {/* CTA Button */}
                      <div>
                        <motion.div
                          className="flex items-center justify-center mt-8"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                        >
                          <Link
                            to="/products"
                            state={{
                              categoryId: category?._id,
                              gender: category?.gender,
                            }}
                          >
                            <motion.button
                              whileHover={{ scale: 1.05, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                              className="inline-flex items-center 
                       px-4 py-2 text-sm 
                       sm:px-6 sm:py-3 sm:text-base 
                       bg-white text-gray-900 
                       rounded-full font-semibold 
                       shadow-lg hover:shadow-xl 
                       transition-all duration-300 
                       group w-fit"
                            >
                              Shop Now
                              <motion.svg
                                className="ml-2 w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                animate={{ x: [0, 5, 0] }}
                                transition={{
                                  duration: 1.5,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                }}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                              </motion.svg>
                            </motion.button>
                          </Link>
                        </motion.div>
                      </div>
                    </motion.div>

                    {/* Corner Accent */}
                    <motion.div
                      className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-white/40 rounded-tr-2xl"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                    />
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      ))}

      {/* Enhanced Bottom CTA */}
      <motion.div
        className="flex items-center justify-center mt-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <motion.div
          className="relative"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link
            to="/products"
            className="relative inline-flex items-center px-8 py-3 text-sm font-medium text-gray-800"
          >
            <span className="relative z-10 flex items-center gap-2">
              Explore All Collections
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

            {/* Subtle hover background */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          </Link>

          {/* Minimal underline accent */}
          <motion.div
            className="absolute bottom-0 left-1/2 h-px bg-gray-800"
            initial={{ width: 0, x: "-50%" }}
            whileHover={{ width: "80%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
