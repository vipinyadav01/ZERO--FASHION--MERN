import { useState, useEffect, useCallback } from 'react';
import { useLazyLoading } from '../hooks/useLazyLoading';

/**
 * LazyImage Component
 * 
 * A performant image component with lazy loading using Intersection Observer API.
 * Features:
 * - Lazy loading with intersection observer
 * - Loading states with smooth transitions
 * - Error handling with fallback placeholder
 * - Support for both 'lazy' and 'eager' loading modes
 * 
 * @param {string} src - Image source URL
 * @param {string} alt - Alt text for accessibility
 * @param {string} className - CSS classes
 * @param {string} placeholder - Fallback image URL
 * @param {string} loading - 'lazy' or 'eager'
 * @param {function} onLoad - Callback when image loads
 * @param {function} onError - Callback when image fails
 */
const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = '/placeholder.svg',
  loading = 'lazy',
  onLoad,
  onError,
  ...props 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Use the lazy loading hook
  const { elementRef, isInView } = useLazyLoading({
    rootMargin: '50px',
    threshold: 0.1,
    triggerOnce: true
  });

  // Reset states when src changes
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [src]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(false);
    onError?.();
  }, [onError]);

  const imageSrc = imageError ? placeholder : src;
  const shouldShowImage = isInView || loading === 'eager';

  return (
    <div ref={elementRef} className={`relative ${className}`}>
      {/* Loading placeholder */}
      {shouldShowImage && !imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        </div>
      )}

      {/* Error placeholder */}
      {imageError && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <div className="text-gray-500 text-center">
            <div className="w-8 h-8 mx-auto mb-1 bg-gray-300 rounded" />
            <p className="text-xs">Image unavailable</p>
          </div>
        </div>
      )}

      {/* Actual image */}
      {shouldShowImage && (
        <img
          src={imageSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          {...props}
        />
      )}
    </div>
  );
};

export default LazyImage;