/**
 * Abstract Store wrapping chrome.storage with get/set/subscribe.
 */
export class Store {
  constructor(namespace = 'egyptPrayerTimes') {
    this.namespace = namespace;
    this.listeners = new Map();
    this._setupChangeListener();
  }

  /**
   * Get a value from storage.
   * @param {string} key
   * @param {*} defaultValue
   * @returns {Promise<*>>}
   */
  async get(key, defaultValue = null) {
    const fullKey = `${this.namespace}:${key}`;
    const result = await chrome.storage.local.get(fullKey);
    return result[fullKey] !== undefined ? result[fullKey] : defaultValue;
  }

  /**
   * Set a value in storage.
   * @param {string} key
   * @param {*} value
   * @returns {Promise<void>}
   */
  async set(key, value) {
    const fullKey = `${this.namespace}:${key}`;
    await chrome.storage.local.set({ [fullKey]: value });
    this._notify(key, value);
  }

  /**
   * Remove a key.
   * @param {string} key
   * @returns {Promise<void>}
   */
  async remove(key) {
    const fullKey = `${this.namespace}:${key}`;
    await chrome.storage.local.remove(fullKey);
    this._notify(key, undefined);
  }

  /**
   * Get multiple keys at once.
   * @param {string[]} keys
   * @returns {Promise<Object>}
   */
  async getMany(keys) {
    const fullKeys = keys.map(k => `${this.namespace}:${k}`);
    const result = await chrome.storage.local.get(fullKeys);
    const out = {};
    for (const k of keys) {
      out[k] = result[`${this.namespace}:${k}`];
    }
    return out;
  }

  /**
   * Set multiple key-value pairs.
   * @param {Object} entries
   * @returns {Promise<void>}
   */
  async setMany(entries) {
    const prefixed = {};
    for (const [key, value] of Object.entries(entries)) {
      prefixed[`${this.namespace}:${key}`] = value;
    }
    await chrome.storage.local.set(prefixed);
    for (const [key, value] of Object.entries(entries)) {
      this._notify(key, value);
    }
  }

  /**
   * Subscribe to changes for a specific key.
   * @param {string} key
   * @param {Function} callback
   * @returns {Function} Unsubscribe function
   */
  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key).add(callback);
    return () => this.listeners.get(key).delete(callback);
  }

  /**
   * Notify listeners of a key change.
   * @param {string} key
   * @param {*} value
   */
  _notify(key, value) {
    const cbs = this.listeners.get(key);
    if (cbs) {
      for (const cb of cbs) {
        try { cb(value); } catch (e) { /* ignore listener errors */ }
      }
    }
  }

  /**
   * Listen to chrome.storage.onChanged for cross-context updates.
   */
  _setupChangeListener() {
    if (typeof chrome !== 'undefined' && chrome.storage?.onChanged) {
      chrome.storage.onChanged.addListener((changes, area) => {
        if (area !== 'local') {return;}
        for (const [fullKey, change] of Object.entries(changes)) {
          if (fullKey.startsWith(`${this.namespace}:`)) {
            const key = fullKey.slice(this.namespace.length + 1);
            this._notify(key, change.newValue);
          }
        }
      });
    }
  }
}

/** Singleton store instance */
export const store = new Store();
