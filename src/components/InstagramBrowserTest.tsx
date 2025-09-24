/**
 * Instagram Browser Test Component
 * This component can be temporarily added to test Instagram browser compatibility
 * Remove this file after testing is complete
 */

import React from 'react';
import { getBrowserCapabilities } from '@/lib/instagram-browser-detection';

const InstagramBrowserTest: React.FC = () => {
  const capabilities = getBrowserCapabilities();

  if (!capabilities.isInstagram && !capabilities.isInApp) {
    return null; // Don't show test component for regular browsers
  }

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: '#fff',
      border: '2px solid #007bff',
      borderRadius: '8px',
      padding: '12px',
      fontSize: '12px',
      fontFamily: 'monospace',
      zIndex: 10000,
      maxWidth: '200px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
        Browser Test
      </div>
      <div>Instagram: {capabilities.isInstagram ? '✅' : '❌'}</div>
      <div>In-App: {capabilities.isInApp ? '✅' : '❌'}</div>
      <div>Touch Support: {capabilities.supportsAdvancedTouch ? '✅' : '❌'}</div>
      <div>Animations: {capabilities.supportsComplexAnimations ? '✅' : '❌'}</div>
      <div style={{ marginTop: '8px', fontSize: '10px', color: '#666' }}>
        Action: {capabilities.recommendedAction}
      </div>
    </div>
  );
};

export default InstagramBrowserTest;
