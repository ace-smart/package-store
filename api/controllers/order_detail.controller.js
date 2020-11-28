const OrderDetailObject = require("../objects/OrderDetailObject")
const OrderObject = require("../objects/OrderObject")
const NotFoundError = require("../errors/not_found")
const ErrorHandler = require("../helper/errorHandler")

module.exports = {
  // @desc:   Show all order details
  // @route   GET /orders/:id/details
  showOrderDetailList: async (req, res) => {
    try {
      const order = await OrderObject.getOneOrderBy({ _id: req.params.id })
      if (order) {
        const order_details = await OrderDetailObject.getOrderDetailsBy({ orderId: order.id })
        if (order_details && order_details.length > 0) {
          return res.status(200).json(order_details)
        }

        throw new NotFoundError("No detail found.")
      }

      throw new NotFoundError("No order found.")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc:   Get order details by Id
  // @route   GET /orders/:id/details/:detailId
  getOrderDetailById: async (req, res) => {
    try {
      const order = await OrderObject.getOneOrderBy({ _id: req.params.id })
      if (order) {
        const orderDetail = await OrderDetail.findOne({
          _id: req.params.detailId,
          orderId: req.params.id.toString(),
        })
        if (orderDetail) {
          return res.status(200).json(orderDetail)
        }

        // Not found
        throw new NotFoundError("No detail found.")
      }

      throw new NotFoundError("No order found.")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc    Add new orderDetail
  // @route   POST /orders/:id/details
  createNewOrderDetail: async (req, res) => {
    try {
      const order = await OrderObject.getOneOrderBy({ _id: req.params.id })
      if (order) {
        const createdDetail = await OrderDetailObject.create({ ...req.body, orderId: order.id })
        if (createdDetail) {
          return res.status(201).json(createdDetail)
        }

        // Not found
        throw new Error("Failed to create order detail.")
      }

      throw new NotFoundError("No order found.")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc    Update orderDetail by Id
  // @route   PUT /orders/:id/details/:detailId
  updateOrderDetailById: async (req, res) => {
    try {
      const order = await OrderObject.getOneOrderBy({ _id: req.params.id })
      if (order) {
        const orderDetail = await OrderDetailObject.getOneOrderDetailBy({
          _id: req.params.detailId,
          orderId: req.params.id,
        })
        if (orderDetail) {
          const isUpdated = await orderDetail.update({ ...req.body })
          if (isUpdated) {
            return res.sendStatus(204)
          }

          throw new Error("Failed to update order detail.")
        }
        // Not found
        throw new NotFoundError("No order detail found.")
      }

      throw new NotFoundError("No order found.")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc    Delete orderDetail by Id
  // @route   DELETE /orders/:id/details/:detailId
  removeOrderDetailById: async (req, res) => {
    try {
      const order = await OrderObject.getOneOrderBy({ _id: req.params.id })
      if (order) {
        const orderDetail = await OrderDetailObject.getOneOrderDetailBy({
          _id: req.params.detailId,
          orderId: req.params.id,
        })
        if (orderDetail) {
          const isRemoved = await orderDetail.remove()
          if (isRemoved) {
            return res.sendStatus(204)
          }

          throw new Error("Failed to remove order detail.")
        }
        // Not found
        throw new NotFoundError("No order detail found.")
      }

      throw new NotFoundError("No order found.")
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },
}
