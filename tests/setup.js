/**
 * Jest setup: mock Chrome extension APIs used in tests.
 */

// Mock chrome.storage.local
global.chrome = {
  storage: {
    local: {
      data: {},
      get(keys) {
        return new Promise((resolve) => {
          if (typeof keys === 'string') {
            resolve({ [keys]: this.data[keys] });
          } else if (Array.isArray(keys)) {
            const result = {};
            for (const k of keys) {
              result[k] = this.data[k];
            }
            resolve(result);
          } else {
            resolve({ ...this.data });
          }
        });
      },
      set(entries) {
        return new Promise((resolve) => {
          Object.assign(this.data, entries);
          resolve();
        });
      },
      remove(keys) {
        return new Promise((resolve) => {
          if (typeof keys === 'string') {
            delete this.data[keys];
          } else if (Array.isArray(keys)) {
            for (const k of keys) delete this.data[k];
          }
          resolve();
        });
      },
      clear() {
        return new Promise((resolve) => {
          this.data = {};
          resolve();
        });
      }
    },
    onChanged: {
      addListener() {}
    }
  },
  runtime: {
    sendMessage() { return Promise.resolve({}); },
    onMessage: { addListener() {} }
  },
  i18n: {
    getMessage(key) { return key; }
  },
  alarms: {
    create() { return Promise.resolve(); },
    getAll() { return Promise.resolve([]); },
    clear() { return Promise.resolve(); },
    onAlarm: { addListener() {} }
  },
  notifications: {
    create() { return Promise.resolve(); }
  },
  action: {
    setBadgeText() { return Promise.resolve(); },
    setBadgeBackgroundColor() { return Promise.resolve(); }
  }
};

// Reset storage before each test
beforeEach(() => {
  chrome.storage.local.data = {};
});
