const axiosInstance = require('../../helper/axios.helper')

module.exports = { 
  showMyAccount: async(req, res) => {
    return res.render('templates/client/account/my-account', {
      layout: 'client/index.layout.hbs'
    })
  }
}