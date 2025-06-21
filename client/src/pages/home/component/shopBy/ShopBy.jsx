import { motion } from "framer-motion";

const categories = [
  {
    name: "Sarees",
    image:
      "https://images.unsplash.com/photo-1609748341905-080e077af4ca?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Traditional elegance redefined",
    items: "150+ Styles",
  },
  {
    name: "Shirts",
    image:
      "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Professional & casual wear",
    items: "200+ Styles",
  },
  {
    name: "Suits",
    image:
      "https://images.unsplash.com/photo-1724139139873-57572c120322?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Formal sophistication",
    items: "80+ Styles",
  },
  {
    name: "Western Wear",
    image:
      "https://images.unsplash.com/photo-1732711532546-1dd9070b094b?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Contemporary fashion",
    items: "250+ Styles",
  },
  {
    name: "Denim",
    image:
      "https://plus.unsplash.com/premium_photo-1727942420153-8573424d2a83?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Classic comfort & style",
    items: "120+ Styles",
  },
  {
    name: "Jeans",
    image:
      "https://images.unsplash.com/photo-1718252540511-e958742e4165?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Everyday essentials",
    items: "180+ Styles",
  },
];

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

const headerVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

export default function ShopByCategory() {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div
          className="text-center mb-16 w-full rounded-full"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.25), rgba(255,255,255,0.25)), url("https://t4.ftcdn.net/jpg/02/70/66/31/360_F_270663191_RqaOWu68yXUeF3hY2Ocq3A43xbg56VNO.jpg")',
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
              Category's
            </motion.h2>

            <motion.p
              className="text-gray-600 text-lg font-light max-w-md mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Find your perfect style.
            </motion.p>
          </motion.div>
        </div>

        {/* Enhanced Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              variants={cardVariants}
              whileHover="hover"
              initial="rest"
              className="group relative"
            >
              <motion.div
                className="relative h-96 sm:h-[450px] rounded-3xl overflow-hidden cursor-pointer"
                whileHover={{ y: -8 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                {/* Glow Effect */}
                <motion.div
                  variants={glowVariants}
                  className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                />

                {/* Image Container */}
                <div className="relative h-full overflow-hidden rounded-3xl bg-gray-200">
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
                    <h3 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
                      {category.name}
                    </h3>

                    <p className="text-gray-200 text-lg mb-6 font-light opacity-90">
                      {category.description}
                    </p>

                    {/* CTA Button */}
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center 
             px-4 py-2 text-sm 
             sm:px-6 sm:py-3 sm:text-lg 
             bg-white text-gray-900 
             rounded-full font-semibold 
             shadow-lg hover:shadow-xl 
             transition-all duration-300 
             group w-fit"
                    >
                      Explore Collection
                      <motion.svg
                        className="ml-2 w-4 h-4 sm:w-5 sm:h-5"
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

        {/* Enhanced Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mt-20"
        >
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
            }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center px-12 py-4 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-2xl font-semibold text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 group relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0  opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={false}
            />
            <span className="relative z-10">View All Collections</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
