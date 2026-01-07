/**
 * Validates if a string is valid JSON
 * @param {string} str - The string to validate
 * @returns {boolean} - True if valid JSON, false otherwise
 */
export const isValidJSON = (str) => {
  if (!str || str.trim() === '') return true; // Allow empty
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Format error messages for display
 * @param {Error|string} error - The error object or message
 * @returns {string} - Formatted error message
 */
export const formatErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (error.response && error.response.data && error.response.data.error) {
    return error.response.data.error;
  }
  if (error.message) return error.message;
  return 'An unexpected error occurred';
};
