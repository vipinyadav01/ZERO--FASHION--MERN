import { useState, useEffect } from "react";
import { ArrowRight, ShoppingBag, Heart, Clock, Play, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";
import LazyImage from "./LazyImage";

// Optimized HeroImage component using LazyImage
const HeroImage = ({ src, alt, className, loading = "eager", ...props }) => {
  return (
    <LazyImage
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      {...props}
    />
  );
};

const HeroStats = ({ icon: Icon, label, value, onClick, className = "" }) => (
  <div 
    className={`flex items-center gap-3 px-4 py-3 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md hover:border-gray-400 hover:-translate-y-1 cursor-pointer group ${className}`}
    onClick={onClick}
  >
    <div className="p-2 bg-gradient-to-br from-gray-900 to-black rounded-lg group-hover:from-black group-hover:to-gray-800 transition-all duration-300">
      <Icon className="w-4 h-4 text-white" />
    </div>
    <div className="text-sm">
      <span className="font-bold text-gray-900 block">{value}</span>
      <span className="text-gray-600 text-xs">{label}</span>
    </div>
  </div>
);

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const featuredProducts = [
    {
      id: 1,
      image: "https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&dpr=2",
      title: "Winter Elegance",
      subtitle: "Premium Collection 2025",
      description: "Discover luxurious winter pieces crafted for the modern wardrobe",
      cta: "Shop Winter"
    },
    {
      id: 2,
      image: "https://images.pexels.com/photos/5868722/pexels-photo-5868722.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&dpr=2",
      title: "Cozy Essentials",
      subtitle: "Comfort Meets Style",
      description: "Essential pieces designed for everyday luxury and comfort",
      cta: "Explore Essentials"
    },
    {
      id: 3,
      image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&dpr=2",
      title: "Spring Preview",
      subtitle: "Fresh & Modern",
      description: "Get ready for spring with our latest contemporary designs",
      cta: "Preview Spring"
    }
  ];
  
  // Preload images
  useEffect(() => {
    const imagePromises = featuredProducts.map(product => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = product.image;
      });
    });
    
    Promise.all(imagePromises)
      .then(() => setIsLoading(false))
      .catch(() => setIsLoading(false));
  }, []);
  // Auto-rotation with pause on hover
  useEffect(() => {
    if (!isHovered && !isLoading) {
      const timer = setInterval(() => {
        setCurrentImageIndex((prev) => (prev === featuredProducts.length - 1 ? 0 : prev + 1));
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [isHovered, featuredProducts.length, isLoading]);
  
  const currentProduct = featuredProducts[currentImageIndex];
  
  return (
    <div className="relative w-full min-h-[600px] lg:min-h-[700px] overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#000" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row min-h-[600px] lg:min-h-[700px] items-center">
          {/* Left content section */}
          <div className="w-full lg:w-1/2 lg:pr-8 xl:pr-16">
            <div className="max-w-xl py-8 lg:py-16">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-xs font-semibold bg-black text-white rounded-full animate-pulse hover:animate-none transition-all duration-300 cursor-pointer hover:bg-gray-800">
                <Star className="w-3 h-3 fill-current animate-spin" style={{ animationDuration: '3s' }} />
                <span className="tracking-widest">FEATURED COLLECTION</span>
              </div>
              
              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[0.9] mb-4 text-gray-900">
                <span className="bg-gradient-to-r from-gray-900 via-black to-gray-800 bg-clip-text text-transparent">
                  {currentProduct.title}
                </span>
              </h1>
              
              {/* Subtitle */}
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-light text-gray-600 mb-6 leading-relaxed">
                {currentProduct.subtitle}
              </h2>
              
              {/* Description */}
              <p className="text-gray-700 text-lg leading-relaxed mb-8 max-w-lg">
                {currentProduct.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link
                  to="/collection"
                  className="group hero-btn flex items-center justify-center gap-3 bg-black text-white px-8 py-4 font-semibold rounded-xl hover:bg-gray-900 transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95"
                >
                  {currentProduct.cta}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                
                <button
                  className="group flex items-center justify-center gap-3 border-2 border-black text-black px-8 py-4 font-semibold rounded-xl hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-105"
                  onClick={() => {
                    const nextIndex = currentImageIndex === 0 ? featuredProducts.length - 1 : currentImageIndex - 1;
                    setCurrentImageIndex(nextIndex);
                  }}
                  title="Previous collection"
                >
                  <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform duration-200" />
                  Previous
                </button>
              </div>

              {/* Stats */}
              <div className="flex flex-col sm:flex-row gap-4">
                <HeroStats 
                  icon={ShoppingBag} 
                  label="Premium Items" 
                  value="2000+" 
                  onClick={() => window.location.href = '/collection'}
                  className="hover:bg-gray-50"
                />
                <HeroStats 
                  icon={Users} 
                  label="Happy Customers" 
                  value="15k+" 
                  onClick={() => window.scrollTo({ top: window.innerHeight * 2, behavior: 'smooth' })}
                  className="hover:bg-gray-50"
                />
                <HeroStats 
                  icon={Star} 
                  label="Rating" 
                  value="4.9/5" 
                  onClick={() => window.scrollTo({ top: window.innerHeight * 2, behavior: 'smooth' })}
                  className="hover:bg-gray-50"
                />
              </div>
            </div>
          </div>

          {/* Right image section */}
          <div className="w-full lg:w-1/2 lg:pl-8 xl:pl-16">
            <div 
              className="relative group"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Main Image Container */}
              <div className="relative aspect-[4/5] lg:aspect-[3/4] xl:aspect-[4/5] overflow-hidden rounded-3xl bg-gradient-to-br from-gray-200 to-gray-300 shadow-2xl">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
                    <div className="w-12 h-12 border-4 border-gray-400 border-t-black rounded-full animate-spin" />
                  </div>
                )}
                
                <HeroImage
                  src={currentProduct.image}
                  alt={`${currentProduct.title} - ${currentProduct.subtitle}`}
                  className={`w-full h-full transition-all duration-700 group-hover:scale-110 ${
                    isLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                  loading="eager"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                
                {/* Image Navigation Controls */}
                <div className="absolute inset-0 flex items-center justify-between px-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => setCurrentImageIndex(prev => prev === 0 ? featuredProducts.length - 1 : prev - 1)}
                    className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
                    aria-label="Previous image"
                  >
                    <ArrowRight className="w-5 h-5 rotate-180 text-gray-900" />
                  </button>
                  
                  <button
                    onClick={() => setCurrentImageIndex(prev => (prev === featuredProducts.length - 1 ? 0 : prev + 1))}
                    className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
                    aria-label="Next image"
                  >
                    <ArrowRight className="w-5 h-5 text-gray-900" />
                  </button>
                </div>
                
                {/* Collection Counter */}
                <div className="absolute top-6 right-6">
                  <div className="bg-black/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                    {currentImageIndex + 1} / {featuredProducts.length}
                  </div>
                </div>
              </div>
              
              {/* Dot Indicators */}
              <div className="flex justify-center mt-6 gap-3">
                {featuredProducts.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      idx === currentImageIndex 
                        ? 'bg-black scale-125 shadow-lg' 
                        : 'bg-gray-300 hover:bg-gray-400 hover:scale-110'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default Hero;
