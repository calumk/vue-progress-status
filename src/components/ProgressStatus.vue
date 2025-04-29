<template>
  <div>
    <!-- History button (always visible) -->
    <button class="ps-history-button" @click="toggleHistoryModal" title="View notification history">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 8v4l3 3"></path>
        <circle cx="12" cy="12" r="10"></circle>
      </svg>
    </button>
    
    <!-- Background bar -->
    <div class="ps-progress-status-container" :class="{ 'ps-is-visible': hasVisibleMessages }">
      <div class="ps-status-counter" v-if="visibleMessages.length > 0">
        {{ visibleMessages.length }}
      </div>
      <div class="ps-status-messages-wrapper">
        <div class="ps-status-messages-placeholder"></div>
      </div>
    </div>

    <!-- Floating messages -->
    <div class="ps-status-messages-floating" :class="{ 'ps-is-visible': hasVisibleMessages }">
      <div class="ps-status-messages">
        <div
          v-for="message in allMessages"
          :key="message.id"
          class="ps-status-message-wrapper"
          :class="{ 'ps-is-hidden': message.cancelled && !isMessageToRightOfHovered(message) }"
        >
          <div
            v-if="!message.cancelled"
            class="ps-status-message"
            :class="[`ps-${message.mode}`, { 'ps-is-expanded': message.isExpanded }]"
            @mouseenter="handleMouseEnter(message.id)"
            @mouseleave="handleMouseLeave(message.id)"
          >
            <div class="ps-status-content">
              <div class="ps-status-header">
                <span class="ps-status-title">{{ message.title }}</span>
                <button v-if="message.cancellable" class="ps-status-close" @click="cancelMessage(message.id)">×</button>
              </div>
              <div class="ps-status-text">{{ message.text }}</div>
            </div>
            <div class="ps-status-progress" v-if="message.timeout > 0">
              <div 
                class="ps-status-progress-bar" 
                :style="{ width: `${message.progress}%` }"
              ></div>
            </div>
          </div>
          <div v-if="message.isExpanded" class="ps-status-message-placeholder"></div>
        </div>
      </div>
    </div>

    <!-- History Modal -->
    <div v-if="isHistoryModalOpen" class="ps-history-modal-overlay" @click="closeHistoryModal">
      <div class="ps-history-modal" @click.stop>
        <div class="ps-history-modal-header">
          <h3>Notification History</h3>
          <button class="ps-history-modal-close" @click="closeHistoryModal">×</button>
        </div>
        <div class="ps-history-modal-content">
          <div v-if="messageHistory.length === 0" class="ps-history-empty">
            No notifications yet
          </div>
          <div v-else class="ps-history-list">
            <div v-for="entry in messageHistory" :key="entry.id" class="ps-history-entry">
              <!-- Original notification -->
              <div class="ps-history-message" :class="`ps-${entry.original.mode}`">
                <div class="ps-history-message-content">
                  <div class="ps-history-message-header">
                    <span class="ps-history-message-title">{{ entry.original.title }}</span>
                    <span class="ps-history-message-time">{{ formatTime(entry.original.timestamp) }}</span>
                  </div>
                  <div class="ps-history-message-text">{{ entry.original.text }}</div>
                </div>
              </div>
              
              <!-- Updates for this notification -->
              <div v-for="(update, index) in entry.updates" :key="`${entry.id}-${index}`" class="ps-history-update">
                <div class="ps-history-message" :class="`ps-${update.mode}`">
                  <div class="ps-history-message-content">
                    <div class="ps-history-message-header">
                      <span class="ps-history-message-title">{{ update.title }}</span>
                      <span class="ps-history-message-time">{{ formatTime(update.timestamp) }}</span>
                    </div>
                    <div class="ps-history-message-text">{{ update.text }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, getCurrentInstance } from 'vue'
import { progressStatusService } from '../progressStatusService'

// Props
const props = defineProps({
  debug: {
    type: Boolean,
    default: false
  }
})

// Debug logger function
const log = (message, data) => {
  if (props.debug) {
    console.log(`[ProgressStatus] ${message}`, data || '')
  }
}

const messages = ref([])
const messageId = ref(0)
const hoveredMessageId = ref(null)
const messageHistory = ref([])
const isHistoryModalOpen = ref(false)

// Register this component instance with the service on mount
onMounted(() => {
  log('Component mounted')
  progressStatusService.setInstance(getCurrentInstance().exposed)
})

const hasVisibleMessages = computed(() => {
  return visibleMessages.value.length > 0
})

const visibleMessages = computed(() => {
  return messages.value.filter(msg => !msg.cancelled)
})

const allMessages = computed(() => {
  return messages.value
})

function isMessageToRightOfHovered(message) {
  if (!hoveredMessageId.value) return false
  const hoveredIndex = messages.value.findIndex(msg => msg.id === hoveredMessageId.value)
  const messageIndex = messages.value.findIndex(msg => msg.id === message.id)
  return messageIndex > hoveredIndex
}

function handleMouseEnter(id) {
  hoveredMessageId.value = id
  pauseMessage(id)
  expandMessage(id)
}

function handleMouseLeave(id) {
  const previouslyHoveredId = hoveredMessageId.value
  hoveredMessageId.value = null

  // Resume and collapse the specific message
  if (previouslyHoveredId === id) {
    resumeMessage(id)
    collapseMessage(id)
  }
  
  // Clean up any messages that should now be removed
  setTimeout(() => {
    const messagesToRemove = []
    const updatedMessages = messages.value.map(msg => {
      // Condition 1: Already cancelled
      if (msg.cancelled) {
        messagesToRemove.push(msg.id)
        return msg // Keep it temporarily for filtering later
      }
      // Condition 2: Timed out (progress <= 0) but was previously protected
      if (!msg.cancelled && msg.progress <= 0) {
        console.log(`Cleaning up previously protected message: ${msg.id}`)
        messagesToRemove.push(msg.id)
        return { ...msg, cancelled: true } // Mark cancelled before removal
      }
      return msg
    })

    // Update the array once to mark necessary items cancelled
    messages.value = updatedMessages

    // Filter out the messages marked for removal
    if (messagesToRemove.length > 0) {
      messages.value = messages.value.filter(msg => !messagesToRemove.includes(msg.id))
    }
  }, 300) // Delay to allow leave animation
}

function push(options) {
  const id = messageId.value++
  const message = {
    id,
    title: options.title || '',
    text: options.text || '',
    mode: options.mode || 'info',
    timeout: options.timeout ?? 10000,
    cancellable: options.cancellable !== false,
    progress: 100,
    cancelled: false,
    startTime: Date.now(),
    isPaused: false,
    pauseTime: null,
    interval: null,
    isExpanded: false
  }

  messages.value = [...messages.value, message]

  // Add to history with timestamp
  const historyEntry = {
    id,
    original: {
      title: message.title,
      text: message.text,
      mode: message.mode,
      timestamp: Date.now()
    },
    updates: []
  }
  messageHistory.value = [historyEntry, ...messageHistory.value]

  if (message.timeout > 0) {
    startProgressUpdate(message)
  }

  return id
}

function expandMessage(id) {
  const message = messages.value.find(msg => msg.id === id)
  if (message) {
    const index = messages.value.findIndex(msg => msg.id === id)
    if (index !== -1) {
      messages.value = [
        ...messages.value.slice(0, index),
        { ...message, isExpanded: true },
        ...messages.value.slice(index + 1)
      ]
    }
  }
}

function collapseMessage(id) {
  const message = messages.value.find(msg => msg.id === id)
  if (message) {
    const index = messages.value.findIndex(msg => msg.id === id)
    if (index !== -1) {
      messages.value = [
        ...messages.value.slice(0, index),
        { ...message, isExpanded: false },
        ...messages.value.slice(index + 1)
      ]
    }
  }
}

function startProgressUpdate(message) {
  log('Starting progress update for message:', message.id)
  if (message.interval) {
    log('Clearing existing interval:', message.interval)
    clearInterval(message.interval)
  }

  message.interval = setInterval(() => {
    if (message.cancelled || message.isPaused) {
      log('Stopping update - cancelled or paused:', { 
        id: message.id, 
        cancelled: message.cancelled, 
        isPaused: message.isPaused 
      })
      clearInterval(message.interval)
      message.interval = null
      return
    }

    const elapsed = Date.now() - message.startTime
    const progress = Math.max(0, 100 - (elapsed / message.timeout * 100))
    
    log('Progress update:', {
      id: message.id,
      elapsed,
      progress,
      isPaused: message.isPaused
    })
    
    // Update the message in the array to trigger reactivity
    const index = messages.value.findIndex(msg => msg.id === message.id)
    if (index !== -1) {
      messages.value = [
        ...messages.value.slice(0, index),
        { ...messages.value[index], progress },
        ...messages.value.slice(index + 1)
      ]
    }
    
    if (progress <= 0) {
      log('Progress reached zero for message:', message.id)
      clearInterval(message.interval)
      message.interval = null

      const isToLeftOfHovered = hoveredMessageId.value && !isMessageToRightOfHovered(message)
      
      if (isToLeftOfHovered) {
        // Just mark as cancelled, don't schedule removal
        log('Message to left of hovered, marking cancelled directly:', message.id)
        const index = messages.value.findIndex(msg => msg.id === message.id)
        if (index !== -1) {
          messages.value = [
            ...messages.value.slice(0, index),
            { ...messages.value[index], cancelled: true, progress: 0 }, // Ensure progress is 0
            ...messages.value.slice(index + 1)
          ]
        }
      } else {
        // Not protected by hover, proceed with normal cancellation/removal
        log('Message not to left of hovered, calling cancelMessage:', message.id)
        cancelMessage(message.id)
      }
    }
  }, 32) // ~30fps for smoother updates

  log('Started new interval:', message.interval)
}

function pauseMessage(id) {
  log('Attempting to pause message:', id)
  const message = messages.value.find(msg => msg.id === id)
  log('Found message to pause:', message)
  if (message && !message.isPaused && message.timeout > 0) {
    log('Pausing message:', {
      id: message.id,
      currentInterval: message.interval,
      isPaused: message.isPaused
    })
    
    // Cancel the interval
    if (message.interval) {
      log('Clearing interval:', message.interval)
      clearInterval(message.interval)
      message.interval = null
    }
    
    const index = messages.value.findIndex(msg => msg.id === id)
    if (index !== -1) {
      messages.value = [
        ...messages.value.slice(0, index),
        { ...message, isPaused: true, pauseTime: Date.now() },
        ...messages.value.slice(index + 1)
      ]
      log('Message paused successfully:', messages.value[index])
    }
  }
}

function resumeMessage(id) {
  log('Attempting to resume message:', id)
  const message = messages.value.find(msg => msg.id === id)
  log('Found message to resume:', message)
  if (message && message.isPaused && message.timeout > 0) {
    log('Resuming message:', {
      id: message.id,
      currentInterval: message.interval,
      isPaused: message.isPaused
    })
    
    const pauseDuration = Date.now() - message.pauseTime
    const index = messages.value.findIndex(msg => msg.id === id)
    if (index !== -1) {
      const updatedMessage = { 
        ...message, 
        isPaused: false, 
        pauseTime: null,
        startTime: message.startTime + pauseDuration
      }
      
      messages.value = [
        ...messages.value.slice(0, index),
        updatedMessage,
        ...messages.value.slice(index + 1)
      ]
      
      // Restart the progress update
      startProgressUpdate(updatedMessage)
      log('Message resumed successfully:', messages.value[index])
    }
  }
}

function updateMessage(id, options) {
  const index = messages.value.findIndex(msg => msg.id === id)
  if (index !== -1) {
    const message = messages.value[index]
    if (message.interval) {
      clearInterval(message.interval)
      message.interval = null
    }
    
    const updatedMessage = { 
      ...message, 
      ...options,
      isPaused: false,
      pauseTime: null
    }
    
    if (options.timeout !== undefined) {
      updatedMessage.progress = 100
      updatedMessage.startTime = Date.now()
      
      if (options.timeout > 0) {
        startProgressUpdate(updatedMessage)
      }
    }

    messages.value = [
      ...messages.value.slice(0, index),
      updatedMessage,
      ...messages.value.slice(index + 1)
    ]

    // Add to message history
    const historyIndex = messageHistory.value.findIndex(entry => entry.id === id)
    if (historyIndex !== -1) {
      const updateEntry = {
        title: updatedMessage.title,
        text: updatedMessage.text,
        mode: updatedMessage.mode,
        timestamp: Date.now()
      }
      messageHistory.value = [
        ...messageHistory.value.slice(0, historyIndex),
        {
          ...messageHistory.value[historyIndex],
          updates: [...messageHistory.value[historyIndex].updates, updateEntry]
        },
        ...messageHistory.value.slice(historyIndex + 1)
      ]
    }
  }
}

function cancelMessage(id) {
  const index = messages.value.findIndex(msg => msg.id === id)
  if (index !== -1) {
    const message = messages.value[index]
    if (message.interval) {
      clearInterval(message.interval)
      message.interval = null
    }
    
    // Update the message to be cancelled
    messages.value = [
      ...messages.value.slice(0, index),
      { ...message, cancelled: true },
      ...messages.value.slice(index + 1)
    ]

    // Only remove the message if it's not to the left of a hovered message
    if (!hoveredMessageId.value || !isMessageToRightOfHovered(message)) {
      setTimeout(() => {
        messages.value = messages.value.filter(msg => msg.id !== id)
      }, 300)
    }
  }
}

function toggleHistoryModal() {
  isHistoryModalOpen.value = !isHistoryModalOpen.value
}

function closeHistoryModal() {
  isHistoryModalOpen.value = false
}

function formatTime(timestamp) {
  const date = new Date(timestamp)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

// Export methods for the component
defineExpose({
  push,
  updateMessage,
  cancelMessage
})
</script>

<style>
.ps-progress-status-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 34px;
  padding: 4px 0;
  background: var(--progress-status-background, #f5f5f5);
  transform: translateY(100%);
  transition: transform 0.3s ease;
  z-index: 1000;
  font-family: 'SF Mono', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.ps-progress-status-container.ps-is-visible {
  transform: translateY(0);
}

.ps-status-messages-wrapper {
  position: relative;
  height: 100%;
}

.ps-status-messages-placeholder {
  height: 100%;
  padding: 0 8px;
  padding-left: 88px;
}

.ps-status-messages-floating {
  position: fixed;
  bottom: 4px;
  left: 0;
  right: 0;
  transform: translateY(100%);
  transition: transform 0.3s ease;
  z-index: 1001;
  font-family: 'SF Mono', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.ps-status-messages-floating.ps-is-visible {
  transform: translateY(0);
}

.ps-status-messages {
  display: flex;
  align-items: flex-end;
  padding: 0 8px;
  padding-left: 88px;
  gap: 8px;
  overflow-x: auto;
  position: relative;
}

.ps-status-message-wrapper {
  width: 200px;
  flex-shrink: 0;
  position: relative;
  margin-top:5px;
}

.ps-status-message-wrapper.ps-is-hidden {
  visibility: hidden;
}

.ps-status-message {
  position: relative;
  width: 100%;
  min-height: 28px;
  background: white;
  border-radius: 2px 2px 0 0;
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: default;
  transition: all 0.2s ease;
  font-family: inherit;
}

.ps-status-message.ps-is-expanded {
  min-height: auto;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
  margin-top: 3px;
  transform: translateY(-2px);
  transition: transform 0.2s ease, box-shadow 0.2s ease, margin-top 0.2s ease;
}

.ps-status-message-placeholder {
  height: 0;
  width: 100%;
  flex-shrink: 0;
}

.ps-status-content {
  padding: 2px 8px;
  min-height: calc(100% - 3px);
}

.ps-status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1px;
}

.ps-status-title {
  font-weight: bold;
  font-size: 12px;
  letter-spacing: -0.2px;
  font-family: inherit;
}

.ps-status-text {
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: -0.2px;
  line-height: 1.4;
  font-family: inherit;
  transition: all 0.2s ease;
}

.ps-status-message.ps-is-expanded .ps-status-text {
  white-space: normal;
  overflow: visible;
  animation: ps-fadeInText 0.2s ease forwards;
  padding-bottom: 4px;
}

@keyframes ps-fadeInText {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.ps-status-close {
  background: none;
  border: none;
  padding: 0;
  font-size: 14px;
  cursor: pointer;
  opacity: 0.5;
  line-height: 1;
  color: #000;
}

.ps-status-close:hover {
  opacity: 1;
}

.ps-status-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(0, 0, 0, 0.1);
}

.ps-status-progress-bar {
  height: 100%;
  background: currentColor;
  transition: width 0.05s linear;
  will-change: width;
}

.ps-status-enter-active,
.ps-status-leave-active {
  transition: all 0.3s ease;
}

.ps-status-enter-from,
.ps-status-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* Mode styles */
.ps-info {
  color: var(--progress-status-info-color, #1890ff);
}

.ps-success {
  color: var(--progress-status-success-color, #52c41a);
}

.ps-error {
  color: var(--progress-status-error-color, #ff4d4f);
}

.ps-warning {
  color: var(--progress-status-warning-color, #faad14);
}

.ps-status-counter {
  position: absolute;
  left: 40px; /* Moved to the right to make room for history button */
  bottom: 10px;
  background: rgba(0, 0, 0, 0.35);
  color: #fff;
  font-size: 13px;
  min-width: 24px;
  height: 22px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 7px;
  font-weight: bold;
  z-index: 1002;
  letter-spacing: -0.2px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

.ps-history-button {
  position: fixed;
  left: 10px;
  bottom: 10px;
  background: rgba(0, 0, 0, 0.35);
  color: #fff;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1003;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
  pointer-events: auto;
}

.ps-history-button:hover {
  background: rgba(0, 0, 0, 0.5);
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25);
}

.ps-history-button:active {
  transform: translateY(0);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.ps-history-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1010;
  animation: ps-fadeIn 0.2s ease forwards;
}

@keyframes ps-fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.ps-history-modal {
  background: white;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 500px;
  max-width: 90vw;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  animation: ps-slideUp 0.2s ease forwards;
}

@keyframes ps-slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.ps-history-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.ps-history-modal-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #222;
}

.ps-history-modal-close {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  opacity: 0.5;
  color: #000;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.ps-history-modal-close:hover {
  opacity: 0.8;
  background: rgba(0, 0, 0, 0.05);
}

.ps-history-modal-content {
  padding: 16px;
  overflow-y: auto;
  max-height: calc(80vh - 48px);
}

.ps-history-empty {
  text-align: center;
  padding: 20px;
  color: #999;
  font-style: italic;
}

.ps-history-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ps-history-entry {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 16px;
}

.ps-history-entry:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.ps-history-message {
  background: white;
  border-radius: 3px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
}

.ps-history-update {
  margin-left: 20px;
  position: relative;
}

.ps-history-update::before {
  content: '';
  position: absolute;
  left: -10px;
  top: 50%;
  width: 10px;
  height: 1px;
  background: #ddd;
}

.ps-history-message-content {
  padding: 8px 12px;
}

.ps-history-message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.ps-history-message-title {
  font-weight: bold;
  font-size: 13px;
}

.ps-history-message-time {
  font-size: 11px;
  color: #999;
}

.ps-history-message-text {
  font-size: 12px;
  line-height: 1.4;
  white-space: normal;
  overflow: visible;
}
</style> 