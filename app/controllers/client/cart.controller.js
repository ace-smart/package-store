const axiosInstance = require('../../helper/axios.helper')
const { handleErrors } = require('../../helper/helper')

module.exports = {
  showCart: (req, res) => {
    return res.render('templates/client/cart/cart',{
      layout: 'client/index.layout.hbs',
      products: 2
    })
  },

  showCheckoutPage: async(req, res) => {
    return res.render('templates/client/cart/checkout', {
      layout: 'client/index.layout.hbs',
      products: 2
    })
  },

}
