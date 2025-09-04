import { useState, useRef, useEffect, useCallback, memo } from 'react';
import PropTypes from 'prop-types';

// Image cache to prevent duplicate requests
const imageCache = new Map();
const loadingImages = new Map();

// Optimized image preloader with caching
const preloadImage = (src) => {
  if (imageCache.has(src)) {
    return Promise.resolve();
  }
  
  if (loadingImages.has(src)) {
    return loadingImages.get(src);
  }

  const promise = new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      imageCache.set(src, true);
      loadingImages.delete(src);
      resolve();
    };
    img.onerror = () => {
      loadingImages.delete(src);
      reject();
    };
    img.src = src;
  });
  
  loadingImages.set(src, promise);
  return promise;
};

// Optimized Intersection Observer singleton
class IntersectionObserverManager {
  constructor() {
    this.observers = new Map();
    this.callbacks = new WeakMap();
  }

  observe(element, callback, options = {}) {
    const key = JSON.stringify(options);
    
    if (!this.observers.has(key)) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const callback = this.callbacks.get(entry.target);
          if (callback) {
            callback(entry);
          }
        });
      }, {
        threshold: 0.01,
        rootMargin: '50px', // Reduced from 100px for faster loading
        ...options
      });
      this.observers.set(key, observer);
    }

    const observer = this.observers.get(key);
    this.callbacks.set(element, callback);
    observer.observe(element);

    return () => {
      this.callbacks.delete(element);
      observer.unobserve(element);
    };
  }
}

const observerManager = new IntersectionObserverManager();

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
  preload = false,
  priority = false,
  ...props
}) => {
  const [imageState, setImageState] = useState(() => ({
    loaded: imageCache.has(src),
    error: false,
    inView: priority || loading === 'eager' // Load immediately if priority or eager
  }));
  
  const imgRef = useRef();
  const mountedRef = useRef(true);

  // Memoized handlers to prevent unnecessary re-renders
  const handleLoad = useCallback((e) => {
    if (!mountedRef.current) return;
    imageCache.set(src, true);
    setImageState(prev => ({ ...prev, loaded: true }));
    onLoad?.(e);
  }, [src, onLoad]);

  const handleError = useCallback((e) => {
    if (!mountedRef.current) return;
    setImageState(prev => ({ ...prev, error: true }));
    onError?.(e);
  }, [onError]);

  const handleIntersection = useCallback((entry) => {
    if (entry.isIntersecting && !imageState.inView) {
      setImageState(prev => ({ ...prev, inView: true }));
    }
  }, [imageState.inView]);

  // Preload critical images immediately
  useEffect(() => {
    if ((preload || priority) && src && !imageCache.has(src)) {
      preloadImage(src).catch(() => {
        // Silently handle preload errors
      });
    }
  }, [preload, priority, src]);

  // Setup intersection observer only if needed
  useEffect(() => {
    if (priority || loading === 'eager' || imageState.inView) {
      return;
    }

    if (!imgRef.current) return;

    const cleanup = observerManager.observe(imgRef.current, handleIntersection);
    return cleanup;
  }, [handleIntersection, priority, loading, imageState.inView]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Determine if we should show the image
  const shouldShowImage = imageState.inView || priority || loading === 'eager';
  const showPlaceholder = !imageState.loaded && !imageState.error;

  return (
    <div 
      ref={imgRef} 
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {/* Optimized placeholder with reduced animation */}
      {showPlaceholder && (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
          style={{ width, height }}
        >
          <div className="w-6 h-6 text-gray-400">
            <svg fill="none" viewBox="0 0 24 24" className="w-full h-full opacity-50">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
              <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
              <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
        </div>
      )}
      
      {/* Actual image - render immediately if in cache or priority */}
      {shouldShowImage && (
        <img
          src={imageState.error ? placeholder : src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : loading}
          decoding="async" 
          className={`transition-opacity duration-200 ${
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
  preload: PropTypes.bool,
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