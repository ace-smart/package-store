class PayloadError extends Error {
  constructor(payload = {}, ...params){
    super(...params)

    if (Error.captureStackTrace){
      Error.captureStackTrace(this, PayloadError)
    }
    
    this.name = 'PayloadError'
    this.message = 'Payload is not valid.'
    this.description = 'Can not have null or undefined properties.'
    this.payload = payload
  }
}

module.exports = PayloadError