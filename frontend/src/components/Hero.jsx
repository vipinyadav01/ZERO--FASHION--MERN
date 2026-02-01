import { useState, useEffect, useCallback, useRef } from "react";
import { ArrowRight, ArrowLeft, ShoppingBag, Sparkles, Package } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const slides = [
    {
      id: 1,
      image: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1200&dpr=2",
      mobileImage: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=2",
      badge: "NEW COLLECTION",
      title: "Winter Fashion 2025",
      subtitle: "Exclusive styles just for you",
      cta: "Shop Now",
      ctaLink: "/collection",
      highlight: "Up to 50% Off"
    },
    {
      id: 2,
      image: "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1200&dpr=2",
      mobileImage: "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=2",
      badge: "TRENDING NOW",
      title: "Premium Essentials",
      subtitle: "Curated for every occasion",
      cta: "Explore",
      ctaLink: "/collection",
      highlight: "Free Shipping Above ₹499"
    },
    {
      id: 3,
      image: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1200&dpr=2",
      mobileImage: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=2",
      badge: "LIMITED EDITION",
      title: "Exclusive Designs",
      subtitle: "Signature collection",
      cta: "View All",
      ctaLink: "/collection",
      highlight: "Members Save 20%"
    }
  ];

  const navigateSlide = useCallback((direction) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentSlide(prev => {
      if (direction === 'next') {
        return prev === slides.length - 1 ? 0 : prev + 1;
      }
      return prev === 0 ? slides.length - 1 : prev - 1;
    });
    
    setTimeout(() => setIsTransitioning(false), 700);
  }, [isTransitioning, slides.length]);

  const goToSlide = useCallback((index) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [isTransitioning, currentSlide]);

  // Touch/Swipe handlers for mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;
    
    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        navigateSlide('next');
      } else {
        navigateSlide('prev');
      }
    }
  };

  // Auto-advance slides
  useEffect(() => {
    if (isPaused) return;
    
    const timer = setInterval(() => {
      navigateSlide('next');
    }, 6000);
    
    return () => clearInterval(timer);
  }, [isPaused, navigateSlide]);

  const currentContent = slides[currentSlide];

  return (
    <section 
      className="relative w-full overflow-hidden bg-white mt-14 sm:mt-16"
      style={{ 
        height: 'calc(100vh - 56px)',
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Images */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-700 ease-out ${
              index === currentSlide 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-105'
            }`}
          >
            {/* Desktop Image */}
            <img
              src={slide.image}
              alt={slide.title}
              className="hidden sm:block w-full h-full object-cover object-center"
              loading={index === 0 ? "eager" : "lazy"}
            />
            {/* Mobile Image - optimized for portrait */}
            <img
              src={slide.mobileImage}
              alt={slide.title}
              className="sm:hidden w-full h-full object-cover object-top"
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
        
        {/* Gradient Overlays - refined for cleaner look */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent sm:from-black/75 sm:via-black/45 sm:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      </div>

      {/* Main Content - Cleaner Layout */}
      <div className="relative z-10 h-full flex flex-col justify-between px-4 sm:px-8 lg:px-12 py-6 sm:py-8 lg:py-10">
        
        {/* Top Section - Empty spacer */}
        <div className="flex-shrink-0"></div>

        {/* Center Content */}
        <div className="flex-1 flex flex-col justify-center max-w-2xl">
          
          {/* Badge */}
          <div 
            className={`inline-flex mb-4 sm:mb-6 transition-all duration-500 ${
              isTransitioning ? 'opacity-0 -translate-x-6' : 'opacity-100 translate-x-0'
            }`}
          >
            <span className="px-4 py-2 bg-white text-black text-xs sm:text-sm font-bold rounded-full">
              {currentContent.badge}
            </span>
          </div>

          {/* Main Title - Clean and Simple */}
          <h1 
            className={`transition-all duration-500 delay-75 ${
              isTransitioning ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'
            }`}
          >
            <span className="block text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
              {currentContent.title}
            </span>
          </h1>

          {/* Subtitle */}
          <p 
            className={`text-lg sm:text-xl text-gray-200 mt-3 sm:mt-4 font-light transition-all duration-500 delay-100 ${
              isTransitioning ? 'opacity-0 -translate-y-3' : 'opacity-100 translate-y-0'
            }`}
          >
            {currentContent.subtitle}
          </p>

          {/* Highlight Badge */}
          <div 
            className={`mt-4 sm:mt-6 inline-flex transition-all duration-500 delay-150 ${
              isTransitioning ? 'opacity-0 -translate-y-3' : 'opacity-100 translate-y-0'
            }`}
          >
            <span className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg">
              {currentContent.highlight}
            </span>
          </div>

          {/* CTA Button */}
          <div 
            className={`mt-8 sm:mt-10 transition-all duration-500 delay-200 ${
              isTransitioning ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'
            }`}
          >
            <Link
              to={currentContent.ctaLink}
              className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 sm:py-5 text-base sm:text-lg font-bold rounded-lg hover:bg-gray-100 transition-all active:scale-95 shadow-lg hover:shadow-xl"
            >
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
              {currentContent.cta}
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
          </div>
        </div>

        {/* Bottom Navigation Section */}
        <div className="flex-shrink-0">
          <div className="flex items-center justify-between">
            
            {/* Left: Navigation Controls */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Nav Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateSlide('prev')}
                  disabled={isTransitioning}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white/40 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all active:scale-95 disabled:opacity-50"
                  aria-label="Previous slide"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => navigateSlide('next')}
                  disabled={isTransitioning}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white/40 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all active:scale-95 disabled:opacity-50"
                  aria-label="Next slide"
                >
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Slide Indicators - Simplified */}
              <div className="flex items-center gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      index === currentSlide ? 'w-8 bg-white' : 'w-3 bg-white/30 hover:bg-white/50'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  >
                    {index === currentSlide && !isPaused && (
                      <span 
                        className="w-full h-full bg-white/50 rounded-full origin-left"
                        style={{ 
                          animation: 'progress 6s linear forwards',
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Slide Counter */}
              <span className="hidden sm:block text-white/70 text-xs font-medium ml-2">
                <span className="text-white font-bold">{String(currentSlide + 1).padStart(2, '0')}</span>
                <span> / {slides.length}</span>
              </span>
            </div>

            {/* Right: Info (desktop only) */}
            <div className="hidden lg:flex items-center gap-6 text-white text-sm">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                <span>2000+ Products</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span>Premium Quality</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Animation Styles */}
      <style>{`
        @keyframes progress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
    </section>
  );
};

export default Hero;
