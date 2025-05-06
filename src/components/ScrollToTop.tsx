"use client"

import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAnalytics } from '@/lib/hooks/useAnalytics';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { trackEvent } = useAnalytics();

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to top smooth
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    trackEvent({
      category: 'UI',
      action: 'Scroll To Top',
      label: 'Button Click'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <>
      {isVisible && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg z-10 transition-all duration-300 ease-in-out scale-100 hover:scale-110"
          aria-label="Scroll to top"
          size="icon"
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
      )}
    </>
  );
}