import { useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
}

export const usePerformanceMonitor = (componentName: string, enabled = process.env.NODE_ENV === 'development') => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
  });

  const renderTimesRef = useRef<number[]>([]);
  const mountTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!enabled) return;

    const now = Date.now();
    const renderTime = now - mountTimeRef.current;
    renderTimesRef.current.push(renderTime);

    const averageRenderTime = renderTimesRef.current.reduce((a, b) => a + b, 0) / renderTimesRef.current.length;

    setMetrics(prev => ({
      loadTime: prev.loadTime || (now - mountTimeRef.current),
      renderCount: prev.renderCount + 1,
      lastRenderTime: renderTime,
      averageRenderTime,
    }));

    if (renderTimesRef.current.length > 10) {
      renderTimesRef.current = renderTimesRef.current.slice(-10);
    }

    console.log(`🔄 ${componentName} Performance:`, {
      renders: metrics.renderCount + 1,
      avgRenderTime: `${averageRenderTime.toFixed(2)}ms`,
      lastRenderTime: `${renderTime}ms`,
    });
  });

  // Performance warnings
  useEffect(() => {
    if (!enabled) return;

    if (metrics.renderCount > 5) {
      console.warn(`⚠️ ${componentName} has rendered ${metrics.renderCount} times. Consider memoization.`);
    }

    if (metrics.averageRenderTime > 16) {
      console.warn(`⚠️ ${componentName} average render time (${metrics.averageRenderTime.toFixed(2)}ms) exceeds 16ms frame budget.`);
    }
  }, [metrics, componentName, enabled]);

  return metrics;
};
