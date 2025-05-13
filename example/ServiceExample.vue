<template>
  <div class="service-example">
    <div class="button-group">
      <button @click="showServiceMessage" class="btn btn-success">
        Notification from Service
      </button>
      <button @click="showUpdateExample" class="btn btn-info">
        Updatable Service Message
      </button>
    </div>
  </div>
</template>

<script setup>
import { progressStatusService } from '../src/progressStatusService'

// Example of using the progressStatusService from a component
// that doesn't have direct access to the ProgressStatus component
function showServiceMessage() {
  // Using the service methods directly
  const messageId = progressStatusService.push({
    title: 'Service Message',
    text: 'This message was triggered from a separate component using the progressStatusService!',
    severity: 'success',
    timeout: 8000,
    cancellable: true
  })
}

// Example of using the update method with the service
function showUpdateExample() {
  // Using the message object methods
  const message = progressStatusService.push({
    title: 'Service Processing',
    text: 'Step 1: Starting process via service...',
    severity: 'info',
    timeout: 15000,
    cancellable: true
  })
  
  // Update the message after 2 seconds
  setTimeout(() => {
    message.update({
      text: 'Step 2: Processing data via service...',
    })
  }, 2000)
  
  // Update the message after 4 seconds
  setTimeout(() => {
    message.update({
      text: 'Step 3: Finalizing via service...',
    })
  }, 4000)
  
  // Complete the process after 6 seconds
  setTimeout(() => {
    message.update({
      title: 'Service Complete',
      text: 'Process completed successfully via service!',
      severity: 'success',
      timeout: 5000
    })
  }, 6000)
}
</script>

<style scoped>
.service-example {
  margin-top: 10px;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: white;
  font-weight: bold;
  transition: background-color 0.2s;
}

.btn:hover {
  opacity: 0.9;
}

.btn-success {
  background-color: #52c41a;
}

.btn-info {
  background-color: #1890ff;
}
</style> 