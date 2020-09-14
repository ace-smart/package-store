
module.exports = {
    removeCSRF: function(formInput = {}){
        if (JSON.stringify(formInput) !== '{}' && formInput._csrf != null){
            delete formInput._csrf
        }

        return formInput
    },
    toDateFormat: function(dateString) {
        // origin format: [MM/DD/YYYY]
        // parse to format [YYYY/MM/DD]
        const [month, day, year] = [...dateString.split('/')]
        return year + '/' + month + '/' + day
    }
}