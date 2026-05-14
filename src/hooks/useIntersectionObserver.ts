'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

interface UseIntersectionOptions {
  threshold?: number;
  rootMargin?: string;
  onEnter?: () => void;
  onLeave?: () => void;
}

export function useIntersectionObserver(opts: UseIntersectionOptions = {}) {
  const { threshold = 0.5, rootMargin = '0px', onEnter, onLeave } = opts;
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const vis = entry.isIntersecting;
        setIsVisible(vis);
        if (vis) onEnter?.();
        else onLeave?.();
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, onEnter, onLeave]);

  return { ref, isVisible };
}
