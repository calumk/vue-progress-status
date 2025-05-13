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

// Service methods
export const progressStatusService = {
  // Enable or disable debug mode
  setDebug(enabled) {
    debugMode = !!enabled
    log('Debug mode set to:', enabled)
  },

  // Set the component instance (called by the component itself)
  setInstance(instance) {
    progressStatusRef.value = instance
    log('Component instance registered')
  },
  
  // Methods that match the component's API
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
  
  update(id, options) {
    if (!progressStatusRef.value) {
      log('Warning: Component not registered')
      console.warn('ProgressStatus component is not registered. Make sure it is mounted in your app.')
      return
    }
    
    log('Updating message:', { id, options })
    progressStatusRef.value.update(id, options)
  },
  
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