/**
 * Normalizes a date to midnight UTC to ensure consistent date comparison
 * @param {Date|string} date - The date to normalize
 * @returns {string} - ISO string representation of the date at midnight UTC
 */
export const normalizeDate = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
};

/**
 * Compares two dates ignoring time
 * @param {Date|string} date1 
 * @param {Date|string} date2 
 * @returns {boolean}
 */
export const areSameDate = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.toDateString() === d2.toDateString();
};

/**
 * Formats a date for display
 * @param {Date|string} date 
 * @returns {string}
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}; 