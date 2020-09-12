
module.exports = {
    // @desc:   show index page
    // @route:  GET ['/','/index','/home']
    showIndexPage: (req,res) => {
        res.render('templates/admin/index', {
            layout: 'admin/index.layout.hbs',
            user: {
                username: req.user.username,
                email: req.user.email,
                role: req.user.role,
                profile: req.user.profileId,
                status: req.user.status,
                createdAt: req.user.createdAt,
            },
        })
    },
}
