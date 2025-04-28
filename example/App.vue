<template>
  <div class="app">
    <h1>Vue Progress Status Example</h1>
    <div class="buttons">
      <button @click="showInfo">Show Info</button>
      <button @click="showSuccess">Show Success</button>
      <button @click="showError">Show Error</button>
      <button @click="showWarning">Show Warning</button>
      <button @click="showLongMessage">Show Long Message</button>
      <button @click="showReallyLongMessageWithNewLine">Show Really Long Message With New Line</button>
      <button @click="showPersistent">Show Persistent</button>
      <button @click="showUpdatable">Show Updatable</button>
    </div>
    <progress-status ref="status" />
  </div>
</template>

<script>
import ProgressStatus from '../src/components/ProgressStatus.vue'

export default {
  components: {
    ProgressStatus
  },
  methods: {
    showInfo() {
      this.$refs.status.push({
        title: 'Information',
        text: 'This is an info message',
        mode: 'info',
        timeout: 5000
      })
    },
    showSuccess() {
      this.$refs.status.push({
        title: 'Success',
        text: 'Operation completed successfully!',
        mode: 'success',
        timeout: 10000
      })
    },
    showLongMessage() {
      this.$refs.status.push({
        title: 'Long Message',
        text: 'This is a long message that should wrap around the container',
        mode: 'info',
        timeout: 10000
      })
    },
    showReallyLongMessageWithNewLine() {
      this.$refs.status.push({
        title: 'Really Long Message',
        text: 'This is a really long message that should wrap around the container, \n and this is a new line \n \n and this is another new line',
        mode: 'info',
        timeout: 10000
      })
    },
    showError() {
      this.$refs.status.push({
        title: 'Error',
        text: 'Something went wrong!',
        mode: 'error',
        timeout: 8000
      })
    },
    showWarning() {
      this.$refs.status.push({
        title: 'Warning',
        text: 'Please be careful!',
        mode: 'warning',
        timeout: 4000
      })
    },
    showPersistent() {
      this.$refs.status.push({
        title: 'Persistent',
        text: 'This message will stay until manually closed',
        mode: 'info',
        timeout: 0,
        cancellable: true
      })
    },

    showUpdatable() {
      const id = this.$refs.status.push({
        title: 'Processing',
        text: 'Starting operation...',
        mode: 'info',
        timeout: 0,
        cancellable: true
      })

      // Simulate progress updates
      setTimeout(() => {
        this.$refs.status.updateMessage(id, {
          text: 'Processing step 1 of 3...'
        })
      }, 1000)

      setTimeout(() => {
        this.$refs.status.updateMessage(id, {
          text: 'Processing step 2 of 3...'
        })
      }, 2000)

      setTimeout(() => {
        this.$refs.status.updateMessage(id, {
          text: 'Processing step 3 of 3...'
        })
      }, 3000)

      setTimeout(() => {
        this.$refs.status.updateMessage(id, {
          title: 'Complete',
          text: 'Operation finished successfully!',
          mode: 'success',
          timeout: 3000
        })
      }, 4000)
    }
  }
}
</script>

<style>
.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin: 2rem 0;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: #1890ff;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background: #40a9ff;
}
</style> 