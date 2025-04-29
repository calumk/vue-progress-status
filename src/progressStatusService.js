import { ref } from 'vue'

// Create a reactive reference to store the component instance
const progressStatusRef = ref(null)

// Service methods
export const progressStatusService = {
  // Set the component instance (called by the component itself)
  setInstance(instance) {
    progressStatusRef.value = instance
  },
  
  // Methods that match the component's API
  push(options) {
    if (!progressStatusRef.value) {
      console.warn('ProgressStatus component is not registered. Make sure it is mounted in your app.')
      return -1
    }
    return progressStatusRef.value.push(options)
  },
  
  updateMessage(id, options) {
    if (!progressStatusRef.value) {
      console.warn('ProgressStatus component is not registered. Make sure it is mounted in your app.')
      return
    }
    progressStatusRef.value.updateMessage(id, options)
  },
  
  cancelMessage(id) {
    if (!progressStatusRef.value) {
      console.warn('ProgressStatus component is not registered. Make sure it is mounted in your app.')
      return
    }
    progressStatusRef.value.cancelMessage(id)
  }
} 