import { ref } from 'vue'
import { ProgressStatusMessage } from './ProgressStatusMessage'

// Create a reactive reference to store the component instance
const progressStatusRef = ref(null)

// Debug mode
let debugMode = false

// Debug logger function
const log = (message, data) => {
  if (debugMode) {
    console.log(`[ProgressStatusService] ${message}`, data || '')
  }
}

/**
 * @typedef {'info' | 'success' | 'warning' | 'error'} Severity
 */

/**
 * @typedef {Object} MessageOptions
 * @property {string} [title]
 * @property {string} [message]
 * @property {string} [text] - Deprecated, use message instead
 * @property {Severity} [severity]
 * @property {number} [timeout]
 * @property {boolean} [cancellable]
 */

// Service methods
export const progressStatusService = {
  /**
   * Enable or disable debug mode
   * @param {boolean} enabled
   */
  setDebug(enabled) {
    debugMode = !!enabled
    log('Debug mode set to:', enabled)
  },

  /**
   * Set the component instance (called by the component itself)
   * @param {any} instance
   */
  setInstance(instance) {
    progressStatusRef.value = instance
    log('Component instance registered')
  },
  
  /**
   * Show a new notification.
   * @param {MessageOptions} options
   * @returns {ProgressStatusMessage|number} ProgressStatusMessage instance or -1 if not registered
   */
  push(options) {
    if (!progressStatusRef.value) {
      log('Warning: Component not registered')
      console.warn('ProgressStatus component is not registered. Make sure it is mounted in your app.')
      return -1
    }
    
    log('Pushing message:', options)
    const id = progressStatusRef.value.push(options)
    log('Message pushed with id:', id)
    
    // Return a new ProgressStatusMessage instance
    return new ProgressStatusMessage(id, this)
  },
  
  /**
   * Update an existing notification.
   * @param {number} id
   * @param {MessageOptions} options
   */
  update(id, options) {
    if (!progressStatusRef.value) {
      log('Warning: Component not registered')
      console.warn('ProgressStatus component is not registered. Make sure it is mounted in your app.')
      return
    }
    
    log('Updating message:', { id, options })
    progressStatusRef.value.update(id, options)
  },
  
  /**
   * Cancel a notification by ID.
   * @param {number} id
   */
  cancel(id) {
    if (!progressStatusRef.value) {
      log('Warning: Component not registered')
      console.warn('ProgressStatus component is not registered. Make sure it is mounted in your app.')
      return
    }
    
    log('Cancelling message:', id)
    progressStatusRef.value.cancel(id)
  }
} 