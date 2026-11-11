import { STORAGE_KEYS } from './storageKeys';
import { storageService } from './storageService';

export const bookmarkService = {
  /**
   * Get all bookmarked event IDs.
   */
  getBookmarkedIds() {
    return storageService.get(STORAGE_KEYS.BOOKMARKS, []);
  },

  /**
   * Check if a specific event is bookmarked.
   */
  isBookmarked(eventId) {
    const list = this.getBookmarkedIds();
    return list.includes(eventId);
  },

  /**
   * Toggle bookmark for an event. Returns true if now bookmarked, false if removed.
   */
  toggleBookmark(eventId) {
    const list = this.getBookmarkedIds();
    const index = list.indexOf(eventId);
    let isNowBookmarked = false;

    if (index > -1) {
      list.splice(index, 1);
      isNowBookmarked = false;
    } else {
      list.push(eventId);
      isNowBookmarked = true;
    }

    storageService.set(STORAGE_KEYS.BOOKMARKS, list);
    return isNowBookmarked;
  },

  /**
   * Remove a bookmark directly.
   */
  removeBookmark(eventId) {
    const list = this.getBookmarkedIds().filter((id) => id !== eventId);
    storageService.set(STORAGE_KEYS.BOOKMARKS, list);
    return true;
  },
};
