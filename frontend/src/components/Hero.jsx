import { useState, useEffect, useCallback, useRef } from "react";
import { ArrowRight, ArrowLeft, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const slides = [
  {
    id: 1,
    image: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1200&dpr=2",
    mobileImage: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=2",
    badge: "New Collection",
    title: "Winter",
    titleAccent: "Fashion 2025",
    subtitle: "Exclusive styles crafted for those who lead, not follow.",
    cta: "Shop Now",
    ctaLink: "/collection",
    tag: "Up to 50% Off",
  },
  {
    id: 2,
    image: "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1200&dpr=2",
    mobileImage: "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=2",
    badge: "Trending Now",
    title: "Premium",
    titleAccent: "Essentials",
    subtitle: "Timeless pieces curated for every occasion and every mood.",
    cta: "Explore",
    ctaLink: "/collection",
    tag: "Free Shipping ₹499+",
  },
  {
    id: 3,
    image: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1200&dpr=2",
    mobileImage: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=2",
    badge: "Limited Edition",
    title: "Exclusive",
    titleAccent: "Designs",
    subtitle: "A signature collection for those who wear their identity.",
    cta: "View All",
    ctaLink: "/collection",
    tag: "Members Save 20%",
  },
];

const INTERVAL = 6000;

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const go = useCallback((index) => {
    if (transitioning) return;
    setTransitioning(true);
    setCurrent(index);
    setTimeout(() => setTransitioning(false), 600);
  }, [transitioning]);

  const next = useCallback(() => {
    go(current === slides.length - 1 ? 0 : current + 1);
  }, [current, go]);

  const prev = useCallback(() => {
    go(current === 0 ? slides.length - 1 : current - 1);
  }, [current, go]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, INTERVAL);
    return () => clearInterval(t);
  }, [paused, next]);

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchMove  = (e) => { touchEndX.current  = e.touches[0].clientX; };
  const handleTouchEnd   = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
  };

  const slide = slides[current];

  return (
    <section
      className="relative w-full overflow-hidden bg-black"
      style={{ height: "calc(100vh - 64px)" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background slides */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={s.image}
            alt={s.title}
            className="hidden sm:block w-full h-full object-cover object-center"
            loading={i === 0 ? "eager" : "lazy"}
          />
          <img
            src={s.mobileImage}
            alt={s.title}
            className="sm:hidden w-full h-full object-cover object-top"
            loading={i === 0 ? "eager" : "lazy"}
          />
        </div>
      ))}

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-8 sm:py-10">

        {/* Top: badge */}
        <div className="flex-shrink-0 pt-2">
          <span
            className={`inline-block border border-white/30 px-4 py-1.5 text-[9px] font-black text-white uppercase tracking-[0.25em] transition-all duration-500 ${
              transitioning ? "opacity-0 -translate-x-4" : "opacity-100 translate-x-0"
            }`}
          >
            {slide.badge}
          </span>
        </div>

        {/* Center: headline + CTA */}
        <div className="flex-1 flex flex-col justify-center max-w-2xl">

          {/* Offer tag */}
          <div
            className={`mb-4 transition-all duration-500 delay-50 ${
              transitioning ? "opacity-0 -translate-y-2" : "opacity-100 translate-y-0"
            }`}
          >
            <span className="bg-white text-black text-[9px] font-black uppercase tracking-widest px-3 py-1.5">
              {slide.tag}
            </span>
          </div>

          {/* Title */}
          <h1
            className={`transition-all duration-500 delay-100 ${
              transitioning ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0"
            }`}
          >
            <span className="block text-5xl sm:text-6xl lg:text-7xl font-black text-white uppercase leading-none tracking-tight">
              {slide.title}
            </span>
            <span className="block text-5xl sm:text-6xl lg:text-7xl font-black text-white/50 uppercase leading-none tracking-tight">
              {slide.titleAccent}
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className={`mt-5 text-sm sm:text-base text-white/70 max-w-sm leading-relaxed transition-all duration-500 delay-150 ${
              transitioning ? "opacity-0 -translate-y-3" : "opacity-100 translate-y-0"
            }`}
          >
            {slide.subtitle}
          </p>

          {/* CTA */}
          <div
            className={`mt-8 sm:mt-10 transition-all duration-500 delay-200 ${
              transitioning ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0"
            }`}
          >
            <Link
              to={slide.ctaLink}
              className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-[11px] font-black uppercase tracking-widest hover:bg-brand-surface transition-colors active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              {slide.cta}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Bottom: nav controls */}
        <div className="flex-shrink-0 pb-2">
          <div className="flex items-center justify-between">

            {/* Prev/Next + indicators */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={prev}
                  disabled={transitioning}
                  aria-label="Previous"
                  className="w-10 h-10 border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors disabled:opacity-40"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={next}
                  disabled={transitioning}
                  aria-label="Next"
                  className="w-10 h-10 border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors disabled:opacity-40"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Dot indicators */}
              <div className="flex items-center gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => go(i)}
                    aria-label={`Slide ${i + 1}`}
                    className={`h-[2px] transition-all duration-500 ${
                      i === current ? "w-8 bg-white" : "w-3 bg-white/30 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>

              {/* Counter */}
              <span className="hidden sm:block text-[10px] font-black text-white/50 tracking-widest">
                <span className="text-white">{String(current + 1).padStart(2, "0")}</span>
                {" / "}
                {slides.length}
              </span>
            </div>

            {/* Right: quick stats desktop */}
            <div className="hidden lg:flex items-center gap-6">
              {[["2000+", "Products"], ["50+", "Brands"], ["1M+", "Customers"]].map(([num, label]) => (
                <div key={label} className="text-right">
                  <p className="text-sm font-black text-white leading-none">{num}</p>
                  <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
