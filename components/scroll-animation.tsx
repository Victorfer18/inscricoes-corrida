"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

interface ScrollAnimationProps {
  children: ReactNode;
  animation?: "fadeIn" | "slideUp" | "slideLeft" | "slideRight" | "scaleIn" | "rotateIn";
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
}

export function ScrollAnimation({
  children,
  animation = "fadeIn",
  delay = 0,
  duration = 600,
  threshold = 0.1,
  className = ""
}: ScrollAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [delay, threshold]);

  const getAnimationClasses = () => {
    const baseClasses = `transition-all ease-out`;
    const durationClass = `duration-${duration}`;
    
    if (!isVisible) {
      switch (animation) {
        case "fadeIn":
          return `${baseClasses} ${durationClass} opacity-0`;
        case "slideUp":
          return `${baseClasses} ${durationClass} opacity-0 translate-y-8`;
        case "slideLeft":
          return `${baseClasses} ${durationClass} opacity-0 translate-x-8`;
        case "slideRight":
          return `${baseClasses} ${durationClass} opacity-0 -translate-x-8`;
        case "scaleIn":
          return `${baseClasses} ${durationClass} opacity-0 scale-95`;
        case "rotateIn":
          return `${baseClasses} ${durationClass} opacity-0 rotate-3 scale-95`;
        default:
          return `${baseClasses} ${durationClass} opacity-0`;
      }
    }

    return `${baseClasses} ${durationClass} opacity-100 translate-x-0 translate-y-0 scale-100 rotate-0`;
  };

  return (
    <div
      ref={elementRef}
      className={`${getAnimationClasses()} ${className}`}
    >
      {children}
    </div>
  );
}
