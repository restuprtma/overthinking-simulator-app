/**
 * App Constants
 * General application-wide constants
 */

export const APP_CONFIG = {
  APP_NAME: 'Lakukan',
  APP_VERSION: '1.0.0',
  APP_DESCRIPTION: 'Lakukan - Your Hub for Everything',

  // API Configuration
  API_TIMEOUT: 10000,

  // UI Configuration
  DIALOG_TRANSITION_DELAY: 300, // ms - delay for dialog state reset after close animation

  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],

  // Date formats
  DATE_FORMAT: 'DD-MM-YYYY',
  DATETIME_FORMAT: 'DD-MM-YYYY HH:mm:ss',
  TIME_FORMAT: 'HH:mm:ss',

  // Locale
  DEFAULT_LOCALE: 'id-ID' as const,
  LOCALE_DATE_OPTIONS: {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  } as const,

  // Storage keys
  STORAGE_KEYS: {
    TOKEN: 'token',
    USER: 'user',
    THEME: 'theme',
    LANGUAGE: 'language',
  },
} as const;
