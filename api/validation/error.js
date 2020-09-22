function UnknownInputError([...fields]) {
    this.fields = [...fields]
    this.message = 'Unknown fields.'
    this.type = 'UnknownInput'
}

UnknownInputError.prototype = new Error()

function InvalidError(field, data, message) {
    this.field = field
    this.value = data[field]
    this.message = message
    this.type = 'InvalidInput'
    delete data[field]
    this.formInput = data
}

InvalidError.prototype = new Error()

module.exports = {UnknownInputError, InvalidError}