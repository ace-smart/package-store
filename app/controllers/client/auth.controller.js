
module.exports = {
    // @desc:   show register page
    // @route:  GET /register
    showRegisterPage: (req,res) => {
        return res.render('templates/client/auth/auth.hbs', {
            pageTitle: 'Register',
            register: 'registerForm',
            layout: 'client/index.layout.hbs',
        })
    },

    // @desc:   show login page
    // @route:  GET /login
    showLoginPage: (req,res) => { 
        return res.render('templates/client/auth/auth.hbs', {
            pageTitle: 'Login',
            login: 'loginForm',
            layout: 'client/index.layout.hbs',
        })
    },

    // @desc:   show login page
    // @route:  GET ['/','/index','/home']
    showForgotPasswordPage: (req,res) => {
        return res.render('templates/client/auth/login.hbs', {
            layout: 'client/index.layout.hbs',
        })
    },

    // @desc:   show login page
    // @route:  GET ['/','/index','/home']
    showResetPasswordPage: (req,res) => {
        return res.render('templates/client/auth/login.hbs', {
            layout: 'client/index.layout.hbs',
        })
    },
    
    // @desc:   show contact page
    // @route:  POST /login
    login: (req,res) => {
        return res.render('templates/client/contact/contact.hbs', {
            layout: 'client/index.layout.hbs',
            template: 'contact'
        })
    },

    // @desc:   show contact page
    // @route:  POST /logout
    logout: (req,res) => {
        return res.render('templates/client/contact/contact.hbs', {
            layout: 'client/index.layout.hbs',
            template: 'contact'
        })
    },

}
