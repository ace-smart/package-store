class ObjectError extends Error {
  constructor(object, ...params){
    super(...params)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ObjectError)
    }

    // ---- EXAMPLE ----
    // object: {
    //  name: 'UserObject',
    //  message: 'Can not save with undefined or null id',
    //  instance: UserObject {username: 'abcd', email: 'abcd@mail.com' }
    // }
    this.name = 'ObjectError'
    this.message = `${object.name} is not valid.`
    this.description = object.message
    this.object = object
  }

}

module.exports = ObjectError