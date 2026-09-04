/**
 * Sanitize user input to prevent XSS attacks
 * Removes potentially dangerous HTML/scripts
 */
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  // Remove script tags and event handlers
  return input
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/on\w+\s*=\s*[^\s>]*/gi, '')
    .trim();
};

/**
 * Escape HTML special characters
 */
export const escapeHtml = (text: string): string => {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
};
