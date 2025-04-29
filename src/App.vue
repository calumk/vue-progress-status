<template>
  <div class="app">
    <div class="container">
      <h1>Vue Progress Status Demo</h1>
      
      <div class="button-group">
        <button @click="showInfo" class="btn btn-info">Show Info</button>
        <button @click="showSuccess" class="btn btn-success">Show Success</button>
        <button @click="showWarning" class="btn btn-warning">Show Warning</button>
        <button @click="showError" class="btn btn-error">Show Error</button>
        <button @click="showUpdateMessage" class="btn btn-info">Show Updating Message</button>
        <button @click="showLongMessage" class="btn btn-info">Show Long Message</button>
      </div>

      <div class="docs">
        <h2>Usage</h2>
        <pre><code>import ProgressStatus from '@calumk/vue-progress-status'

// In your component with script setup:
&lt;script setup&gt;
import { ref } from 'vue'
import ProgressStatus from '@calumk/vue-progress-status'

const statusRef = ref(null)

function showNotification() {
  statusRef.value.push({
    title: 'Operation Complete',
    text: 'Your task was completed successfully',
    mode: 'success',   // 'info', 'success', 'warning', 'error'
    timeout: 5000,     // Time in ms before auto-dismiss
    cancellable: true  // Can be closed by user
  })
}
&lt;/script&gt;

&lt;template&gt;
  &lt;ProgressStatus ref="statusRef" /&gt;
  &lt;button @click="showNotification"&gt;Show Notification&lt;/button&gt;
&lt;/template&gt;
</code></pre>
      </div>
    </div>
    
    <ProgressStatus ref="statusRef" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ProgressStatus from './components/ProgressStatus.vue'

const statusRef = ref(null)

function showInfo() {
  statusRef.value.push({
    title: 'Information',
    text: 'This is an informational message',
    mode: 'info',
    timeout: 10000,
    cancellable: true
  })
}

function showSuccess() {
  statusRef.value.push({
    title: 'Success',
    text: 'Operation completed successfully',
    mode: 'success',
    timeout: 10000,
    cancellable: true
  })
}

function showWarning() {
  statusRef.value.push({
    title: 'Warning',
    text: 'This action may have consequences',
    mode: 'warning',
    timeout: 10000,
    cancellable: true
  })
}

function showError() {
  statusRef.value.push({
    title: 'Error',
    text: 'An error has occurred',
    mode: 'error',
    timeout: 10000,
    cancellable: true
  })
}

function showLongMessage() {
  statusRef.value.push({
    title: 'Long Message Example',
    text: 'This is a very long message that will expand when hovered.\nIt contains multiple lines of text to demonstrate the expansion feature.\nEach line will be visible when the message is expanded.\nThe progress bar will stay at the bottom while the text expands upward.',
    mode: 'info',
    timeout: 10000,
    cancellable: true
  })
}


// Example of using the updateMessage method
function showUpdateMessage() {
  let messageId = statusRef.value.push({
    title: 'Processing',
    text: 'Step 1: Starting process...',
    mode: 'info',
    timeout: 15000,
    cancellable: true
  })
  
  // Update the message after 2 seconds
  setTimeout(() => {
    statusRef.value.updateMessage(messageId, {
      text: 'Step 2: Processing data...',
    })
  }, 2000)
  
  // Update the message after 4 seconds
  setTimeout(() => {
    statusRef.value.updateMessage(messageId, {
      text: 'Step 3: Finalizing...',
    })
  }, 4000)
  
  // Complete the process after 6 seconds
  setTimeout(() => {
    statusRef.value.updateMessage(messageId, {
      title: 'Complete',
      text: 'Process completed successfully!',
      mode: 'success',
      timeout: 5000
    })
  }, 6000)
}



// Show a welcome message
onMounted(() => {
  setTimeout(() => {
    statusRef.value.push({
      title: 'Welcome',
      text: 'Welcome to the Demo!',
      mode: 'info',
      timeout: 3000,
      cancellable: true
    })
  }, 500)
})
</script>

<style>
.app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
}

h2 {
  margin-top: 30px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 30px;
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

.btn-info {
  background-color: #1890ff;
}

.btn-success {
  background-color: #52c41a;
}

.btn-warning {
  background-color: #faad14;
}

.btn-error {
  background-color: #ff4d4f;
}

.docs {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 4px;
}

pre {
  background: #fff;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
}

code {
  font-family: 'SF Mono', Monaco, Menlo, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 14px;
}
</style> 