import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const ModernHeroSlider = () => {
  const [headers, setHeaders] = useState([]);
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const intervalRef = useRef(null);

  // Layout options to cycle through
  const layouts = ["leftElegant", "rightClassic", "centerModern"];

  // Fetch headers from API
  useEffect(() => {
    const fetchHeaders = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/header/");
        if (!response.ok) throw new Error("Failed to fetch headers");
        const data = await response.json();
        // Map API data to slider format
        const mappedData = data.map((header, i) => ({
          title: header.name,
          subtitle: header.description,
          image: header.image,
          accent: header.tag,
          buttonText: "Shop Now", // Hardcoded as not provided by API
          layout: layouts[i % layouts.length], // Cycle through layouts
        }));
        setHeaders(mappedData);
        setLoading(false);
      } catch (err) {
        setError("Failed to load headers. Please try again later.");
        setLoading(false);
      }
    };

    fetchHeaders();
  }, []);

  // Handle slider auto-progression
  useEffect(() => {
    if (headers.length === 0) return;

    const startTimer = () => {
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIndex((i) => (i + 1) % headers.length);
            return 0;
          }
          return prev + 100 / 70; // 7 seconds = 7000ms, update every 100ms
        });
      }, 100);
    };

    startTimer();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [index, headers.length]);

  const handleDotClick = (i) => {
    setIndex(i);
    setProgress(0);
  };

  const getContentDesign = (slide, slideIndex) => {
    switch (slide.layout) {
      case "leftElegant":
        return (
          <motion.div
            className="absolute left-16 top-1/2 -translate-y-1/2 max-w-2xl"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.span
              className="block text-white/70 text-sm font-light tracking-[0.2em] mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {slide.accent}
            </motion.span>
            <motion.h1
              className="text-white text-6xl md:text-8xl font-bold mb-4 leading-[0.9]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              {slide.title}
            </motion.h1>
            <motion.p
              className="text-white/90 text-xl md:text-2xl font-light mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {slide.subtitle}
            </motion.p>
            <Link to="/products">
              <motion.button
                className="px-8 py-3 bg-white text-black text-sm font-semibold hover:bg-gray-100 transition-colors duration-300 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {slide.buttonText}
              </motion.button>
            </Link>
          </motion.div>
        );

      case "rightClassic":
        return (
          <motion.div
            className="absolute right-16 top-1/2 -translate-y-1/2 max-w-xl text-right"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.span
              className="block text-white/70 text-sm font-light tracking-[0.2em] mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {slide.accent}
            </motion.span>
            <motion.h1
              className="text-white text-6xl md:text-8xl font-bold mb-4 leading-[0.9]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              {slide.title}
            </motion.h1>
            <motion.p
              className="text-white/90 text-xl md:text-2xl font-light mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {slide.subtitle}
            </motion.p>
            <Link to="/products">
              <motion.button
                className="px-8 py-3 bg-white text-black text-sm font-semibold hover:bg-gray-100 transition-colors duration-300 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {slide.buttonText}
              </motion.button>
            </Link>
          </motion.div>
        );

      case "centerModern":
        return (
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center max-w-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.span
              className="block text-white/70 text-sm font-light tracking-[0.2em] mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {slide.accent}
            </motion.span>
            <motion.h1
              className="text-white text-6xl md:text-8xl font-bold mb-4 leading-[0.9]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              {slide.title}
            </motion.h1>
            <motion.p
              className="text-white/90 text-xl md:text-2xl font-light mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {slide.subtitle}
            </motion.p>
            <Link to="/products">
              <motion.button
                className="px-8 py-3 bg-white text-black text-sm font-semibold hover:bg-gray-100 transition-colors duration-300 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {slide.buttonText}
              </motion.button>
            </Link>
          </motion.div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <section className="relative w-full h-screen flex items-center justify-center bg-gray-900">
        <div className="flex items-center space-x-3">
          <svg className="animate-spin h-8 w-8 text-white" viewBox="0 0 24 24">
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
          <span className="text-white text-lg">Loading headers...</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative w-full h-screen flex items-center justify-center bg-gray-900">
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
          {error}
        </div>
      </section>
    );
  }

  if (headers.length === 0) {
    return (
      <section className="relative w-full h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-lg">No headers available.</div>
      </section>
    );
  }

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background slider */}
      <div
        className="absolute inset-0 flex transition-transform duration-1000 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {headers.map((slide, i) => (
          <div key={i} className="w-full h-full relative flex-shrink-0">
            <div className="absolute inset-0 bg-black/20 z-10" />
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover filter brightness-75"
            />
          </div>
        ))}
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 z-20">
        <AnimatePresence mode="wait">
          {getContentDesign(headers[index], index)}
        </AnimatePresence>
      </div>

      {/* Enhanced navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4">
        {headers.map((_, i) => (
          <button
            key={i}
            onClick={() => handleDotClick(i)}
            className="group relative"
            aria-label={`Go to slide ${i + 1}`}
          >
            <div
              className={`h-1 rounded-full transition-all duration-300 ${
                i === index
                  ? "w-12 bg-white"
                  : "w-6 bg-white/40 hover:bg-white/60"
              }`}
            >
              {i === index && (
                <motion.div
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              )}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default ModernHeroSlider;
