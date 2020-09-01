module.exports = {
    ifeq: function (a, b, options) {
        console.log(a)
        console.log(b)
        if (a === b) {
            return options.fn(this)
        }
        return options.inverse(this)
    },
    formatDate: function(date){
        return new Date(date).toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: '2-digit'})
    },
}
