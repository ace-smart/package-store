class ObjectError extends Error {
  constructor({objectName, errorProperty, message}, ...params){
    super(...params)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ObjectError)
    }

    // ---- EXAMPLE ----
    // UserObject: {
    //  objectName: 'UserObject',
    //  errorProperty: 'Id',
    //  message: 'UserObject.Id is not valid.',
    // }
    this.name = 'ObjectError'
    this.message = `${objectName}.${errorProperty} is not valid.`
    this.description = message
  }

}

module.exports = ObjectError