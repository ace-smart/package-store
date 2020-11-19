module.exports = {
    ifeq: function (a, b, options) {
        if (a === b) {
            return options.fn(this)
        }
        return options.inverse(this)
    },
    formatDate: function(date){
        if (date == '') {
            date = new Date()
        }
        
        return new Date(date).toLocaleDateString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'})
    },
    formatShortDate: function(date){
        return new Date(date).toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: '2-digit'}).replace('-','/')
    },
    ifMatch: function (a,b, options){
        if(a === b){
            return options.fn(this)
        }
    },
    showNumOfItems: function (numOfItems, itemPerPage, currentPage){
        let currentNumOfItems = itemPerPage * currentPage

        if (currentNumOfItems > numOfItems) {
            currentNumOfItems = numOfItems
        }

        return currentNumOfItems
    },
    equal: function(a, b, options) {
        a = parseInt(a.toString())
        b = parseInt(b.toString())

        if (a === b) {
            return options.fn(this)
        } else {
            return options.inverse(this)
        }
    },
    // formatPrice: function(price){
    //     return `$ ${parseFloat(price)}`
    // },
}
