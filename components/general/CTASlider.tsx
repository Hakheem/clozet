"use client";

import { useState, useEffect, ReactNode } from "react";

interface MobileSliderProps {
  children: ReactNode[];
}

export default function MobileSlider({ children }: MobileSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // 60-second interval
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % children.length);
    }, 60000);

    return () => clearInterval(timer);
  }, [children.length]);

  return (
    <div className="relative w-full overflow-hidden md:hidden rounded-2xl group shadow-lg">
      <div 
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {children.map((child, index) => (
          <div key={index} className="w-full flex-shrink-0">
            {child}
          </div>
        ))}
      </div>
      
      {/* Interactive dot indicators */}
      {children.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {children.map((_, i) => (
            <button 
              key={i}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex 
                  ? "w-6 bg-[#BFA47A]" 
                  : "w-1.5 bg-[#EDE8DF]/40 hover:bg-[#EDE8DF]/60"
              }`} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

