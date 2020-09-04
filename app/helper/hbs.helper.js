module.exports = {
    ifeq: function (a, b, options) {
        if (a === b) {
            return options.fn(this)
        }
        return options.inverse(this)
    },
    formatDate: function(date){
        return new Date(date).toLocaleDateString('en-US', {year: 'numeric', month: 'numeric', day: '2-digit'}).replace('-','/')
    },
}
