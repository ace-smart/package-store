const OrderObject = require("../objects/OrderObject")
const AddressObject = require('../objects/AddressObject')
const ProfileObject = require('../objects/ProfileObject')
const ProductObject = require('../objects/ProductObject')
const NotFoundError = require("../errors/not_found")
const ErrorHandler = require("../helper/errorHandler")

module.exports = {
  // @desc:   Show orders
  // @route   GET /orders
  showOrderList: async (req, res) => {
    try {
      const orders = await OrderObject.getOrdersBy({})
      return res.status(200).json(orders)
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc:   Get orders by Id
  // @route   GET /orders/:id
  getOrderById: async (req, res) => {
    try {
      const order = await OrderObject.getOneOrderBy({ _id: req.params.id })
      if (order) {
        return res.status(200).json(order)
      }
      // Not found
      return res.status(200).json(null)
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc:   Get shipping cost
  // @route:  GET /get-shipping-cost
  getShippingCost: (req, res) => {
    return res.status(200).json(OrderObject.getShippingCost())
  },

  // @desc:    Add new address
  // @route:   POST /orders
  createNewOrder: async (req, res) => {
    try {
      const createdOrder = await OrderObject.create({ ...req.body })
      if (createdOrder) {
        return res.status(201).json(createdOrder)
      }

      throw new Error("Failed to create order.")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc:    Update order
  // @route:   PUT /orders/:id
  updateOrderById: async (req, res) => {
    try {
      const order = await OrderObject.getOneOrderBy({ _id: req.params.id })
      if (order) {
        const isUpdated = await order.update({ ...req.body })
        if (isUpdated) {
          return res.sendStatus(204)
        }

        throw new Error("Failed to update order.")
      }

      throw new NotFoundError("No order found.")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc:    Delete order
  // @route:   DELETE /orders/:id
  removeOrderById: async (req, res) => {
    try {
      const order = await OrderObject.getOneOrderBy({ _id: req.params.id })
      if (order) {
        const isRemoved = await order.remove()
        if (isRemoved) {
          return res.sendStatus(204)
        }

        throw new Error("Failed to remove order.")
      }

      throw new NotFoundError("No order found.")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc:   Validate address and contact info
  // @route:  GET /validate-delivery-info
  // INPUT:   
  /*  req.body = {
  //    address: {street, city, district, country, postalCode}
  //    profile: {firsName, lastName, phoneNumber, email}
  //  }
  // 
  */
  validateDeliveryInfo: async (req, res) => {
    try {
      if (req.body.address != null && req.body.profile != null) {
        const address = new AddressObject({...req.body.address})
        const profile = new ProfileObject({...req.body.profile})
        if (profile.validate() && address.validate()) {
          return res.sendStatus(200)
        }
      }

      throw new Error("Delivery is not valid.")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc:   Place an order
  // @route:  POST /checkout    
  /* INPUT:   req.body = {
  //    productList: [Array],
  //    deliveryInfo: {address, profile},
  //    paymentMethod: 'COD' || 'CARD'
  // }
  */
  checkout: async (req, res) => {
    try {
      const checkout = await OrderObject.checkout(req.body)
      if (checkout) {
        return res.status(201).json(checkout)
      }

      throw new Error("Failed to checkout.")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  trackOrder: async(req, res) => {
    try {
      const orderId = require('mongoose').Types.ObjectId(req.params.orderId)
      const order = await OrderObject.getOneOrderBy({_id: orderId})
      if (order) {
        return res.status(200).json(order)
      }

      return res.status(200).json(null)
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  getOrdersByUserId: async (req, res) => {
    try {
      const orders = await OrderObject.getOrdersBy({userId: req.params.userId})
      return res.status(200).json(orders)
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  getOrderWithUser: async (req, res) => {
    try {
      const order = await OrderObject.getOneOrderBy({userId: req.params.userId, _id: req.query.orderId})
      if (order) {
        return res.status(200).json(order)
      }
      return res.status(200).json(null)
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  calculateTotalCost: async (req, res) => {
    try {
      const productList = req.body
      const shippingCost = OrderObject.getShippingCost()
      let totalCost = 0
      if (productList && productList.length > 0) {
        totalCost = await ProductObject.calculateCost(productList, shippingCost)
        return res.status(200).json(totalCost)
      }

      return res.status(200).json(totalCost)
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  }
}
