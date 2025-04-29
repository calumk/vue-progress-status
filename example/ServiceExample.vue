<template>
  <div class="service-example">
    <div class="button-group">
      <button @click="showServiceMessage" class="btn btn-success">
        Notification from Service
      </button>
      <button @click="showUpdateExample" class="btn btn-info">
        Updatable Message
      </button>
    </div>
  </div>
</template>

<script setup>
import { progressStatusService } from '../src/progressStatusService'

// Example of using the progressStatusService from a component
// that doesn't have direct access to the ProgressStatus component
function showServiceMessage() {
  progressStatusService.push({
    title: 'Service Message',
    text: 'This message was triggered from a separate component using the progressStatusService!',
    mode: 'success',
    timeout: 8000,
    cancellable: true
  })
}

// Example of using the updateMessage method
function showUpdateExample() {
  const messageId = progressStatusService.push({
    title: 'Processing',
    text: 'Step 1: Starting process...',
    mode: 'info',
    timeout: 15000,
    cancellable: true
  })
  
  // Update the message after 2 seconds
  setTimeout(() => {
    progressStatusService.updateMessage(messageId, {
      text: 'Step 2: Processing data...',
    })
  }, 2000)
  
  // Update the message after 4 seconds
  setTimeout(() => {
    progressStatusService.updateMessage(messageId, {
      text: 'Step 3: Finalizing...',
    })
  }, 4000)
  
  // Complete the process after 6 seconds
  setTimeout(() => {
    progressStatusService.updateMessage(messageId, {
      title: 'Complete',
      text: 'Process completed successfully!',
      mode: 'success',
      timeout: 5000
    })
  }, 6000)
}
</script>

<style scoped>
.service-example {
  margin-top: 10px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: white;
  font-weight: bold;
  transition: background-color 0.2s;
  margin-right: 10px;
}

.btn-success {
  background-color: #52c41a;
}

.btn-info {
  background-color: #1890ff;
}
</style> 