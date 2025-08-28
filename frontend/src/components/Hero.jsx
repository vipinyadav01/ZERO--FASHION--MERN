import { useState, useEffect } from "react";
import { ArrowRight, ShoppingBag, Heart, Clock } from "lucide-react";

const fontAsterion = "font-['Asterion',sans-serif]";

const HeroStats = ({ icon: Icon, label, value }) => (
  <div className={`flex items-center gap-3 px-4 py-2 bg-white border border-gray-200 transition-all duration-300 hover:transform hover:-translate-y-1 hover:border-black ${fontAsterion}`}>
    <div className="p-2 bg-black rounded">
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
      title: "Winter Collection",
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
      image: "https://www.mojolondon.co.uk/wp-content/uploads/2022/09/autumn-fashion-for-men-960x1000.jpeg",
      title: "Autumn Collection",
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
    <div className={`relative w-full overflow-hidden pt-8 pb-8 md:pt-16 md:pb-16 bg-white ${fontAsterion}`}>
      {/* Responsive background */}
      <div className="absolute top-0 left-0 w-full h-full bg-white -z-10" />
      <div className="flex flex-col-reverse md:flex-col-reverse lg:flex-row w-full">
        {/* Left content section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-8 sm:px-8 sm:py-12 lg:p-16 bg-white">
          <div className="text-black w-full max-w-lg">
            <div className={`inline-flex items-center gap-2 px-3 py-1 mb-4 sm:mb-6 text-xs bg-black text-white rounded ${fontAsterion} animate-pulse`}>
              <Clock size={12} />
              <span className="tracking-widest font-medium">NEW COLLECTION</span>
            </div>

            <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal leading-tight mb-3 sm:mb-4 ${fontAsterion}`}>
              <span
                className="cursor-pointer hover:text-black transition-colors duration-200"
                title="Click to see next collection"
                onClick={() => setCurrentImageIndex((prev) => (prev === featuredProducts.length - 1 ? 0 : prev + 1))}
              >
                {featuredProducts[currentImageIndex].title}
              </span>
              <span className="block text-lg sm:text-xl md:text-2xl text-gray-600 mt-2 sm:mt-4 font-normal">
                {featuredProducts[currentImageIndex].subtitle}
              </span>
            </h1>

            <p className="text-gray-600 mb-8 sm:mb-10 max-w-md text-base sm:text-lg">
              <span
                className="underline cursor-pointer hover:text-black transition-colors duration-200"
                title="Learn more about our designs"
                onClick={() => alert('Explore more about our premium designs!')}
              >
                Discover our curated selection
              </span>{" "}
              of premium designs that combine style, comfort, and sustainability.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10 sm:mb-16">
              <button
                className={`flex items-center justify-center gap-2 bg-black text-white px-6 py-3 sm:px-8 sm:py-4 font-medium rounded hover:bg-gray-900 transition-colors transform hover:-translate-y-1 transition-transform duration-300 active:scale-95 ${fontAsterion}`}
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
              >
                SHOP NOW <ArrowRight size={16} />
              </button>
              <button
                className="flex items-center gap-2 border border-black text-black px-6 py-3 sm:px-8 sm:py-4 font-medium rounded hover:bg-black hover:text-white transition-colors duration-300"
                onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? featuredProducts.length - 1 : prev - 1))}
                title="See previous collection"
              >
                <ArrowRight className="rotate-180" size={16} /> PREV
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div
                className="cursor-pointer hover:scale-105 transition-transform duration-200"
                title="See all products"
                onClick={() => window.location.href = '/collection'}
              >
                <HeroStats icon={ShoppingBag} label="Products" value="2000+" />
              </div>
              <div
                className="cursor-pointer hover:scale-105 transition-transform duration-200"
                title="See what our customers say"
                onClick={() => alert('10k+ happy customers!')}
              >
                <HeroStats icon={Heart} label="Happy Customers" value="10k+" />
              </div>
            </div>
          </div>
        </div>

        {/* Right image section */}
        <div
          className="w-full lg:w-1/2 relative overflow-hidden flex items-center justify-center"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative w-full h-[220px] xs:h-[280px] sm:h-[350px] md:h-[400px] lg:h-[600px] xl:h-[700px] bg-gray-100 rounded-lg lg:rounded-none">
            <img
              src={featuredProducts[currentImageIndex].image}
              alt={featuredProducts[currentImageIndex].title}
              className="w-full h-full object-cover transition-opacity duration-500 rounded-lg lg:rounded-none"
              style={{ filter: 'grayscale(100%)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-lg lg:rounded-none" />

            <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex gap-2 sm:gap-3">
                  {featuredProducts.map((_, idx) => (
                    <button
                      key={idx}
                      className={`w-8 sm:w-12 h-1 rounded ${idx === currentImageIndex ? 'bg-white' : 'bg-white/30'} transition-all duration-300`}
                      onClick={() => setCurrentImageIndex(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-3 sm:gap-6 mt-2 sm:mt-0">
                  <button
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-white flex items-center justify-center rounded-full hover:bg-black hover:text-white transition-colors duration-300"
                    onClick={() => setCurrentImageIndex(prev => prev === 0 ? featuredProducts.length - 1 : prev - 1)}
                    aria-label="Previous"
                  >
                    <ArrowRight className="w-5 h-5 rotate-180" />
                  </button>

                  <button
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-white flex items-center justify-center rounded-full hover:bg-black hover:text-white transition-colors duration-300"
                    onClick={() => setCurrentImageIndex(prev => (prev === featuredProducts.length - 1 ? 0 : prev + 1))}
                    aria-label="Next"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Asterion font import */}
      <style jsx global>{`
        @import url('https://fonts.cdnfonts.com/css/asterion');
        .font-\\[\\'Asterion\\',sans-serif\\] {
          font-family: 'Asterion', sans-serif !important;
        }
      `}</style>
    </div>
  );
};

export default Hero;