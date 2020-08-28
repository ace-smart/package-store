
module.exports = {
    // @desc:   show index page
    // @route:  GET ['/','/index','/home']
    showIndexPage: (req,res) => {
        res.render('templates/admin/index', {
            layout: 'admin/index.layout.hbs',
            user: req.user
        })
    },
}
