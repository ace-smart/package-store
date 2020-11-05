
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
    },

    renderServerErrorPage: function(res, forRole = 'user') {
        if (forRole === 'user') {
            return res.render("templates/client/error/500", {
                layout: "admin/error.layout.hbs"
            })
        } else if (forRole === 'admin'){
            return res.render("templates/admin/error/500", {
                layout: "admin/error.layout.hbs"
            })
        }
    },

    renderNotFoundPage: function(res, forRole = 'user') {
        if (forRole === 'user') {
            return res.render("templates/client/error/404", {
                layout: "admin/error.layout.hbs"
            })
        } else if (forRole === 'admin'){
            return res.render("templates/admin/error/404", {
                layout: "admin/error.layout.hbs"
            })
        }
    },

    renderForbiddenPage: function(res, forRole = 'user') {
        if (forRole === 'user') {
            return res.render("templates/client/error/403", {
                layout: "admin/error.layout.hbs"
            })
        } else if (forRole === 'admin'){
            return res.render("templates/admin/error/403", {
                layout: "admin/error.layout.hbs"
            })
        }
    },

    renderUnauthorizedPage: function(res, forRole = 'user') {
        if (forRole === 'user') {
            return res.render("templates/client/error/401", {
                layout: "admin/error.layout.hbs"
            })
        } else if (forRole === 'admin'){
            return res.render("templates/admin/error/401", {
                layout: "admin/error.layout.hbs"
            })
        }
    }
}