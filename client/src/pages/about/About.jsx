import React from "react";
import {
  Heart,
  Users,
  Sparkles,
  ShoppingBag,
  Star,
  ArrowRight,
} from "lucide-react";

import aboutVideo from "../../assets/about/about.mp4";
import Logo from "../../assets/home/mainlogo.png";

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[600px] overflow-hidden">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          src={aboutVideo}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center text-white">
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-white text-white font-medium text-sm mb-8">
              <Sparkles className="w-4 h-4 mr-2" />
              Est. 2021 - Your Style Destination
            </div>
            <h1 className="text-5xl md:text-7xl font-light mb-6 tracking-tight">
              Style World
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-light">
              Where fashion meets function, and everyone finds something that
              feels just right
            </p>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-20 ">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-light text-black mb-6">
                  Our Story
                </h2>
                <div className="w-16 h-px bg-black mb-8"></div>
              </div>
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p className="text-lg font-light">
                  Style World began with a simple observation—there was a
                  growing need for a premium, all-in-one clothing destination
                  where families could shop the latest trends without
                  compromising on quality or style.
                </p>
                <p className="text-lg font-light">
                  In 2021, we turned that idea into reality, creating a space
                  where fashion meets function, and everyone—men, women, and
                  kids—can find something that feels just right.
                </p>
                <p className="text-lg font-light">
                  We believe shopping should be effortless—so we've built a
                  store that caters to the entire family, all under one roof.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-none p-12 border border-gray-200">
                <img
                  src="https://www.indifi.com/blog/wp-content/uploads/2019/12/Things-You-Should-Know-as-a-Clothing-or-Fashion-Shop-Owner-e1579767390771.jpg"
                  className="w-full h-full object-fill"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-black mb-6">
              What Drives Us
            </h2>
            <div className="w-16 h-px bg-black mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Driven by a passion for fashion and a commitment to quality, we
              focus on offering pieces that are current, comfortable, and
              crafted to last.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: "Quality First",
                description:
                  "Each item in our collection is handpicked to ensure it perfectly fits your fit—in style, comfort, and spirit.",
              },
              {
                icon: Users,
                title: "Family Focused",
                description:
                  "From men and women to kids, we cater to the entire family with carefully curated collections for everyone.",
              },
              {
                icon: Sparkles,
                title: "Style Evolution",
                description:
                  "We offer style that evolves, just like you do—from everyday casuals to grand occasion wear.",
              },
            ].map((item, index) => (
              <div key={index} className="group">
                <div className=" border border-gray-200 p-8 hover:border-black transition-colors duration-300">
                  <div className="w-16 h-16 bg-black flex items-center justify-center mb-6 group-hover:bg-gray-800 transition-colors duration-300">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-black mb-4">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product Range Section */}
      <div className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-black mb-6">
              Our Collection
            </h2>
            <div className="w-16 h-px bg-black mx-auto mb-8"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Everyday Casuals" },
              { name: "Smart Formals" },
              { name: "Festive Ethnicwear" },
              { name: "Wedding Outfits" },
            ].map((category, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative overflow-hidden">
                  <div className="h-48 bg-white border border-gray-200 flex items-center justify-center group-hover:bg-black transition-colors duration-300">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gray-100 group-hover:bg-gray-800 flex items-center justify-center mx-auto mb-3 transition-colors duration-300">
                        <ShoppingBag className="w-6 h-6 text-black group-hover:text-white transition-colors duration-300" />
                      </div>
                      <h3 className="text-black group-hover:text-white font-medium text-lg transition-colors duration-300">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-light text-white mb-8">
            More Than Just a Store
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed mb-12 font-light">
            We're your go-to destination for celebrating life's everyday moments
            and grand occasions—with style that evolves, just like you do.
            Whether it's a classic kurta, a trendy co-ord set, or a sharp
            blazer, we're here to help you express your unique style.
          </p>
          <div className="inline-flex items-center px-8 py-4 bg-white text-black font-medium hover:bg-gray-100 transition-colors duration-300 cursor-pointer group">
            Discover Our Collection
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "2021", label: "Founded" },
              { number: "1000+", label: "Happy Customers" },
              { number: "500+", label: "Curated Pieces" },
              { number: "3", label: "Generations Served" },
            ].map((stat, index) => (
              <div key={index} className="group">
                <div className="text-3xl font-light text-black mb-2 group-hover:font-normal transition-all duration-300">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-light">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
