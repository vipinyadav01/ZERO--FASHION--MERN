import { useState, useEffect } from "react";
import { ArrowRight, ShoppingBag, Heart, Clock } from "lucide-react";
import { assets } from "../assets/assets";

const HeroStats = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 px-4 py-2 bg-white border border-gray-200 transition-all duration-300 hover:transform hover:-translate-y-1 hover:border-black">
    <div className="p-2 bg-black">
      <Icon className="w-4 h-4 text-white" />
    </div>
    <div className="text-sm">
      <span className="font-semibold text-black">{value}</span>
      <span className="text-gray-500 ml-1">{label}</span>
    </div>
  </div>
);

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const featuredProducts = [
    {
      id: 1,
      image: "https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      title: "Summer Collection",
      subtitle: "Latest Arrivals"
    },
    {
      id: 2,
      image: "https://images.pexels.com/photos/5868722/pexels-photo-5868722.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      title: "Winter Essentials",
      subtitle: "Cozy Comfort"
    },
    {
      id: 3,
      image: assets?.hero_img || "https://via.placeholder.com/600",
      title: "Autumn Styles",
      subtitle: "Trending Now"
    }
  ];

  useEffect(() => {
    if (!isHovered) {
      const timer = setInterval(() => {
        setCurrentImageIndex((prev) => (prev === featuredProducts.length - 1 ? 0 : prev + 1));
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [isHovered, featuredProducts.length]);

  return (
    <div className="relative w-full overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-white" style={{ zIndex: -1 }} />
      <div className="flex flex-col lg:flex-row">
        {/* Left content section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white">
          <div className="text-black max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs bg-black text-white">
              <Clock size={12} />
              <span className="tracking-widest font-medium">NEW COLLECTION</span>
            </div>

            <h1 className="font-asterion text-4xl lg:text-6xl font-normal leading-tight mb-4">
              {featuredProducts[currentImageIndex].title}
              <span className="block text-xl lg:text-2xl text-gray-600 mt-4 font-normal">
                {featuredProducts[currentImageIndex].subtitle}
              </span>
            </h1>

            <p className="text-gray-600 mb-10 max-w-md">
              Discover our curated selection of premium designs that combine style, comfort, and sustainability.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <button className="flex items-center justify-center gap-2 bg-black text-white px-8 py-4 font-medium hover:bg-gray-900 transition-colors transform hover:-translate-y-1 transition-transform duration-300">
                SHOP NOW <ArrowRight size={16} />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <HeroStats icon={ShoppingBag} label="Products" value="2000+" />
              <HeroStats icon={Heart} label="Happy Customers" value="10k+" />
            </div>
          </div>
        </div>

        {/* Right image section */}
        <div
          className="w-full lg:w-1/2 relative overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative w-full h-[350px] sm:h-[400px] lg:h-screen max-h-[600px] bg-gray-100">
            <img
              src={featuredProducts[currentImageIndex].image}
              alt={featuredProducts[currentImageIndex].title}
              className="w-full h-full object-cover transition-opacity duration-500"
              style={{ filter: 'grayscale(100%)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

            <div className="absolute bottom-8 left-8 right-8">
              <div className="flex justify-between items-center">
                <div className="flex gap-3">
                  {featuredProducts.map((_, idx) => (
                    <button
                      key={idx}
                      className={`w-12 h-1 ${idx === currentImageIndex ? 'bg-white' : 'bg-white/30'} transition-all duration-300`}
                      onClick={() => setCurrentImageIndex(idx)}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-6">
                  <button
                    className="w-12 h-12 bg-white flex items-center justify-center hover:bg-black hover:text-white transition-colors duration-300"
                    onClick={() => setCurrentImageIndex(prev => prev === 0 ? featuredProducts.length - 1 : prev - 1)}
                  >
                    <ArrowRight className="w-5 h-5 rotate-180" />
                  </button>

                  <button
                    className="w-12 h-12 bg-white flex items-center justify-center hover:bg-black hover:text-white transition-colors duration-300"
                    onClick={() => setCurrentImageIndex(prev => (prev === featuredProducts.length - 1 ? 0 : prev + 1))}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @import url('https://fonts.cdnfonts.com/css/asterion');
        
        .font-asterion {
          font-family: 'Asterion', sans-serif;
        }
      `}</style>
    </div>
  );
};

export default Hero;