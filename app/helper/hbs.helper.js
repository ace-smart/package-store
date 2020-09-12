module.exports = {
    ifeq: function (a, b, options) {
        if (a === b) {
            return options.fn(this)
        }
        return options.inverse(this)
    },
    formatDate: function(date){
        return new Date(date).toLocaleDateString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'}).replace('-','/')
    },
    toDateFormat: function(dateString) {
        // origin format: [MM/DD/YYYY]
        // parse to format [YYYY/MM/DD]
        const [month, day, year] = [...dateString.split('/')]
        return year + '/' + month + '/' + day
    }
}
