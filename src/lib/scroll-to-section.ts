/**
 * Scroll to Section Utility
 * Provides reliable scroll-to-section functionality with fallbacks
 */

export interface ScrollToSectionOptions {
  behavior?: ScrollBehavior;
  block?: ScrollLogicalPosition;
  inline?: ScrollLogicalPosition;
  offset?: number;
  timeout?: number;
}

const DEFAULT_OPTIONS: Required<ScrollToSectionOptions> = {
  behavior: 'smooth',
  block: 'start',
  inline: 'nearest',
  offset: 0,
  timeout: 100
};

/**
 * Scroll to a specific section by ID with reliable fallbacks
 */
export function scrollToSection(
  sectionId: string, 
  options: ScrollToSectionOptions = {}
): Promise<boolean> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  return new Promise((resolve) => {
    const element = document.getElementById(sectionId);
    
    if (!element) {
      console.warn(`Section with ID "${sectionId}" not found`);
      resolve(false);
      return;
    }

    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      try {
        // Calculate target position with offset
        const elementRect = element.getBoundingClientRect();
        const targetPosition = window.pageYOffset + elementRect.top - opts.offset;
        
        // Try native scrollIntoView first
        element.scrollIntoView({
          behavior: opts.behavior,
          block: 'start', // Always start at the beginning of the section
          inline: opts.inline
        });
        
        // If offset is specified, adjust position
        if (opts.offset > 0) {
          setTimeout(() => {
            window.scrollTo({
              top: targetPosition,
              behavior: opts.behavior
            });
          }, 50);
        }
        
        resolve(true);
      } catch (error) {
        console.warn('scrollIntoView failed, trying alternative method:', error);
        
        // Fallback: manual scroll
        try {
          const elementRect = element.getBoundingClientRect();
          const targetPosition = window.pageYOffset + elementRect.top - opts.offset;
          
          window.scrollTo({
            top: targetPosition,
            behavior: opts.behavior
          });
          
          resolve(true);
        } catch (fallbackError) {
          console.error('All scroll methods failed:', fallbackError);
          resolve(false);
        }
      }
    }, opts.timeout);
  });
}

/**
 * Scroll to section with retry mechanism
 */
export async function scrollToSectionWithRetry(
  sectionId: string,
  options: ScrollToSectionOptions = {},
  maxRetries: number = 3
): Promise<boolean> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const success = await scrollToSection(sectionId, {
      ...options,
      timeout: options.timeout || (attempt * 100) // Increase timeout with each retry
    });
    
    if (success) {
      return true;
    }
    
    if (attempt < maxRetries) {
      console.log(`Scroll attempt ${attempt} failed, retrying...`);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
  
  console.error(`Failed to scroll to section "${sectionId}" after ${maxRetries} attempts`);
  return false;
}

/**
 * Check if a section exists and is visible
 */
export function isSectionVisible(sectionId: string): boolean {
  const element = document.getElementById(sectionId);
  if (!element) return false;
  
  const rect = element.getBoundingClientRect();
  return rect.top >= 0 && rect.bottom <= window.innerHeight;
}

/**
 * Get section position information
 */
export function getSectionPosition(sectionId: string): {
  exists: boolean;
  top: number;
  bottom: number;
  visible: boolean;
} | null {
  const element = document.getElementById(sectionId);
  if (!element) return null;
  
  const rect = element.getBoundingClientRect();
  return {
    exists: true,
    top: rect.top + window.pageYOffset,
    bottom: rect.bottom + window.pageYOffset,
    visible: rect.top >= 0 && rect.bottom <= window.innerHeight
  };
}

/**
 * React hook for scroll to section functionality
 */
export function useScrollToSection() {
  const scrollToSectionRef = React.useCallback(
    (sectionId: string, options?: ScrollToSectionOptions) => {
      return scrollToSectionWithRetry(sectionId, options);
    },
    []
  );
  
  const scrollToElementRef = React.useCallback(
    (element: HTMLElement, options?: ScrollToSectionOptions) => {
      if (!element) return Promise.resolve(false);
      
      const elementRect = element.getBoundingClientRect();
      const targetPosition = window.pageYOffset + elementRect.top - (options?.offset || 0);
      
      return new Promise<boolean>((resolve) => {
        try {
          window.scrollTo({
            top: targetPosition,
            behavior: options?.behavior || 'smooth'
          });
          resolve(true);
        } catch (error) {
          console.error('Scroll to element failed:', error);
          resolve(false);
        }
      });
    },
    []
  );
  
  return {
    scrollToSection: scrollToSectionRef,
    scrollToElement: scrollToElementRef,
    isSectionVisible,
    getSectionPosition
  };
}

// Import React for the hook
import React from 'react';
