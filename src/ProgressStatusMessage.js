export class ProgressStatusMessage {
  constructor(id, service) {
    this.id = id
    this.service = service
  }

  update(options) {
    this.service.update(this.id, options)
    return this
  }

  cancel() {
    this.service.cancel(this.id)
    return this
  }
} 