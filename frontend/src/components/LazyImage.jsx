import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

// Preload critical images
const preloadImage = (src) => {
  const img = new Image();
  img.src = src;
  return new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
  });
};

const LazyImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  placeholder = '/placeholder.svg',
  loading = 'lazy',
  onLoad,
  onError,
  preload = false,
  ...props
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [inView, setInView] = useState(false);
  const imgRef = useRef();

  // Preload image if requested
  useEffect(() => {
    if (preload && src) {
      preloadImage(src).catch(() => {
        // Silently handle preload errors
      });
    }
  }, [preload, src]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.01, 
        rootMargin: '100px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = (e) => {
    setImageLoaded(true);
    onLoad?.(e);
  };

  const handleError = (e) => {
    setImageError(true);
    onError?.(e);
  };

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {/* Placeholder/Loading state */}
      {!imageLoaded && !imageError && (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse flex items-center justify-center"
          style={{ width, height }}
        >
          <div className="w-6 h-6 text-gray-400 animate-spin">
            <svg fill="none" viewBox="0 0 24 24" className="w-full h-full">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
              <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"/>
            </svg>
          </div>
        </div>
      )}
      
      {/* Actual image */}
      {inView && (
        <img
          src={imageError ? placeholder : src}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          className={`transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      )}
    </div>
  );
};

LazyImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholder: PropTypes.string,
  loading: PropTypes.oneOf(['lazy', 'eager']),
  onLoad: PropTypes.func,
  onError: PropTypes.func,
  preload: PropTypes.bool,
};

export default LazyImage;

// Optimized Product Image Component
export const ProductImage = ({ 
  src, 
  alt, 
  productName,
  className = '',
  priority = false,
  ...props 
}) => {
  const optimizedAlt = alt || `${productName} - Premium fashion item at Zero Fashion`;
  
  return (
    <LazyImage
      src={src}
      alt={optimizedAlt}
      loading={priority ? 'eager' : 'lazy'}
      preload={priority}
      className={`object-cover hover:scale-105 transition-transform duration-300 ${className}`}
      {...props}
    />
  );
};

ProductImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  productName: PropTypes.string,
  className: PropTypes.string,
  priority: PropTypes.bool,
};

// Hero Image Component
export const HeroImage = ({
  src,
  alt = "Zero Fashion - Premium Fashion Collection",
  className = '',
  ...props
}) => {
  return (
    <LazyImage
      src={src}
      alt={alt}
      loading="eager" 
      className={`w-full h-full object-cover ${className}`}
      {...props}
    />
  );
};

HeroImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  className: PropTypes.string,
};
