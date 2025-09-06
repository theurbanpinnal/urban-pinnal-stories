import { useState, useEffect, useCallback } from 'react';

interface PerceivedPerformanceOptions {
  enableOptimisticUpdates?: boolean;
  enableBackgroundPrefetch?: boolean;
  prefetchDelay?: number;
}

export const usePerceivedPerformance = <T>(
  data: T[],
  loading: boolean,
  options: PerceivedPerformanceOptions = {}
) => {
  const {
    enableOptimisticUpdates = true,
    enableBackgroundPrefetch = true,
    prefetchDelay = 1000,
  } = options;

  // Optimistic updates state
  const [previousData, setPreviousData] = useState<T[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionStartTime, setTransitionStartTime] = useState<number>(0);

  // Track loading states for perceived performance
  useEffect(() => {
    if (enableOptimisticUpdates) {
      if (loading && data.length > 0) {
        setPreviousData(data);
        setIsTransitioning(true);
        setTransitionStartTime(Date.now());
      } else if (!loading) {
        setIsTransitioning(false);
        setTransitionStartTime(0);
      }
    }
  }, [loading, data, enableOptimisticUpdates]);

  // Use previous data for optimistic updates during transitions
  const displayData = isTransitioning && previousData.length > 0
    ? previousData
    : data;

  // Background prefetching callback
  const prefetchCallback = useCallback((callback: () => void) => {
    if (enableBackgroundPrefetch && data.length > 0) {
      const timeoutId = setTimeout(callback, prefetchDelay);
      return () => clearTimeout(timeoutId);
    }
  }, [enableBackgroundPrefetch, data.length, prefetchDelay]);

  // Calculate transition progress (for advanced animations)
  const transitionProgress = isTransitioning
    ? Math.min((Date.now() - transitionStartTime) / 300, 1)
    : 0;

  return {
    displayData,
    isTransitioning,
    transitionProgress,
    prefetchCallback,
    previousData,
  };
};
