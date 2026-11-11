/**
 * Safe LocalStorage abstraction with JSON serialization and fault tolerance.
 */

export const storageService = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      if (item === null || item === undefined) {
        return defaultValue;
      }
      return JSON.parse(item);
    } catch (error) {
      console.warn(`[storageService] Error parsing item for key "${key}":`, error);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error(`[storageService] Failed to set item for key "${key}":`, error);
      // QuotaExceededError handling
      if (error.name === 'QuotaExceededError' || error.code === 22) {
        alert('Browser local storage limit reached. Please clear some saved items.');
      }
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`[storageService] Failed to remove key "${key}":`, error);
      return false;
    }
  },

  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('[storageService] Failed to clear storage:', error);
      return false;
    }
  },
};
