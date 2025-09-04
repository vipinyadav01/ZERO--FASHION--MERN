import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

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
  ...props
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [inView, setInView] = useState(false);
  const imgRef = useRef();

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
        threshold: 0.1,
        rootMargin: '50px'
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
          className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center"
          style={{ width, height }}
        >
          <div className="w-8 h-8 text-gray-400">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
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
};

export default LazyImage;

// Optimized Product Image Component
export const ProductImage = ({ 
  src, 
  alt, 
  productName,
  className = '',
  ...props 
}) => {
  const optimizedAlt = alt || `${productName} - Premium fashion item at Zero Fashion`;
  
  return (
    <LazyImage
      src={src}
      alt={optimizedAlt}
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
      loading="eager" // Hero images should load immediately
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
