/**
 * Custom Scroll Hook with Performance Optimizations
 * Provides smooth scrolling with momentum and performance optimizations
 */

import { useCallback, useEffect, useRef, useState } from 'react';

interface ScrollOptions {
  smooth?: boolean;
  momentum?: boolean;
  momentumDecay?: number;
  maxMomentum?: number;
  threshold?: number;
  enableKeyboard?: boolean;
  enableWheel?: boolean;
  enableTouch?: boolean;
}

interface ScrollState {
  isScrolling: boolean;
  scrollDirection: 'up' | 'down' | null;
  scrollPosition: number;
  momentum: number;
}

interface CustomScrollReturn {
  scrollRef: React.RefObject<HTMLDivElement>;
  scrollState: ScrollState;
  scrollTo: (position: number, smooth?: boolean) => void;
  scrollBy: (delta: number, smooth?: boolean) => void;
  scrollToElement: (element: HTMLElement, smooth?: boolean) => void;
  resetMomentum: () => void;
}

const DEFAULT_OPTIONS: Required<ScrollOptions> = {
  smooth: true,
  momentum: true,
  momentumDecay: 0.95,
  maxMomentum: 50,
  threshold: 0.1,
  enableKeyboard: true,
  enableWheel: true,
  enableTouch: true,
};

export function useCustomScroll(options: ScrollOptions = {}): CustomScrollReturn {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const lastScrollTimeRef = useRef<number>(0);
  const lastScrollPositionRef = useRef<number>(0);
  const momentumRef = useRef<number>(0);
  const isScrollingRef = useRef<boolean>(false);
  
  const [scrollState, setScrollState] = useState<ScrollState>({
    isScrolling: false,
    scrollDirection: null,
    scrollPosition: 0,
    momentum: 0,
  });

  // Performance-optimized scroll update
  const updateScrollState = useCallback(() => {
    if (!scrollRef.current) return;
    
    const currentPosition = scrollRef.current.scrollTop;
    const currentTime = performance.now();
    const deltaTime = currentTime - lastScrollTimeRef.current;
    const deltaPosition = currentPosition - lastScrollPositionRef.current;
    
    // Calculate momentum
    if (deltaTime > 0 && Math.abs(deltaPosition) > opts.threshold) {
      const velocity = deltaPosition / deltaTime;
      momentumRef.current = Math.max(
        -opts.maxMomentum,
        Math.min(opts.maxMomentum, velocity * 100)
      );
    }
    
    // Determine scroll direction
    const direction = deltaPosition > 0 ? 'down' : deltaPosition < 0 ? 'up' : null;
    
    setScrollState(prev => ({
      ...prev,
      scrollPosition: currentPosition,
      scrollDirection: direction,
      momentum: momentumRef.current,
    }));
    
    lastScrollTimeRef.current = currentTime;
    lastScrollPositionRef.current = currentPosition;
  }, [opts.threshold, opts.maxMomentum]);

  // Smooth scroll animation with momentum
  const animateScroll = useCallback(() => {
    if (!scrollRef.current || !opts.momentum) return;
    
    if (Math.abs(momentumRef.current) < 0.1) {
      isScrollingRef.current = false;
      setScrollState(prev => ({ ...prev, isScrolling: false }));
      return;
    }
    
    const currentPosition = scrollRef.current.scrollTop;
    const newPosition = currentPosition + momentumRef.current;
    
    scrollRef.current.scrollTop = newPosition;
    momentumRef.current *= opts.momentumDecay;
    
    animationFrameRef.current = requestAnimationFrame(animateScroll);
  }, [opts.momentum, opts.momentumDecay]);

  // Throttled scroll handler
  const handleScroll = useCallback(() => {
    if (!isScrollingRef.current) {
      isScrollingRef.current = true;
      setScrollState(prev => ({ ...prev, isScrolling: true }));
    }
    
    updateScrollState();
    
    // Start momentum animation if enabled
    if (opts.momentum && animationFrameRef.current === undefined) {
      animationFrameRef.current = requestAnimationFrame(animateScroll);
    }
  }, [updateScrollState, animateScroll, opts.momentum]);

  // Scroll to specific position
  const scrollTo = useCallback((position: number, smooth: boolean = opts.smooth) => {
    if (!scrollRef.current) return;
    
    resetMomentum();
    
    if (smooth) {
      scrollRef.current.scrollTo({
        top: position,
        behavior: 'smooth'
      });
    } else {
      scrollRef.current.scrollTop = position;
    }
  }, [opts.smooth]);

  // Scroll by delta amount
  const scrollBy = useCallback((delta: number, smooth: boolean = opts.smooth) => {
    if (!scrollRef.current) return;
    
    const currentPosition = scrollRef.current.scrollTop;
    scrollTo(currentPosition + delta, smooth);
  }, [scrollTo]);

  // Scroll to specific element
  const scrollToElement = useCallback((element: HTMLElement, smooth: boolean = opts.smooth) => {
    if (!scrollRef.current) return;
    
    const containerRect = scrollRef.current.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    const scrollTop = scrollRef.current.scrollTop;
    
    const targetPosition = scrollTop + elementRect.top - containerRect.top;
    scrollTo(targetPosition, smooth);
  }, [scrollTo]);

  // Reset momentum
  const resetMomentum = useCallback(() => {
    momentumRef.current = 0;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }
  }, []);

  // Wheel event handler with momentum
  const handleWheel = useCallback((e: WheelEvent) => {
    if (!opts.enableWheel || !scrollRef.current) return;
    
    e.preventDefault();
    
    const delta = e.deltaY;
    const currentPosition = scrollRef.current.scrollTop;
    const maxScroll = scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
    
    // Add momentum
    momentumRef.current = Math.max(
      -opts.maxMomentum,
      Math.min(opts.maxMomentum, momentumRef.current + delta * 0.5)
    );
    
    // Apply scroll with momentum
    const newPosition = Math.max(0, Math.min(maxScroll, currentPosition + momentumRef.current));
    scrollRef.current.scrollTop = newPosition;
    
    // Start momentum animation
    if (!isScrollingRef.current) {
      isScrollingRef.current = true;
      setScrollState(prev => ({ ...prev, isScrolling: true }));
      animationFrameRef.current = requestAnimationFrame(animateScroll);
    }
  }, [opts.enableWheel, opts.maxMomentum, animateScroll]);

  // Touch event handlers
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!opts.enableTouch) return;
    resetMomentum();
  }, [opts.enableTouch, resetMomentum]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!opts.enableTouch) return;
    e.preventDefault();
  }, [opts.enableTouch]);

  // Keyboard event handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!opts.enableKeyboard || !scrollRef.current) return;
    
    const scrollAmount = 50; // pixels per key press
    
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        scrollBy(-scrollAmount);
        break;
      case 'ArrowDown':
        e.preventDefault();
        scrollBy(scrollAmount);
        break;
      case 'PageUp':
        e.preventDefault();
        scrollBy(-scrollRef.current.clientHeight * 0.8);
        break;
      case 'PageDown':
        e.preventDefault();
        scrollBy(scrollRef.current.clientHeight * 0.8);
        break;
      case 'Home':
        e.preventDefault();
        scrollTo(0);
        break;
      case 'End':
        e.preventDefault();
        scrollTo(scrollRef.current.scrollHeight);
        break;
    }
  }, [opts.enableKeyboard, scrollBy, scrollTo]);

  // Setup event listeners
  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    // Add event listeners
    element.addEventListener('scroll', handleScroll, { passive: true });
    element.addEventListener('wheel', handleWheel, { passive: false });
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('keydown', handleKeyDown, { passive: false });

    // Make element focusable for keyboard events
    element.setAttribute('tabindex', '0');
    element.style.outline = 'none';

    return () => {
      element.removeEventListener('scroll', handleScroll);
      element.removeEventListener('wheel', handleWheel);
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('keydown', handleKeyDown);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleScroll, handleWheel, handleTouchStart, handleTouchMove, handleKeyDown]);

  return {
    scrollRef,
    scrollState,
    scrollTo,
    scrollBy,
    scrollToElement,
    resetMomentum,
  };
}
