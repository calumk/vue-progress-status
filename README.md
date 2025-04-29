# Vue Progress Status

A customizable status notification system for Vue 3 with a progress bar, hover to pause functionality, and expandable message support.

## Features

- 📊 Progress bar with smooth animations
- ⏸️ Hover to pause progress and expand message
- 🌈 Four status types: info, success, warning, error
- 🔄 Customizable timeouts
- ✖️ User-dismissible messages
- 📝 Support for multiline messages with newlines
- 📱 Fully responsive

## Installation

```bash
npm install @calumk/vue-progress-status
```

## Usage

### Vue 3 Script Setup

```vue
<script setup>
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

// Long messages with newlines
function showLongMessage() {
  statusRef.value.push({
    title: 'Long Message Example',
    text: 'This is a very long message that will expand when hovered.\nIt contains multiple lines of text to demonstrate the expansion feature.\nEach line will be visible when the message is expanded.',
    mode: 'info',
    timeout: 10000
  })
}
</script>

<template>
  <div>
    <button @click="showNotification">Show Notification</button>
    <ProgressStatus ref="statusRef" />
  </div>
</template>
```

#### `updateMessage(id, options)`

Updates an existing message.

```vue
<script setup>
import { ref } from 'vue'
import ProgressStatus from '@calumk/vue-progress-status'

const statusRef = ref(null)
let messageId = null

function startProcess() {
  // Store the ID when creating a message
  messageId = statusRef.value.push({
    title: 'Processing',
    text: 'Your request is being processed',
    mode: 'info',
    timeout: 30000
  })

  // Later, update the message
  setTimeout(() => {
    statusRef.value.updateMessage(messageId, {
      title: 'Complete',
      text: 'Your request was processed successfully',
      mode: 'success',
      timeout: 5000
    })
  }, 3000)
}
</script>
```

#### `cancelMessage(id)`

Manually dismiss a message.

```vue
<script setup>
import { ref } from 'vue'
import ProgressStatus from '@calumk/vue-progress-status'

const statusRef = ref(null)
let messageId = null

function createMessage() {
  messageId = statusRef.value.push({
    title: 'Information',
    text: 'This is an example message',
    mode: 'info',
    timeout: 0 // No timeout, will stay until cancelled
  })
}

function cancelCurrentMessage() {
  if (messageId !== null) {
    statusRef.value.cancelMessage(messageId)
    messageId = null
  }
}
</script>
```

## API

### Props

There are no props required for the component.

### Methods

#### `push(options)`

Adds a new status message to the display.

##### Options

- `title` (String): Title of the status message
- `text` (String): Message content. Supports newlines with `\n`
- `mode` (String): Status type - 'info', 'success', 'warning', 'error'
- `timeout` (Number): Time in milliseconds before auto-dismiss. Set to 0 for no timeout
- `cancellable` (Boolean): Whether the user can manually dismiss the message

#### `updateMessage(id, options)`

Updates an existing message.

## Features

- **Hover to Pause**: When hovering over a message, the progress bar pauses
- **Expand on Hover**: Messages expand to show full content when hovered
- **Multiline Support**: Use `\n` in your message text for line breaks
- **Animation**: Smooth transitions for all interactions
- **Responsive**: Works well on all screen sizes
- **No Dependencies**: Lightweight with no external dependencies

## Customizing

The component uses CSS variables for easy customization:

```css
:root {
  --progress-status-info-color: #1890ff;
  --progress-status-success-color: #52c41a;
  --progress-status-warning-color: #faad14;
  --progress-status-error-color: #ff4d4f;
}
```

## License

MIT
