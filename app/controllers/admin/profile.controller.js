module.exports = {
    // @desc:   Show profile
    // @route   GET /profile
    showProfilePage: async (req, res) => {
        const profile = {}
        const user = {
            username: req.user.username,
            email: req.user.email,
            role: req.user.role,
            profileId: req.user.profileId,
            status: req.user.status,
            createdAt: req.user.createdAt
        }

        res.render('templates/admin/profile/profile',{
            layout: 'admin/profile.layout.hbs',
            user: user
        })
    },

    // @desc    Update profile
    // @route   PUT /profile
    updateProfile: async (req, res) => {
        return 'Update'
    },

    // @desc:   Get profile by Id
    // @route   GET /profile/:id
    getProfileById: async (req, res) => {
        // res.render('templates/admin/account',{
        //     layout: 'admin/table.layout.hbs'
        // })
    },

    // @desc    show create form
    // @route   GET /profile/add
    showCreateProfileForm: async (req, res) => {
        res.render('templates/admin/profile/profile_form',{
            layout: 'admin/profile.layout.hbs'
        })
    },

    // @desc    Delete profile
    // @route   DELETE /profile/:id
    removeProfileById: async (req, res) => {
        return 'Remove'
    },
}
