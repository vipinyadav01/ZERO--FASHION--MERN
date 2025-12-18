import { useState, useEffect, useCallback, useRef } from "react";
import { ArrowRight, ArrowLeft, ShoppingBag, Sparkles, TrendingUp, Package, ChevronRight } from "lucide-react";
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
      tag: "New Arrivals",
      tagIcon: Sparkles,
      title: "Redefine",
      titleAccent: "Your Style",
      subtitle: "Winter Collection 2025",
      description: "Discover curated pieces that blend timeless elegance with contemporary fashion.",
      cta: "Shop Now",
      ctaLink: "/collection",
      discount: "40% Off"
    },
    {
      id: 2,
      image: "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1200&dpr=2",
      mobileImage: "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=2",
      tag: "Trending",
      tagIcon: TrendingUp,
      title: "Elevate",
      titleAccent: "Every Moment",
      subtitle: "Premium Essentials",
      description: "From boardroom to weekend brunch, our collection adapts to your lifestyle.",
      cta: "Explore",
      ctaLink: "/collection",
      discount: "Free Shipping"
    },
    {
      id: 3,
      image: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1200&dpr=2",
      mobileImage: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=2",
      tag: "Limited",
      tagIcon: Package,
      title: "Exclusive",
      titleAccent: "Designs",
      subtitle: "Signature Series",
      description: "Limited pieces designed for those who appreciate the art of fashion.",
      cta: "View",
      ctaLink: "/collection",
      discount: "20% Extra"
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
  const TagIcon = currentContent.tagIcon;

  return (
    <section 
      className="relative w-full overflow-hidden"
      style={{ 
        height: 'calc(100vh - 56px)',
        marginTop: '-0.5rem'
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
        
        {/* Gradient Overlays - stronger on mobile for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30 sm:from-black/80 sm:via-black/50 sm:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 sm:from-black/60 sm:to-black/20" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col justify-between px-5 sm:px-6 lg:px-12 py-4 sm:py-6 lg:py-10">
        
        {/* Top Content */}
        <div className="flex-1 flex flex-col justify-center max-w-2xl">
          
          {/* Tag & Discount Badge */}
          <div 
            className={`flex flex-wrap items-center gap-2 mb-3 sm:mb-6 transition-all duration-500 ${
              isTransitioning ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'
            }`}
          >
            <span className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
              <TagIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              <span className="text-white text-xs sm:text-sm font-medium">{currentContent.tag}</span>
            </span>
            <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-white text-black text-[10px] sm:text-xs font-bold rounded-full">
              {currentContent.discount}
            </span>
          </div>

          {/* Main Heading - responsive sizing */}
          <h1 
            className={`transition-all duration-500 delay-75 ${
              isTransitioning ? 'opacity-0 -translate-y-6' : 'opacity-100 translate-y-0'
            }`}
          >
            <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[0.95] tracking-tight">
              {currentContent.title}
            </span>
            <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.95] tracking-tight mt-1 sm:mt-2 bg-gradient-to-r from-gray-200 via-white to-gray-300 bg-clip-text text-transparent">
              {currentContent.titleAccent}
            </span>
          </h1>

          {/* Subtitle */}
          <p 
            className={`text-base sm:text-xl md:text-2xl text-gray-300 mt-2 sm:mt-4 font-light tracking-wide transition-all duration-500 delay-100 ${
              isTransitioning ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'
            }`}
          >
            {currentContent.subtitle}
          </p>

          {/* Description - hidden on very small screens */}
          <p 
            className={`hidden sm:block text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed mt-3 sm:mt-6 max-w-lg transition-all duration-500 delay-150 ${
              isTransitioning ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'
            }`}
          >
            {currentContent.description}
          </p>

          {/* CTA Buttons - mobile optimized */}
          <div 
            className={`flex items-center gap-3 mt-5 sm:mt-8 transition-all duration-500 delay-200 ${
              isTransitioning ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'
            }`}
          >
            <Link
              to={currentContent.ctaLink}
              className="group relative inline-flex items-center gap-2 bg-white text-black px-5 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-semibold rounded-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-white/20 active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{currentContent.cta}</span>
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              to="/collection"
              className="hidden sm:inline-flex group items-center gap-2 border-2 border-white/40 text-white px-6 py-3.5 sm:px-8 sm:py-4 text-sm sm:text-base font-medium rounded-full backdrop-blur-sm hover:bg-white/10 hover:border-white transition-all duration-300"
            >
              View All
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Bottom Section - Navigation */}
        <div className="pb-16 sm:pb-0">
          <div className="flex items-center justify-between">
            
            {/* Left: Navigation Controls */}
            <div className="flex items-center gap-3 sm:gap-6">
              {/* Nav Buttons - smaller on mobile */}
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => navigateSlide('prev')}
                  disabled={isTransitioning}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-black active:scale-95 transition-all duration-300 disabled:opacity-50 backdrop-blur-sm"
                  aria-label="Previous slide"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => navigateSlide('next')}
                  disabled={isTransitioning}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-black active:scale-95 transition-all duration-300 disabled:opacity-50 backdrop-blur-sm"
                  aria-label="Next slide"
                >
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Slide Indicators */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`relative h-1.5 sm:h-1 rounded-full transition-all duration-500 overflow-hidden ${
                      index === currentSlide ? 'w-8 sm:w-12 bg-white' : 'w-4 sm:w-6 bg-white/30 hover:bg-white/50'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  >
                    {index === currentSlide && !isPaused && (
                      <span 
                        className="absolute inset-0 bg-white/50 origin-left"
                        style={{ 
                          animation: 'progress 6s linear forwards',
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Slide Counter - hidden on small mobile */}
              <span className="hidden sm:block text-white/60 text-sm font-medium">
                <span className="text-white font-bold">{String(currentSlide + 1).padStart(2, '0')}</span>
                <span className="mx-1">/</span>
                <span>{String(slides.length).padStart(2, '0')}</span>
              </span>
            </div>

            {/* Right: Swipe Hint (mobile only) */}
            <div className="flex sm:hidden items-center gap-1 text-white/50 text-xs">
              <span>Swipe</span>
              <ArrowRight className="w-3 h-3" />
            </div>

            {/* Right: Quick Stats (desktop only) */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="block text-white font-bold text-sm">2000+</span>
                  <span className="block text-white/60 text-[10px]">Products</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="block text-white font-bold text-sm">15k+</span>
                  <span className="block text-white/60 text-[10px]">Customers</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="block text-white font-bold text-sm">4.9★</span>
                  <span className="block text-white/60 text-[10px]">Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar Animation Styles */}
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
