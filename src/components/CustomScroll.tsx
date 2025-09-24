/**
 * Custom Scroll Component
 * Provides smooth, performant scrolling with momentum and custom styling
 */

import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { useCustomScroll } from '@/hooks/use-custom-scroll';
import { cn } from '@/lib/utils';

interface CustomScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  smooth?: boolean;
  momentum?: boolean;
  momentumDecay?: number;
  maxMomentum?: number;
  threshold?: number;
  enableKeyboard?: boolean;
  enableWheel?: boolean;
  enableTouch?: boolean;
  showScrollbar?: boolean;
  scrollbarStyle?: 'thin' | 'thick' | 'hidden';
  className?: string;
}

export interface CustomScrollRef {
  scrollTo: (position: number, smooth?: boolean) => void;
  scrollBy: (delta: number, smooth?: boolean) => void;
  scrollToElement: (element: HTMLElement, smooth?: boolean) => void;
  resetMomentum: () => void;
  getScrollState: () => {
    isScrolling: boolean;
    scrollDirection: 'up' | 'down' | null;
    scrollPosition: number;
    momentum: number;
  };
}

const CustomScroll = forwardRef<CustomScrollRef, CustomScrollProps>(
  ({
    children,
    smooth = true,
    momentum = true,
    momentumDecay = 0.95,
    maxMomentum = 50,
    threshold = 0.1,
    enableKeyboard = true,
    enableWheel = true,
    enableTouch = true,
    showScrollbar = true,
    scrollbarStyle = 'thin',
    className,
    ...props
  }, ref) => {
    const {
      scrollRef,
      scrollState,
      scrollTo,
      scrollBy,
      scrollToElement,
      resetMomentum,
    } = useCustomScroll({
      smooth,
      momentum,
      momentumDecay,
      maxMomentum,
      threshold,
      enableKeyboard,
      enableWheel,
      enableTouch,
    });

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      scrollTo,
      scrollBy,
      scrollToElement,
      resetMomentum,
      getScrollState: () => scrollState,
    }), [scrollTo, scrollBy, scrollToElement, resetMomentum, scrollState]);

    const scrollbarClasses = {
      thin: 'scrollbar-thin scrollbar-thumb-primary scrollbar-track-transparent',
      thick: 'scrollbar scrollbar-thumb-primary scrollbar-track-transparent',
      hidden: 'scrollbar-none',
    };

    return (
      <div
        ref={scrollRef}
        className={cn(
          'relative overflow-auto',
          showScrollbar ? scrollbarClasses[scrollbarStyle] : scrollbarClasses.hidden,
          // Performance optimizations
          'will-change-scroll',
          'transform-gpu',
          // Smooth scrolling
          smooth && 'scroll-smooth',
          // Custom scrollbar styling
          'custom-scrollbar',
          className
        )}
        style={{
          // Performance optimizations
          contain: 'layout style paint',
          // Smooth scrolling
          scrollBehavior: smooth ? 'smooth' : 'auto',
          // Webkit optimizations
          WebkitOverflowScrolling: 'touch',
          // Overscroll behavior
          overscrollBehavior: 'contain',
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CustomScroll.displayName = 'CustomScroll';

export default CustomScroll;
