const axiosInstance = require('../../helper/axios.helper')

module.exports = {
  showMyOrder: async(req, res ) => {
    return res.render('templates/client/order/my-order',{
      layout: 'client/index.layout.hbs',
      
    })
  }
}