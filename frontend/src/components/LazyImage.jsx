import { useState, useRef, useEffect, memo } from 'react';
import PropTypes from 'prop-types';

const LazyImage = memo(({
  src,
  alt,
  className = '',
  width,
  height,
  placeholder = '/placeholder.svg',
  loading = 'lazy',
  onLoad,
  onError,
  priority = false,
  ...props
}) => {
  const [imageState, setImageState] = useState({
    loaded: false,
    error: false,
    inView: priority || loading === 'eager'
  });
  
  const imgRef = useRef();

  const handleLoad = (e) => {
    setImageState(prev => ({ ...prev, loaded: true }));
    onLoad?.(e);
  };

  const handleError = (e) => {
    setImageState(prev => ({ ...prev, error: true }));
    onError?.(e);
  };

  // Simple intersection observer for lazy loading
  useEffect(() => {
    if (priority || loading === 'eager' || imageState.inView) {
      return;
    }

    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageState(prev => ({ ...prev, inView: true }));
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    observer.observe(imgRef.current);

    return () => {
      observer.disconnect();
    };
  }, [priority, loading, imageState.inView]);

  const shouldShowImage = imageState.inView || priority || loading === 'eager';
  const showPlaceholder = !imageState.loaded && !imageState.error && shouldShowImage;

  return (
    <div 
      ref={imgRef} 
      className={`relative ${className}`}
      style={{ width, height }}
    >
      {/* Loading placeholder */}
      {showPlaceholder && (
        <div 
          className="absolute inset-0 bg-gray-100 flex items-center justify-center"
          style={{ width, height }}
        >
          <div className="w-6 h-6 text-gray-400 animate-spin">
            <svg fill="none" viewBox="0 0 24 24" className="w-full h-full opacity-50">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="31.416" strokeDashoffset="31.416">
                <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
              </circle>
            </svg>
          </div>
        </div>
      )}
      
      {/* Actual image */}
      {shouldShowImage && (
        <img
          src={imageState.error ? placeholder : src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : loading}
          decoding="async" 
          className={`transition-opacity duration-300 ${
            imageState.loaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      )}
    </div>
  );
});

LazyImage.displayName = 'LazyImage';

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
  priority: PropTypes.bool,
};

export default LazyImage;

// Optimized Product Image Component
export const ProductImage = memo(({ 
  src, 
  alt, 
  productName,
  className = '',
  priority = false,
  ...props 
}) => {
  const optimizedAlt = alt || `${productName} - Premium fashion item`;
  
  return (
    <LazyImage
      src={src}
      alt={optimizedAlt}
      loading={priority ? 'eager' : 'lazy'}
      priority={priority}
      className={`object-cover hover:scale-105 transition-transform duration-300 ${className}`}
      {...props}
    />
  );
});

ProductImage.displayName = 'ProductImage';

ProductImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  productName: PropTypes.string,
  className: PropTypes.string,
  priority: PropTypes.bool,
};

// Optimized Hero Image Component
export const HeroImage = memo(({
  src,
  alt = "Premium Fashion Collection",
  className = '',
  ...props
}) => {
  return (
    <LazyImage
      src={src}
      alt={alt}
      loading="eager" 
      priority={true}
      className={`w-full h-full object-cover ${className}`}
      {...props}
    />
  );
});

HeroImage.displayName = 'HeroImage';

HeroImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  className: PropTypes.string,
};