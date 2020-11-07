const helper = require('../../helper/helper')

module.exports = {
    // @desc:   show index page
    // @route:  GET ['/','/index','/home']
    showIndexPage: async (req,res) => {
        return res.render('templates/admin/index', {
            layout: 'admin/index.layout.hbs',
            user: await helper.getUserInstance(req),
        })
    },
}
