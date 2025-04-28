<template>
  <div>
    <!-- Background bar -->
    <div class="progress-status-container" :class="{ 'is-visible': hasVisibleMessages }">
      <div class="status-messages-wrapper">
        <div class="status-messages-placeholder"></div>
      </div>
    </div>

    <!-- Floating messages -->
    <div class="status-messages-floating" :class="{ 'is-visible': hasVisibleMessages }">
      <div class="status-messages">
        <div
          v-for="message in allMessages"
          :key="message.id"
          class="status-message-wrapper"
          :class="{ 'is-hidden': message.cancelled && !isMessageToRightOfHovered(message) }"
        >
          <div
            v-if="!message.cancelled"
            class="status-message"
            :class="[message.mode, { 'is-expanded': message.isExpanded }]"
            @mouseenter="handleMouseEnter(message.id)"
            @mouseleave="handleMouseLeave(message.id)"
          >
            <div class="status-content">
              <div class="status-header">
                <span class="status-title">{{ message.title }}</span>
                <button v-if="message.cancellable" class="status-close" @click="cancelMessage(message.id)">×</button>
              </div>
              <div class="status-text">{{ message.text }}</div>
            </div>
            <div class="status-progress" v-if="message.timeout > 0">
              <div 
                class="status-progress-bar" 
                :style="{ width: `${message.progress}%` }"
              ></div>
            </div>
          </div>
          <div v-if="message.isExpanded" class="status-message-placeholder"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch } from 'vue'

export default defineComponent({
  name: 'ProgressStatus',
  setup() {
    const messages = ref([])
    const messageId = ref(0)
    const hoveredMessageId = ref(null)

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
      console.log('Starting progress update for message:', message.id)
      if (message.interval) {
        console.log('Clearing existing interval:', message.interval)
        clearInterval(message.interval)
      }

      message.interval = setInterval(() => {
        if (message.cancelled || message.isPaused) {
          console.log('Stopping update - cancelled or paused:', { 
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
        
        console.log('Progress update:', {
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
          console.log('Progress reached zero for message:', message.id)
          clearInterval(message.interval)
          message.interval = null

          const isToLeftOfHovered = hoveredMessageId.value && !isMessageToRightOfHovered(message)
          
          if (isToLeftOfHovered) {
            // Just mark as cancelled, don't schedule removal
            console.log('Message to left of hovered, marking cancelled directly:', message.id)
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
            console.log('Message not to left of hovered, calling cancelMessage:', message.id)
            cancelMessage(message.id)
          }
        }
      }, 32) // ~30fps for smoother updates

      console.log('Started new interval:', message.interval)
    }

    function pauseMessage(id) {
      console.log('Attempting to pause message:', id)
      const message = messages.value.find(msg => msg.id === id)
      console.log('Found message to pause:', message)
      if (message && !message.isPaused && message.timeout > 0) {
        console.log('Pausing message:', {
          id: message.id,
          currentInterval: message.interval,
          isPaused: message.isPaused
        })
        
        // Cancel the interval
        if (message.interval) {
          console.log('Clearing interval:', message.interval)
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
          console.log('Message paused successfully:', messages.value[index])
        }
      }
    }

    function resumeMessage(id) {
      console.log('Attempting to resume message:', id)
      const message = messages.value.find(msg => msg.id === id)
      console.log('Found message to resume:', message)
      if (message && message.isPaused && message.timeout > 0) {
        console.log('Resuming message:', {
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
          console.log('Message resumed successfully:', messages.value[index])
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

    return {
      messages,
      visibleMessages,
      allMessages,
      hasVisibleMessages,
      isMessageToRightOfHovered,
      handleMouseEnter,
      handleMouseLeave,
      push,
      expandMessage,
      collapseMessage,
      startProgressUpdate,
      pauseMessage,
      resumeMessage,
      updateMessage,
      cancelMessage
    }
  }
})
</script>

<style>
.progress-status-container {
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

.progress-status-container.is-visible {
  transform: translateY(0);
}

.status-messages-wrapper {
  position: relative;
  height: 100%;
}

.status-messages-placeholder {
  height: 100%;
  padding: 0 8px;
}

.status-messages-floating {
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

.status-messages-floating.is-visible {
  transform: translateY(0);
}

.status-messages {
  display: flex;
  align-items: flex-end;
  padding: 0 8px;
  gap: 8px;
  overflow-x: auto;
  position: relative;
  /* small shadow */
}

.status-message-wrapper {
  width: 200px;
  flex-shrink: 0;
  position: relative;
  margin-top:5px;
}

.status-message-wrapper.is-hidden {
  visibility: hidden;
}

.status-message {
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

.status-message.is-expanded {
  min-height: auto;
  /* Remove transform-origin and animation that causes font stretching */
  /* box-shadow all sides with more emphasis on top */
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
  margin-top: 3px; /* Add margin to make top shadow visible */
  transform: translateY(-2px); /* Move up slightly instead of scaling */
  transition: transform 0.2s ease, box-shadow 0.2s ease, margin-top 0.2s ease;
}

.status-message-placeholder {
  height: 0;
  width: 100%;
  flex-shrink: 0;
}

.status-content {
  padding: 2px 8px;
  min-height: calc(100% - 3px);
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1px;
}

.status-title {
  font-weight: bold;
  font-size: 12px;
  letter-spacing: -0.2px;
  font-family: inherit;
}

.status-text {
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: -0.2px;
  line-height: 1.4;
  font-family: inherit;
  transition: all 0.2s ease;
}

.status-message.is-expanded .status-text {
  white-space: normal;
  overflow: visible;
  animation: fadeInText 0.2s ease forwards;
  padding-bottom: 4px;
}

@keyframes fadeInText {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.status-close {
  background: none;
  border: none;
  padding: 0;
  font-size: 14px;
  cursor: pointer;
  opacity: 0.5;
  line-height: 1;
  color: #000;
}

.status-close:hover {
  opacity: 1;
}

.status-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(0, 0, 0, 0.1);
}

.status-progress-bar {
  height: 100%;
  background: currentColor;
  transition: width 0.05s linear;
  will-change: width;
}

.status-enter-active,
.status-leave-active {
  transition: all 0.3s ease;
}

.status-enter-from,
.status-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* Mode styles */
.info {
  color: var(--progress-status-info-color, #1890ff);
}

.success {
  color: var(--progress-status-success-color, #52c41a);
}

.error {
  color: var(--progress-status-error-color, #ff4d4f);
}

.warning {
  color: var(--progress-status-warning-color, #faad14);
}
</style> 