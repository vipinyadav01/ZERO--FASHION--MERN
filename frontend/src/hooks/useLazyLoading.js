import { useState, useEffect, useRef, useCallback } from 'react';

export const useLazyLoading = (options = {}) => {
  const {
    rootMargin = '50px',
    threshold = 0.1,
    triggerOnce = true
  } = options;

  const [isInView, setIsInView] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef(null);
  const observerRef = useRef(null);

  const handleIntersection = useCallback((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        if (triggerOnce) {
          setHasTriggered(true);
          if (observerRef.current) {
            observerRef.current.disconnect();
          }
        }
      } else if (!triggerOnce) {
        setIsInView(false);
      }
    });
  }, [triggerOnce]);

  useEffect(() => {
    if (!elementRef.current || hasTriggered) return;

    observerRef.current = new IntersectionObserver(handleIntersection, {
      rootMargin,
      threshold
    });

    observerRef.current.observe(elementRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersection, rootMargin, threshold, hasTriggered]);

  useEffect(() => {
    setIsInView(false);
    setHasTriggered(false);
  }, [elementRef.current]);

  return {
    elementRef,
    isInView: isInView || hasTriggered
  };
};

export default useLazyLoading;
