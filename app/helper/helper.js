
module.exports = {
    removeCSRF: function(formInput = {}){
        // remove field ['_csrf'] from the form body
        if (JSON.stringify(formInput) !== '{}' && formInput._csrf != null){
            delete formInput._csrf
        }

        return formInput
    },
    getFilledFields: function(body, data){
        // return only fields that are different from database
        const bodyKeys = Object.keys(body)
        const filledFields = {}
        for(const [key, value] of Object.entries(data)){
            for (let i = 0; i < bodyKeys.length; i++){
                if (key === bodyKeys[i] && value !== body[key]){
                    filledFields[key] = body[key]
                }
            }
        }
        
        return filledFields
    },
    toDateFormat: function(dateString) {
        // origin format: [MM/DD/YYYY]
        // parse to format [YYYY/MM/DD]
        const [month, day, year] = [...dateString.split('/')]
        return year + '/' + month + '/' + day
    }
}