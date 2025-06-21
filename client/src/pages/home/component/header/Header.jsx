import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1569810020669-aa9d38003ea7?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "FESTIVE",
    subtitle: "New Arrivals Just Dropped!",
    buttonText: "Shop Indo-Westerns",
    layout: "leftElegant",
    accent: "COLLECTION 2025",
  },
  {
    image:
      "https://cloudfront-eu-central-1.images.arcpublishing.com/businessoffashion/MKFI57CEEBDDFEVI3FZCTRLV4I.jpg",
    title: "ELEGANT",
    subtitle: "TIMELESS & LUXURIOUS",
    buttonText: "New Arrivals",
    layout: "rightClassic",
    accent: "PREMIUM",
  },
  {
    image:
      "https://img.damensch.com/damensch/cms-media/blog-images/summer%20clothes%20for%20men_%202024%20style%20forecast.png",
    title: "SUMMER",
    subtitle: "SLAY IN BREEZY COMFORT",
    buttonText: "Shop Now",
    layout: "centerModern",
    accent: "HOTNESS",
  },
];

export default function ModernHeroSlider() {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    const startTimer = () => {
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIndex((i) => (i + 1) % slides.length);
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
  }, [index]);

  const handleDotClick = (i) => {
    setIndex(i);
    setProgress(0);
  };

  const getContentDesign = (slide, slideIndex) => {
    switch (slideIndex) {
      case 0: // Festive - Simple left layout
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

            <motion.button
              className="px-8 py-3 bg-white text-black text-sm font-semibold hover:bg-gray-100 transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {slide.buttonText}
            </motion.button>
          </motion.div>
        );

      case 1: // Elegant - Simple right layout
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

            <motion.button
              className="px-8 py-3 bg-white text-black text-sm font-semibold hover:bg-gray-100 transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {slide.buttonText}
            </motion.button>
          </motion.div>
        );

      case 2: // Summer - Simple center layout
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

            <motion.button
              className="px-8 py-3 bg-white text-black text-sm font-semibold hover:bg-gray-100 transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {slide.buttonText}
            </motion.button>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background slider */}
      <div
        className="absolute inset-0 flex transition-transform duration-1000 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide, i) => (
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
          {getContentDesign(slides[index], index)}
        </AnimatePresence>
      </div>

      {/* Enhanced navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => handleDotClick(i)}
            className="group relative"
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
}
