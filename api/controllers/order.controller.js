const OrderObject = require("../objects/OrderObject")
const NotFoundError = require("../errors/not_found")
const ErrorHandler = require("../helper/errorHandler")

module.exports = {
  // @desc:   Show orders
  // @route   GET /orders
  showOrderList: async (req, res) => {
    try {
      const orders = await OrderObject.getOrdersBy({})
      if (orders && orders.length > 0) {
        return res.status(200).json(orders)
      }

      throw new NotFoundError("No order found.")
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
      throw new NotFoundError("No order found.")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc    Add new address
  // @route   POST /orders
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

  // @desc    Update order
  // @route   PUT /orders/:id
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

  // @desc    Delete order
  // @route   DELETE /orders/:id
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
}
