const axiosInstance = require('../../helper/axios.helper')
const { handleErrors } = require('../../helper/helper')

module.exports = {
  showDetails: async (req, res) => {
    try {
      // const details = await axiosInstance.get(`/product/${req.params.id}`)
      // if (details.status === 200) {
      //   details.data
      // }

      return res.render('templates/client/product/detail', {
        layout: 'client/index.layout.hbs',
        pageTitle: 'Product',
        // product: details.data
      })
    } catch (error) {
      return handleErrors(res, error, 'client')
    }
  },

  showProductsBy: async (req, res) => {
    try {
      return res.render('templates/client/product/list', {
        layout: 'client/index.layout.hbs',
        pageTitle: 'Products',
        products: 15,
        breadcrumb: [
          {link: '/', routeName: 'Home'},
          {link: '/products-by', routeName: 'Products'}
        ]
      })

    } catch (error) {
      return handleErrors(res, error, 'client')
    }
  },

}