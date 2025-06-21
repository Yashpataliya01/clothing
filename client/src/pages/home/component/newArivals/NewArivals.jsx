import { motion } from "framer-motion";

export default function NewArrivalsGrid({ name, Description, products }) {
  return (
    <section className="w-full mx-auto px-6 py-16">
      <motion.div
        className="text-center mb-16 w-full rounded-full"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.6 }}
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
          <motion.h3
            className="text-5xl md:text-6xl font-bold text-black mb-4 tracking-tight relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {name}
          </motion.h3>

          <motion.p
            className="text-gray-600 text-lg font-light max-w-md mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {Description}
          </motion.p>
        </motion.div>
      </motion.div>

      {products?.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {products.map((product, idx) => (
            <motion.div
              key={idx}
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
            >
              {/* Image container */}
              <div className="overflow-hidden rounded-xl relative aspect-[3/4] shadow-lg cursor-pointer">
                <img
                  src={product.image1}
                  alt={product.name}
                  className="w-full h-full object-cover transition duration-700 ease-in-out group-hover:opacity-0"
                />
                <img
                  src={product.image2}
                  alt={`${product.name} Alt`}
                  className="w-full h-full object-cover absolute top-0 left-0 transition duration-700 ease-in-out opacity-0 group-hover:opacity-100"
                />
              </div>

              {/* Info block */}
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-black">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-black font-medium">
                    ₹{product.price}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    ₹{product.originalPrice}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {product.colors.map((color, i) => (
                    <span
                      key={i}
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Available Sizes: {product.sizes.join(", ")}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          className="text-center bg-pink-50 border border-pink-200 text-pink-800 py-12 px-6 rounded-xl shadow-inner"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl font-bold mb-2">
            Oops! Nothing in the wardrobe 🧥
          </h3>
          <p className="text-gray-600 text-md">
            It looks like our latest fashion picks haven’t arrived yet. Check
            back soon for some stylish surprises!
          </p>
        </motion.div>
      )}
    </section>
  );
}
