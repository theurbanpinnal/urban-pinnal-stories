import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format currency with proper locale-specific formatting
 * @param amount - The amount to format
 * @param currencyCode - The currency code (e.g., 'INR', 'USD', 'EUR')
 * @param locale - The locale to use for formatting (defaults to user's locale or 'en-IN' for INR)
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: string | number,
  currencyCode: string,
  locale?: string
): string {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Auto-detect locale based on currency if not provided
  if (!locale) {
    switch (currencyCode.toUpperCase()) {
      case 'INR':
        locale = 'en-IN'; // Indian locale for proper comma formatting
        break;
      case 'USD':
        locale = 'en-US';
        break;
      case 'EUR':
        locale = 'en-EU';
        break;
      case 'GBP':
        locale = 'en-GB';
        break;
      default:
        // Try to get user's locale, fallback to en-US
        locale = typeof navigator !== 'undefined' ? navigator.language : 'en-US';
    }
  }

  try {
    const formatted = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(numericAmount);
    
    // Add space after currency symbol for better readability
    // Handle different currency symbol positions
    const currencySymbols = ['₹', '$', '€', '£', '¥', '¢', '₩', '₪', '₨', '₦', '₡', '₵'];
    
    for (const symbol of currencySymbols) {
      if (formatted.startsWith(symbol)) {
        return formatted.replace(symbol, `${symbol} `);
      }
    }
    
    // For currencies where symbol comes after the number
    for (const symbol of currencySymbols) {
      if (formatted.endsWith(symbol)) {
        return formatted.replace(symbol, ` ${symbol}`);
      }
    }
    
    return formatted;
  } catch (error) {
    // Fallback for unsupported currencies or locales
    console.warn(`Currency formatting failed for ${currencyCode} in ${locale}:`, error);
    
    // Manual fallback with common currency symbols
    const symbols: Record<string, string> = {
      INR: '₹',
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
      CNY: '¥',
    };
    
    const symbol = symbols[currencyCode.toUpperCase()] || currencyCode;
    const formattedNumber = numericAmount.toLocaleString(locale || 'en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    
    return `${symbol} ${formattedNumber}`;
  }
}

/**
 * Get currency symbol for a given currency code
 * @param currencyCode - The currency code
 * @returns Currency symbol
 */
export function getCurrencySymbol(currencyCode: string): string {
  const symbols: Record<string, string> = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CNY: '¥',
  };
  
  return symbols[currencyCode.toUpperCase()] || currencyCode;
}

/**
 * Capitalize the first letter of every word in a string
 * @param text - The text to capitalize
 * @returns Text with first letter of each word capitalized
 */
export function capitalizeWords(text: string): string {
  if (!text) return text;
  
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Capitalize the first letter of a string
 * @param text - The text to capitalize
 * @returns Text with first letter capitalized
 */
export function capitalizeFirst(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Format text for display with proper capitalization
 * Handles common e-commerce text formatting needs
 * @param text - The text to format
 * @param type - The type of formatting to apply
 * @returns Formatted text
 */
export function formatDisplayText(text: string, type: 'title' | 'option' | 'tag' = 'title'): string {
  if (!text) return text;
  
  switch (type) {
    case 'title':
      return capitalizeWords(text);
    case 'option':
      return capitalizeWords(text);
    case 'tag':
      return capitalizeWords(text);
    default:
      return capitalizeWords(text);
  }
}

/* Example usage:
 * formatCurrency('1199.00', 'INR') → '₹ 1,199'
 * formatCurrency('1199.50', 'INR') → '₹ 1,199.50'
 * formatCurrency('24.99', 'USD') → '$ 24.99'
 * formatCurrency('100000', 'INR', 'en-IN') → '₹ 1,00,000' (Indian numbering system)
 * formatCurrency('100000', 'INR', 'en-US') → '₹ 100,000' (International numbering)
 */
