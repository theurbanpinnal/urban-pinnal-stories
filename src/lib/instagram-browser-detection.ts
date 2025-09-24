/**
 * Instagram Browser Detection Utility
 * Detects if the user is accessing the site through Instagram's in-app browser
 * which has limited JavaScript capabilities and touch event handling
 */

export function isInstagramBrowser(): boolean {
  if (typeof window === 'undefined') return false;
  
  const userAgent = window.navigator.userAgent.toLowerCase();
  
  // Instagram in-app browser detection patterns
  const instagramPatterns = [
    'instagram',           // Direct Instagram app
    'fbav',               // Facebook app (Instagram uses similar engine)
    'fban',               // Facebook app
    'fbsv',               // Facebook app
    'fbios',              // Facebook iOS app
    'fbandroid',          // Facebook Android app
  ];
  
  // Check for Instagram-specific user agent strings
  const isInstagramUA = instagramPatterns.some(pattern => 
    userAgent.includes(pattern)
  );
  
  // Additional check for Instagram's webview characteristics
  const isInstagramWebView = 
    userAgent.includes('mobile') && 
    !userAgent.includes('safari') && 
    !userAgent.includes('chrome') && 
    !userAgent.includes('firefox') &&
    userAgent.includes('applewebkit');
  
  return isInstagramUA || isInstagramWebView;
}

export function isInAppBrowser(): boolean {
  if (typeof window === 'undefined') return false;
  
  const userAgent = window.navigator.userAgent.toLowerCase();
  
  // Common in-app browser patterns
  const inAppPatterns = [
    'instagram',
    'fbav', 'fban', 'fbsv', 'fbios', 'fbandroid',
    'twitter', 'tweetdeck',
    'linkedin',
    'whatsapp',
    'telegram',
    'messenger',
    'snapchat',
    'pinterest',
    'tiktok',
    'wechat',
    'line',
    'kakaotalk',
    'viber',
    'skype'
  ];
  
  return inAppPatterns.some(pattern => userAgent.includes(pattern));
}

export function getBrowserCapabilities() {
  const isInstagram = isInstagramBrowser();
  const isInApp = isInAppBrowser();
  
  return {
    isInstagram,
    isInApp,
    supportsAdvancedTouch: !isInstagram && !isInApp,
    supportsComplexAnimations: !isInstagram,
    supportsFileUpload: !isInstagram && !isInApp,
    supportsAdvancedCSS: !isInstagram,
    recommendedAction: isInstagram ? 'open-in-browser' : 'continue'
  };
}

export function showInstagramBrowserWarning(): void {
  if (typeof window === 'undefined') return;
  
  const capabilities = getBrowserCapabilities();
  
  if (capabilities.isInstagram) {
    // Create a subtle notification for Instagram users
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 12px 16px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        color: #333;
        max-width: 90%;
        text-align: center;
      ">
        <div style="margin-bottom: 8px; font-weight: 600;">For the best experience</div>
        <div style="margin-bottom: 8px;">Tap the menu (⋯) and select "Open in Browser"</div>
        <button onclick="this.parentElement.parentElement.remove()" style="
          background: #007bff;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
        ">Got it</button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 10000);
  }
}
