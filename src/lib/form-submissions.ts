import { ContactFormData } from './validations';

// --- Web3Forms Integration ---------------------------------------------------

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

// NOTE: For security the access key can be stored in .env, but per user request
// we embed it here. Replace at build-time if needed.
const ACCESS_KEY = '585ab3df-4028-42f3-a758-67ea1fd7be46';

export async function submitToWeb3Forms(data: ContactFormData): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    // Honeypot check (spam)
    if (data._honeypot) {
      return { success: false, message: 'Spam detected.' };
    }

    const formData = new FormData();
    formData.append('access_key', ACCESS_KEY);
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('subject', data.subject);
    formData.append('message', data.message);
    // Add an identifier for analytics (optional)
    formData.append('from', 'contact');

    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (response.ok && result.success) {
      return { success: true, message: 'Thank you! Your message has been sent.' };
    }

    return {
      success: false,
      message:
        result.message || 'Unable to send message. Please try again later.',
    };
  } catch (error) {
    console.error('Web3Forms submission error:', error);
    return {
      success: false,
      message: 'Network error. Please check your connection and try again.',
    };
  }
}
