/**
 * Abstract base class for API providers.
 * @abstract
 */
export class BaseAPIProvider {
  constructor() {
    if (new.target === BaseAPIProvider) {
      throw new TypeError('Cannot instantiate abstract BaseAPIProvider directly');
    }
  }

  /**
   * Check if the provider is available (network up, etc.).
   * @abstract
   * @returns {Promise<boolean>}
   */
  async isAvailable() {
    throw new Error('Provider must implement isAvailable()');
  }

  /**
   * Fetch data from the provider.
   * @abstract
   * @param {Object} params
   * @returns {Promise<Object>}
   */
  async fetch(_params) {
    throw new Error('Provider must implement fetch()');
  }
}
