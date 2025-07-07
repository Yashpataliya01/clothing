import React, { useState } from "react";
import {
  Phone,
  Mail,
  Instagram,
  Facebook,
  MapPin,
  Clock,
  ExternalLink,
} from "lucide-react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const address = "Shop Address Here, Bhilwara, RJ 311001, India";
  const encodedAddress = encodeURIComponent(address);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOpenMaps = () => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(googleMapsUrl, "_blank");
  };

  const handleDirections = () => {
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
    window.open(directionsUrl, "_blank");
  };

  const handleSubmit = () => {
    if (formData.firstName && formData.email && formData.message) {
      alert("Message sent successfully!");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Contact Information */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Contact Us
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed mb-2">
                Email, call, or complete the form to learn how
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Snappy can solve your messaging problem.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-700" />
                <span className="text-gray-700">tmpbhilwara2151@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-700" />
                <span className="text-gray-700">8112261905</span>
              </div>
              <div className="text-blue-600 underline cursor-pointer">
                Customer Support
              </div>
            </div>

            {/* Support Sections */}
            <div className="grid md:grid-cols-3 gap-6 pt-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Customer Support
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Our support team is available around the clock to address any
                  concerns or queries you may have.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Feedback and Suggestions
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  We value your feedback and are continuously working to improve
                  Snappy. Your input is crucial in shaping the future of Snappy.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Media Inquiries
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  For media-related questions or press inquiries, please contact
                  us at media@snappyapp.com.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Get in Touch
            </h2>
            <p className="text-gray-600 mb-8">You can reach us anytime</p>

            <div className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Email Field */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your email"
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Phone Field */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  <span className="text-sm text-gray-600">+91</span>
                  <div className="w-px h-4 bg-gray-300"></div>
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone number"
                  className="w-full pl-16 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Message Field */}
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="How can we help?"
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
              />

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Submit
              </button>

              {/* Terms Text */}
              <p className="text-xs text-gray-500 text-center">
                By contacting us, you agree to our{" "}
                <span className="text-blue-600 cursor-pointer">
                  Terms of service
                </span>{" "}
                and{" "}
                <span className="text-blue-600 cursor-pointer">
                  Privacy Policy
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16 grid lg:grid-cols-2 gap-12 items-center">
          {/* Map Placeholder */}
          <div className="bg-gray-100 rounded-2xl h-96 relative overflow-hidden">
            {/* Google Maps Embedded View - No API required */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14319.234567890123!2d74.6414567890123!3d25.3467123456789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396f5b7c8b8b8b8b%3A0x1234567890abcdef!2sBhilwara%2C%20Rajasthan%20311001%2C%20India!5e1!3m2!1sen!2sin!4v1640995200000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-2xl"
            />

            {/* Action buttons */}
            <div className="absolute bottom-4 right-4 flex space-x-2">
              <button
                onClick={handleOpenMaps}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium flex items-center space-x-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open in Maps</span>
              </button>
            </div>

            {/* Satellite view indicator */}
            <div className="absolute top-4 right-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-xs font-medium">
              Satellite View
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Our Location
              </h2>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Connecting Near and Far
              </h3>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Headquarters
              </h4>
              <div className="space-y-2 text-gray-600">
                <p className="font-medium">The Mobile Point</p>
                <p>Bhilwara, Rajasthan</p>
                <p>Shop Address Here</p>
                <p>Bhilwara, RJ 311001</p>
                <p>India</p>
              </div>
            </div>

            <div className="pt-4">
              <div className="flex items-center space-x-3 text-gray-600">
                <Clock className="w-5 h-5" />
                <span>Open: Mon-Sat 9:00 AM - 8:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
