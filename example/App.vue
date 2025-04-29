<template>
  <div class="app">
    <div class="container">
      <h1>Vue Progress Status Example</h1>
      
      <div class="button-group">
        <button @click="showInfo" class="btn btn-info">Show Info</button>
        <button @click="showSuccess" class="btn btn-success">Show Success</button>
        <button @click="showWarning" class="btn btn-warning">Show Warning</button>
        <button @click="showError" class="btn btn-error">Show Error</button>
        <button @click="showLongMessage" class="btn btn-info">Show Long Message</button>
      </div>
      
      <div class="example-section">
        <h2>Using the Service</h2>
        <p>The following buttons use the progressStatusService from another component:</p>
        <ServiceExample />
      </div>
    </div>
    
    <ProgressStatus />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import ProgressStatus from '../src/components/ProgressStatus.vue'
import { progressStatusService } from '../src/progressStatusService'
import ServiceExample from './ServiceExample.vue'

function showInfo() {
  progressStatusService.push({
    title: 'Information',
    text: 'This is an informational message',
    mode: 'info',
    timeout: 10000,
    cancellable: true
  })
}

function showSuccess() {
  progressStatusService.push({
    title: 'Success',
    text: 'Operation completed successfully',
    mode: 'success',
    timeout: 10000,
    cancellable: true
  })
}

function showWarning() {
  progressStatusService.push({
    title: 'Warning',
    text: 'This action may have consequences',
    mode: 'warning',
    timeout: 10000,
    cancellable: true
  })
}

function showError() {
  progressStatusService.push({
    title: 'Error',
    text: 'An error has occurred',
    mode: 'error',
    timeout: 10000,
    cancellable: true
  })
}

function showLongMessage() {
  progressStatusService.push({
    title: 'Long Message Example',
    text: 'This is a very long message that will expand when hovered.\nIt contains multiple lines of text to demonstrate the expansion feature.\nEach line will be visible when the message is expanded.',
    mode: 'info',
    timeout: 10000,
    cancellable: true
  })
}

// Show a welcome message on mount
onMounted(() => {
  setTimeout(() => {
    progressStatusService.push({
      title: 'Welcome',
      text: 'Hover over messages to pause and see full text',
      mode: 'info',
      timeout: 8000,
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
  margin-bottom: 15px;
}

.example-section {
  margin-top: 40px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 6px;
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
</style> 