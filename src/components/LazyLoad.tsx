"use client"

import React, { useEffect, useState, ReactNode } from 'react';

interface LazyLoadProps {
  children: ReactNode;
  threshold?: number;
  rootMargin?: string;
  placeholder?: ReactNode;
}

export default function LazyLoad({
  children,
  threshold = 0.1,
  rootMargin = '100px',
  placeholder = <div className="h-64 w-full animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md" />
}: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [element, setElement] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [element, threshold, rootMargin]);

  return (
    <div ref={setElement}>
      {isVisible ? children : placeholder}
    </div>
  );
}