import React from "react";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Link } from "react-router-dom";

import Logo from "../../assets/home/mainlogo.png";

const Footer = () => {
  // Define URLs for each link
  const links = [
    { name: "Home", url: "/" },
    { name: "Products", url: "/products" },
    { name: "About", url: "/about" },
    { name: "Contact", url: "/contact" },
    { name: "Return Policy", url: "/return-policy" },
    { name: "FAQs", url: "/faqs" },
  ];

  return (
    <footer className="relative bg-[#0f0f0f] text-gray-300 py-16 px-6 sm:px-12">
      {/* Top Border Gradient */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 z-10 relative">
        {/* Logo + Tagline */}
        <div className="flex items-center flex-col">
          <img src={Logo} className="w-20 mb-4 rounded-full" alt="" />
          <p className="text-sm text-gray-400 leading-relaxed text-center">
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
          <ul className="grid grid-cols-2 grid-rows-2 gap-x-4 gap-y-2 text-sm">
            {links.map((link, i) => (
              <li key={i}>
                <Link
                  to={link.url}
                  className="hover:text-orange-400 hover:underline transition"
                >
                  {link.name}
                </Link>
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
              <span>peshwanitushar1@gmail.com</span>
            </div>
            <div className="flex items-start gap-2">
              <Phone className="w-5 h-5 text-orange-500" />
              <span>+91 7665059655</span>
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
        &copy; {new Date().getFullYear()} © 2025 Style World. All rights
        reserved.
      </div>
    </footer>
  );
};

export default Footer;
