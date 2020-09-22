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
    formatShortDate: function(date){
        return new Date(date).toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: '2-digit'}).replace('-','/')
    },
    ifMatch: function (a,b, options){
        if(a === b){
            return options.fn(this)
        }
    }
}
