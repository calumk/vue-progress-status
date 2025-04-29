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

### Importing

There are two parts to import:

```js
// Import the component
import ProgressStatus from '@calumk/vue-progress-status'

// Import the styles (required)
import '@calumk/vue-progress-status/dist/style.css'
```

### Vue 3 Script Setup

```vue
<script setup>
import { ref } from 'vue'
import ProgressStatus from '@calumk/vue-progress-status'
import '@calumk/vue-progress-status/dist/style.css' // Import the styles

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
import '@calumk/vue-progress-status/dist/style.css'

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
import '@calumk/vue-progress-status/dist/style.css'

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

The component uses CSS variables for easy customization. You can override these in your CSS:

```css
:root {
  /* Colors for different status modes */
  --progress-status-info-color: #1890ff;
  --progress-status-success-color: #52c41a;
  --progress-status-warning-color: #faad14;
  --progress-status-error-color: #ff4d4f;
  
  /* Background and other styling */
  --progress-status-background: #f5f5f5;
}
```

### Alternative: Importing CSS in specific components

If you prefer not to import the CSS globally, you can import it in your component:

```vue
<script setup>
import { ref } from 'vue'
import ProgressStatus from '@calumk/vue-progress-status'
import '@calumk/vue-progress-status/dist/style.css' // Import CSS in component
</script>
```

### Styling with Scoped CSS

You can also target the component with scoped CSS:

```vue
<style scoped>
/* Target specific parts of the component */
:deep(.status-message) {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}
</style>
```

## License

MIT
