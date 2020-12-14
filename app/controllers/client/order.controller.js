const axiosInstance = require('../../helper/axios.helper')
const { handleErrors, getUserInstance, getMenu, makePagination, renderNotFoundPage } = require('../../helper/helper')

module.exports = {
  showMyOrder: async(req, res ) => {
    try {
      const user = await getUserInstance(req)
      const response = await axiosInstance.get(`/my-orders/${user.id}`, {
        headers: {
          Authorization: "Bearer " + req.user.accessToken
        }
      })
      let orders = []
  
      if (response.status === 200) {
        orders = response.data
      }
      
      // === Pagination CONSTANT
      let currentPage = req.query.page ? parseInt(req.query.page.toString()) : 1
      const itemPerPage = 10
      const numOfItems = (orders != null) ? orders.length : 0

      // Default pagination declaration
      let pagination = {
        numOfPages: 1,
        itemPerPage: itemPerPage,
        numOfItems: numOfItems,
        currentPage: currentPage
      }
      
      // Make pagination for contact items
      const helperPagination = makePagination(orders, pagination.itemPerPage, pagination.currentPage)
      if (helperPagination != null) {
        pagination.numOfPages = helperPagination.numOfPages
        pagination.items = helperPagination.items
      } 

      return res.render('templates/client/order/my-order',{
        layout: 'client/index.layout.hbs',
        user: user,
        categories: await getMenu(),
        orders: pagination.items,
        pagination: pagination,
        pageTitle: "My orders",
        myOrder: 'list'
      })
  
    } catch (error) {
      return handleErrors(res, error, 'client')
    }
  }, 

  viewMyOrderById: async(req, res ) => {
    try {
      const user = await getUserInstance(req)
      const response = await axiosInstance.get(`/my-orders/${user.id}/get-order?orderId=${req.params.orderId}`, {
        headers: {
          Authorization: "Bearer " + req.user.accessToken
        }
      })
      
      if (response.status === 200) {
        return res.render('templates/client/order/my-order',{
          layout: 'client/index.layout.hbs',
          user: user,
          categories: await getMenu(),
          order: response.data,
          pageTitle: "My orders",
          myOrder: 'view'
        })
      }

      return renderNotFoundPage(res, 'client')
    } catch (error) {
      return handleErrors(res, error, 'client')
    }
  }, 
}