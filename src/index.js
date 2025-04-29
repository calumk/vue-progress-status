import ProgressStatus from './components/ProgressStatus.vue'
import { progressStatusService } from './progressStatusService'

// Export as named exports
export { ProgressStatus, progressStatusService }

// Export component as default
export default ProgressStatus

// Create an install function for Vue.use()
const install = (app) => {
  app.component('ProgressStatus', ProgressStatus)
}

// Auto-install when Vue is found (in browser via <script> tag)
let GlobalVue = null
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue
  if (GlobalVue) {
    GlobalVue.use({ install })
  }
}

// Export the install function
export { install } 