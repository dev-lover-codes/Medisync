/**
 * Centralized logger for the application.
 * Replaces scattered console logs and provides a way to easily disable or route logs in production.
 */

const isProd = import.meta.env.PROD;

export const logger = {
  info: (...args) => {
    if (!isProd) {
      console.info('[INFO]', ...args);
    }
  },
  log: (...args) => {
    if (!isProd) {
      console.log('[LOG]', ...args);
    }
  },
  warn: (...args) => {
    console.warn('[WARN]', ...args);
    // In production, you might want to send this to a monitoring service (e.g., Sentry)
  },
  error: (...args) => {
    console.error('[ERROR]', ...args);
    // In production, you might want to send this to a monitoring service (e.g., Sentry)
  }
};

export default logger;
