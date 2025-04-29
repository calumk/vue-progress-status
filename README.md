# @calumk/vue-progress-status

[![npm version](https://img.shields.io/npm/v/@calumk/vue-progress-status.svg)](https://www.npmjs.com/package/@calumk/vue-progress-status)
[![GitHub](https://img.shields.io/github/stars/calumk/vue-progress-status?style=social)](https://github.com/calumk/vue-progress-status)
[![license](https://img.shields.io/npm/l/@calumk/vue-progress-status.svg)](https://github.com/calumk/vue-progress-status/blob/main/LICENSE)

A customizable status notification system for Vue 3 with a progress bar and hover functionality.

[View Demo](https://calumk.github.io/vue-progress-status/)

## Features

- Clean, minimal status notifications
- Progress bar for auto-dismissing messages
- Hover to pause/resume the timer
- Expandable messages for longer content
- Multiple message types (info, success, warning, error)
- Comprehensive history tracking of all notifications and updates
- Fully customizable via CSS variables

## Installation

```bash
# npm
npm install @calumk/vue-progress-status

# yarn
yarn add @calumk/vue-progress-status

# pnpm
pnpm add @calumk/vue-progress-status

# bun
bun install @calumk/vue-progress-status
```

## Usage

### Basic Usage

```vue
<template>
  <ProgressStatus ref="statusRef" />
  <button @click="showNotification">Show Notification</button>
</template>

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
</script>
```

### Using the Service

You can also use the service to trigger notifications from anywhere in your application:

```vue
<template>
  <button @click="showServiceNotification">Show Notification</button>
</template>

<script setup>
import { progressStatusService } from '@calumk/vue-progress-status'

function showServiceNotification() {
  progressStatusService.push({
    title: 'Service Notification',
    text: 'This notification was triggered using the service',
    mode: 'info',
    timeout: 5000,
    cancellable: true
  })
}
</script>
```

Don't forget to add the component somewhere in your app:

```vue
<template>
  <ProgressStatus />
</template>

<script setup>
import ProgressStatus from '@calumk/vue-progress-status'
</script>
```

## API

### Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| debug | Boolean | false | Enables debug logging to console |

### Message Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| title | String | '' | Title of the notification |
| text | String | '' | Message content |
| mode | String | 'info' | Type of notification ('info', 'success', 'warning', 'error') |
| timeout | Number | 10000 | Time in ms before auto-dismiss (0 for no timeout) |
| cancellable | Boolean | true | Whether user can dismiss the notification |

### Methods

| Method | Parameters | Return | Description |
|--------|------------|--------|-------------|
| push | options | messageId | Add a new notification |
| updateMessage | (id, options) | void | Update an existing notification |
| cancelMessage | id | void | Dismiss a notification |

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build the library
npm run build

# Build the GitHub Pages demo
npm run build:demo

# Preview the demo locally
npm run preview:demo

# Deploy to GitHub Pages
npm run deploy:demo
```

## License

MIT License

---

**Calum Knott**
- Website: [calumk.com](http://calumk.com)
- GitHub: [@calumk](https://github.com/calumk)
- Twitter: [@calumk](https://twitter.com/calumk)
- Ko-fi: [Buy me a coffee](https://ko-fi.com/calumk)
