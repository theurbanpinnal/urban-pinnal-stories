import React, { useEffect, useState, memo } from 'react';

interface PerformanceMonitorProps {
  componentName: string;
  enabled?: boolean;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = memo(({ 
  componentName, 
  enabled = process.env.NODE_ENV === 'development' 
}) => {
  const [renderCount, setRenderCount] = useState(0);
  const [lastRenderTime, setLastRenderTime] = useState<number>(0);

  useEffect(() => {
    if (!enabled) return;
    
    setRenderCount(prev => prev + 1);
    setLastRenderTime(Date.now());
  });

  useEffect(() => {
    if (!enabled) return;
    
    console.log(`🔄 ${componentName} rendered ${renderCount} times`);
  }, [componentName, renderCount, enabled]);

  if (!enabled) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white text-xs p-2 rounded z-50">
      <div>{componentName}</div>
      <div>Renders: {renderCount}</div>
      <div>Last: {lastRenderTime ? new Date(lastRenderTime).toLocaleTimeString() : 'N/A'}</div>
    </div>
  );
});

PerformanceMonitor.displayName = 'PerformanceMonitor';

export default PerformanceMonitor;
