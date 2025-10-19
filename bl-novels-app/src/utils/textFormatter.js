/**
 * Text formatting utilities for the BL Novels App
 */

/**
 * Capitalize the first letter of each word
 * Preserves special cases like acronyms and codes
 * @param {string} text - The text to capitalize
 * @returns {string} - The capitalized text
 */
export const capitalizeFirstLetter = (text) => {
  if (!text || typeof text !== 'string') return text;

  // Check if text is all uppercase (likely an acronym or code like "15P7H6SM")
  if (text === text.toUpperCase() && text.length > 1) {
    return text; // Keep as is
  }

  // Check if text contains numbers and letters mixed (like "15P7H6SM")
  if (/\d[A-Z]|[A-Z]\d/.test(text)) {
    return text; // Keep as is
  }

  // Capitalize first letter of each word
  return text
    .split(' ')
    .map(word => {
      if (word.length === 0) return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
};

/**
 * Capitalize first letter only (for titles and names)
 * @param {string} text - The text to capitalize
 * @returns {string} - The text with first letter capitalized
 */
export const capitalizeFirstLetterOnly = (text) => {
  if (!text || typeof text !== 'string') return text;

  // Check if text is all uppercase (likely an acronym or code)
  if (text === text.toUpperCase() && text.length > 1) {
    return text; // Keep as is
  }

  // Check if text contains numbers and letters mixed
  if (/\d[A-Z]|[A-Z]\d/.test(text)) {
    return text; // Keep as is
  }

  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Format genre name - capitalize first letter
 * @param {string} genre - The genre name
 * @returns {string} - The formatted genre
 */
export const formatGenre = (genre) => {
  return capitalizeFirstLetterOnly(genre);
};

/**
 * Format author name - capitalize first letter of each word
 * @param {string} author - The author name
 * @returns {string} - The formatted author name
 */
export const formatAuthor = (author) => {
  return capitalizeFirstLetter(author);
};

/**
 * Format story title - capitalize first letter of each word
 * Preserves special cases like codes
 * @param {string} title - The story title
 * @returns {string} - The formatted title
 */
export const formatTitle = (title) => {
  return capitalizeFirstLetter(title);
};

/**
 * Format tag - capitalize first letter
 * @param {string} tag - The tag name
 * @returns {string} - The formatted tag
 */
export const formatTag = (tag) => {
  return capitalizeFirstLetterOnly(tag);
};

/**
 * Format context/background - capitalize first letter only
 * @param {string} context - The context text
 * @returns {string} - The formatted context
 */
export const formatContext = (context) => {
  if (!context || typeof context !== 'string') return context;
  return context.charAt(0).toUpperCase() + context.slice(1);
};

/**
 * Format summary - capitalize first letter only
 * @param {string} summary - The summary text
 * @returns {string} - The formatted summary
 */
export const formatSummary = (summary) => {
  if (!summary || typeof summary !== 'string') return summary;
  return summary.charAt(0).toUpperCase() + summary.slice(1);
};

