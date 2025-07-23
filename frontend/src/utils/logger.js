// Simple logger utility for SuperMall

const logger = {
  info: (...args) => {
    console.info('[INFO]', ...args);
  },
  warn: (...args) => {
    console.warn('[WARN]', ...args);
  },
  error: (...args) => {
    console.error('[ERROR]', ...args);
  },
  debug: (...args) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug('[DEBUG]', ...args);
    }
  },
};

export default logger; 