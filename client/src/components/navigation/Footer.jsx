import React from "react";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-[#0f0f0f] text-gray-300 py-16 px-6 sm:px-12">
      {/* Top Border Gradient */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 z-10 relative">
        {/* Logo + Tagline */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
            CLOTHIQUE
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Style meets simplicity. Discover outfits crafted for confidence and
            comfort.
          </p>
          <div className="mt-4 flex gap-4">
            {[Instagram, Facebook, Linkedin].map((Icon, idx) => (
              <a
                key={idx}
                href="#"
                className="p-2 rounded-full border border-gray-600 hover:border-orange-500 transition hover:bg-orange-500 hover:text-white"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-white">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {["Home", "Shop", "About", "Blog", "Contact"].map((link, i) => (
              <li key={i}>
                <a
                  href="#"
                  className="hover:text-orange-400 hover:underline transition"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-white">Contact</h3>
          <div className="space-y-3 text-sm text-gray-400">
            <div className="flex items-start gap-2">
              <Mail className="w-5 h-5 text-orange-500" />
              <span>hello@clothique.com</span>
            </div>
            <div className="flex items-start gap-2">
              <Phone className="w-5 h-5 text-orange-500" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-orange-500" />
              <span>Bhilwara, Rajasthan, India</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-16 pt-6 border-t border-gray-800 text-sm text-center text-gray-500">
        &copy; {new Date().getFullYear()} Clothique. Designed with ❤️ in India.
      </div>
    </footer>
  );
};

export default Footer;
