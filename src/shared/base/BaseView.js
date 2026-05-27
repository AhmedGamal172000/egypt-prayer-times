/**
 * Abstract base class for UI views (popup, extended view, dashboard, etc.).
 * @abstract
 */
export class BaseView {
  /**
   * @param {string} name
   * @param {HTMLElement} container
   */
  constructor(name, container) {
    if (new.target === BaseView) {
      throw new TypeError('Cannot instantiate abstract BaseView directly');
    }
    this.name = name;
    this.container = container;
    this.isVisible = false;
  }

  /**
   * Render the view.
   * @abstract
   * @returns {void}
   */
  render() {
    throw new Error(`View "${this.name}" must implement render()`);
  }

  /**
   * Update the view with new data.
   * @abstract
   * @param {Object} data
   * @returns {void}
   */
  update(_data) {
    throw new Error(`View "${this.name}" must implement update()`);
  }

  /**
   * Show the view.
   * @returns {void}
   */
  show() {
    this.isVisible = true;
    this.container.style.display = '';
  }

  /**
   * Hide the view.
   * @returns {void}
   */
  hide() {
    this.isVisible = false;
    this.container.style.display = 'none';
  }

  /**
   * Destroy the view and clean up.
   * @returns {void}
   */
  destroy() {
    this.hide();
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}
