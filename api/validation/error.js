function UnknownInputError([...fields]) {
    this.fields = [...fields]
    this.message = 'Unknown fields.'
    this.type = 'UnknownInput'
}

UnknownInputError.prototype = new Error()

function InvalidError(field, value, message) {
    this.field = field
    this.value = value
    this.message = message
    this.type = 'InvalidInput'
}

InvalidError.prototype = new Error()

module.exports = {UnknownInputError, InvalidError}