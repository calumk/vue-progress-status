<template>
  <div class="app">
    <div class="container">
      <h1>@calumk/vue-progress-status</h1>
      <p class="tagline">A customizable status notification system for Vue 3</p>
      
      <div class="button-group">
        <button @click="showInfo" class="btn btn-info">Show Info</button>
        <button @click="showSuccess" class="btn btn-success">Show Success</button>
        <button @click="showWarning" class="btn btn-warning">Show Warning</button>
        <button @click="showError" class="btn btn-error">Show Error</button>
        <button @click="showUpdateMessage" class="btn btn-info">Show Updating Message</button>
        <button @click="showLongMessage" class="btn btn-info">Show Long Message</button>
        <button @click="toggleDebug" class="btn" :class="{ 'btn-debug-on': debugEnabled, 'btn-debug-off': !debugEnabled }">
          {{ debugEnabled ? 'Debug: ON' : 'Debug: OFF' }}
        </button>
      </div>

      <div class="example-section">
        <h2>Using the Service</h2>
        <p>The following buttons use the progressStatusService from another component:</p>
        <ServiceExample />
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
      
      <div class="links-section">
        <h2>Links</h2>
        <div class="links-grid">
          <a href="https://github.com/calumk/vue-progress-status" class="link-button github">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
            GitHub
          </a>
          <a href="https://www.npmjs.com/package/@calumk/vue-progress-status" class="link-button npm">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M0 0v24h24V0H0zm19.2 19.2H4.8V4.8h14.4v14.4z"/><path d="M15.6 4.8H8.4v10.8h7.2V4.8zM12 12H9.6V8.4H12V12z"/></svg>
            NPM
          </a>
          <a href="http://calumk.com" class="link-button website">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            Website
          </a>
          <a href="https://twitter.com/calumk" class="link-button twitter">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
            Twitter
          </a>
          <a href="https://ko-fi.com/calumk" class="link-button kofi">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.7-.091-3.71.951-1.01 3.005-1.086 4.363.407 0 0 1.565-1.782 3.468-.963 1.904.82 1.832 3.011.723 4.311zm6.173.478c-.928.116-1.682.028-1.682.028V7.284h1.77s1.971.551 1.971 2.638c0 1.913-.985 2.667-2.059 3.015z"/></svg>
            Buy me a coffee
          </a>
        </div>
      </div>
      
      <footer class="footer">
        <p>© {{ new Date().getFullYear() }} Calum Knott | MIT License</p>
      </footer>
    </div>
    
    <ProgressStatus ref="statusRef" :debug="debugEnabled" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ProgressStatus from '../src/components/ProgressStatus.vue'
import { progressStatusService } from '../src/progressStatusService'
import ServiceExample from './ServiceExample.vue'

// Debug mode toggle
const debugEnabled = ref(false)
const statusRef = ref(null)

function toggleDebug() {
  debugEnabled.value = !debugEnabled.value
  progressStatusService.setDebug(debugEnabled.value)
  
  // Show a notification about the debug mode
  statusRef.value.push({
    title: debugEnabled.value ? 'Debug Mode Enabled' : 'Debug Mode Disabled',
    text: debugEnabled.value 
      ? 'Check the browser console to see detailed logs'
      : 'Console logging has been disabled',
    mode: 'info',
    timeout: 5000
  })
}

function showInfo() {
  statusRef.value.push({
    title: 'Information',
    text: 'This is an informational message',
    severity: 'info',
    timeout: 10000,
    cancellable: true
  })
}

function showSuccess() {
  statusRef.value.push({
    title: 'Success',
    text: 'Operation completed successfully',
    severity: 'success',
    timeout: 10000,
    cancellable: true
  })
}

function showWarning() {
  statusRef.value.push({
    title: 'Warning',
    text: 'This action may have consequences',
    severity: 'warning',
    timeout: 10000,
    cancellable: true
  })
}

function showError() {
  statusRef.value.push({
    title: 'Error',
    text: 'An error has occurred',
    severity: 'error',
    timeout: 10000,
    cancellable: true
  })
}

function showLongMessage() {
  statusRef.value.push({
    title: 'Long Message Example',
    text: 'This is a very long message that will expand when hovered.\nIt contains multiple lines of text to demonstrate the expansion feature.\nEach line will be visible when the message is expanded.\nThe progress bar will stay at the bottom while the text expands upward.',
    severity: 'info',
    timeout: 10000,
    cancellable: true
  })
}

// Example of using the update method
function showUpdateMessage() {
  let messageId = statusRef.value.push({
    title: 'Processing',
    text: 'Step 1: Starting process...',
    severity: 'info',
    timeout: 15000,
    cancellable: true
  })
  
  // Update the message after 2 seconds
  setTimeout(() => {
    statusRef.value.update(messageId, {
      text: 'Step 2: Processing data...',
    })
  }, 2000)
  
  // Update the message after 4 seconds
  setTimeout(() => {
    statusRef.value.update(messageId, {
      text: 'Step 3: Finalizing...',
    })
  }, 4000)
  
  // Complete the process after 6 seconds
  setTimeout(() => {
    statusRef.value.update(messageId, {
      title: 'Complete',
      text: 'Process completed successfully!',
      severity: 'success',
      timeout: 5000
    })
  }, 6000)
}

// Show a welcome message
onMounted(() => {
  setTimeout(() => {
    statusRef.value.push({
      title: 'Welcome',
      text: 'Welcome to the @calumk/vue-progress-status demo! Hover over messages to pause and see full content.',
      severity: 'info',
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
  margin-bottom: 10px;
}

.tagline {
  text-align: center;
  margin-top: 0;
  margin-bottom: 30px;
  color: #666;
}

h2 {
  margin-top: 30px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.example-section {
  margin-top: 40px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 6px;
  margin-bottom: 30px;
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

.btn-debug-on {
  background-color: #722ed1;
}

.btn-debug-off {
  background-color: #d3adf7;
  color: #333;
}

.docs {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 30px;
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

.links-section {
  background: #f0f8ff;
  padding: 20px;
  border-radius: 4px;
  margin-top: 40px;
  margin-bottom: 30px;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
  margin-top: 20px;
}

.link-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px;
  border-radius: 8px;
  text-decoration: none;
  color: white;
  font-weight: bold;
  transition: all 0.2s ease;
  text-align: center;
  gap: 10px;
}

.link-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.github {
  background: #24292e;
}

.npm {
  background: #cb3837;
}

.website {
  background: #2c3e50;
}

.twitter {
  background: #1da1f2;
}

.kofi {
  background: #ff5e5b;
}

.footer {
  margin-top: 50px;
  padding: 20px 0;
  text-align: center;
  border-top: 1px solid #eee;
  color: #666;
  font-size: 14px;
}
</style> 