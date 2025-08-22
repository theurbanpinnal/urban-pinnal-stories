import { ContactFormData } from './validations';

// Environment configuration for form submissions
export const FORM_ENDPOINTS = {
  // Primary: Spam-free Form (unlimited free usage)
  SPAM_FREE_FORM: import.meta.env.VITE_SPAM_FREE_FORM_ENDPOINT || '',
};

// Rate limiting to prevent spam
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX_ATTEMPTS = 3;

function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  const attempts = rateLimitMap.get(identifier) || 0;
  
  if (attempts >= RATE_LIMIT_MAX_ATTEMPTS) {
    return true;
  }
  
  rateLimitMap.set(identifier, attempts + 1);
  
  // Clean up old entries
  setTimeout(() => {
    rateLimitMap.delete(identifier);
  }, RATE_LIMIT_WINDOW);
  
  return false;
}

// Spam-free Form submission function (Primary)
export async function submitToSpamFreeForm(data: ContactFormData): Promise<{
  success: boolean;
  message: string;
}> {
  if (!FORM_ENDPOINTS.SPAM_FREE_FORM) {
    throw new Error('Spam-free Form endpoint not configured');
  }

  // Rate limiting check
  const identifier = `${data.email}-${Date.now().toString().slice(0, -4)}`;
  if (isRateLimited(identifier)) {
    return {
      success: false,
      message: 'Too many attempts. Please wait a minute before trying again.',
    };
  }

  // Check honeypot field for spam protection
  if (data._honeypot) {
    return {
      success: false,
      message: 'Spam detected. Submission blocked.',
    };
  }

  try {
    // Use FormData for Spam-free Form (they expect form data, not JSON)
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('subject', data.subject);
    formData.append('message', data.message);

    const response = await fetch(FORM_ENDPOINTS.SPAM_FREE_FORM, {
      method: 'POST',
      body: formData, // Send as FormData, not JSON
    });

    if (response.ok) {
      return {
        success: true,
        message: 'Message sent successfully! We\'ll get back to you soon.',
      };
    } else {
      // If CORS or other error, fall back to custom API
      throw new Error('Spam-free Form not available');
    }
  } catch (error) {
    console.error('Spam-free Form submission error:', error);
    // Don't return error here, let it fall back to custom API
    throw error;
  }
}





// Custom API submission function (fallback)
export async function submitToCustomAPI(data: ContactFormData): Promise<{
  success: boolean;
  message: string;
}> {
  // Check if we're in development mode
  const isDevelopment = import.meta.env.DEV;
  
  if (isDevelopment) {
    // In development mode, just log the submission and simulate success
    console.log('📧 DEVELOPMENT MODE - Contact form submission:', {
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      timestamp: new Date().toISOString(),
    });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: 'Message sent successfully! (Development mode - check console for details)',
    };
  }

  // Production mode - use Vercel API
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const result = await response.json();

    return {
      success: true,
      message: result.message || 'Message sent successfully! We\'ll get back to you soon.',
    };
  } catch (error) {
    console.error('Custom API submission error:', error);
    return {
      success: false,
      message: 'Network error. Please check your connection and try again.',
    };
  }
}
