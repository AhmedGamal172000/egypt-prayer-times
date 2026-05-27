/**
 * Abstract base class for all extension features.
 * Features can hook into the prayer time engine via dependency injection.
 * @abstract
 */
export class BaseFeature {
  /**
   * @param {string} name - Unique feature name
   * @param {Object} dependencies - Injected dependencies (store, engine, config, etc.)
   */
  constructor(name, dependencies = {}) {
    if (new.target === BaseFeature) {
      throw new TypeError('Cannot instantiate abstract BaseFeature directly');
    }
    this.name = name;
    this.dependencies = dependencies;
    this.isEnabled = false;
  }

  /**
   * Initialize the feature. Called by the extension core.
   * @abstract
   * @returns {Promise<void>}
   */
  async init() {
    throw new Error(`Feature "${this.name}" must implement init()`);
  }

  /**
   * Enable the feature.
   * @abstract
   * @returns {void}
   */
  enable() {
    throw new Error(`Feature "${this.name}" must implement enable()`);
  }

  /**
   * Disable the feature.
   * @abstract
   * @returns {void}
   */
  disable() {
    throw new Error(`Feature "${this.name}" must implement disable()`);
  }

  /**
   * Clean up resources when the feature is destroyed.
   * @returns {void}
   */
  destroy() {
    this.disable();
    this.dependencies = null;
  }
}
