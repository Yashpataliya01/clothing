import { motion } from "framer-motion";

export default function EditorialProductSpotlight() {
  return (
    <section className="w-full py-0 md:py-20 sm:py-10 overflow-hidden">
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
              src="https://cottonon.com/on/demandware.static/-/Library-Sites-cog-megastore-shared-library/default/dw17ddc8da/group/home-page/2025/06_jun/US/C_BP_WK50_US_3901515_TERTIARY_DT.jpg"
              alt="Product"
              className="w-full h-[550px] object-cover grayscale group-hover:grayscale-0 transition duration-700 ease-in-out"
            />
            <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full shadow text-sm font-medium">
              NEW ARRIVAL
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
            Effortless Elegance. <br />
            Designed for Now.
          </h2>
          <p className="text-gray-600 text-lg mb-6 leading-relaxed max-w-lg">
            Discover our exclusive pre-season edit of structured silhouettes and
            flowing fabrics. Curated for modern icons who don’t follow
            trends—they create them.
          </p>
          <button className="bg-black text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-gray-900 transition">
            Explore the Collection
          </button>
        </motion.div>
      </div>
    </section>
  );
}
