const OrderDetail = require("../models/OrderDetailModel")
const Order = require("../models/OrderModel")
const { validate_add_inp, validate_update_inp } = require("../validation/order_detail")
const sanitize = require("../validation/sanitize")
const { outputErrors, isExistent } = require("../validation/validation")

module.exports = {
    isExistentOrder: async (req, res, next) => {
        if (await isExistent(Order, { _id: req.params.id })) {
            return next()
        }
        return res.status(404).json({ success: false, message: "Order is not existent." })
    },

    // @desc:   Show all order details
    // @route   GET /orders/:id/details
    showOrderDetailList: async (req, res) => {
        try {
            const order_details = await OrderDetail.find({ orderId: req.params.id }).lean()
            return res.status(200).json({ success: true, order_details: order_details })
        } catch (error) {
            return res.status(500).json({ success: false, message: outputErrors(error) })
        }
    },

    // @desc:   Get order details by Id
    // @route   GET /orders/:id/details/:detailId
    getOrderDetailById: async (req, res) => {
        try {
            const orderDetail = await OrderDetail.findOne({ _id: req.params.detailId }).lean()
            if (orderDetail)
                return res.status(200).json({
                    success: true,
                    orderDetail: orderDetail,
                })
            // Not found
            return res.status(404).json({ success: false, message: "No orderDetail found." })
        } catch (error) {
            return res.status(500).json({ success: false, message: outputErrors(error) })
        }
    },

    // @desc    Add new orderDetail
    // @route   POST /orders/:id/details
    createNewOrderDetail: async (req, res) => {
        try {
            const isValidInp = await validate_add_inp({ ...req.body })
            if (isValidInp) {
                const orderDetail = sanitize.orderDetail({ ...req.body }, "create")
                orderDetail.orderId = req.params.id
                const newOrderDetail = await OrderDetail.create(orderDetail)
                return res.status(201).json({
                    success: true,
                    orderDetail: newOrderDetail,
                })
            }
        } catch (error) {
            return res.status(500).json({ success: false, message: outputErrors(error) })
        }
    },

    // @desc    Update orderDetail by Id
    // @route   PUT /orders/:id/details/:detailId
    updateOrderDetailById: async (req, res) => {
        try {
            const orderDetail = await OrderDetail.findOne({ _id: req.params.detailId }).lean()
            if (orderDetail) {
                const isValidInp = await validate_update_inp({ ...req.body }, orderDetail.detailId)
                if (isValidInp) {
                    await OrderDetail.findOneAndUpdate(
                        { _id: req.params.detailId },
                        sanitize.orderDetail({ ...req.body }, "update")
                    )
                    return res.sendStatus(204)
                }
            }
            return res.status(404).json({ success: false, message: 'No detail found' })
        } catch (error) {
            return res.status(500).json({ success: false, message: outputErrors(error) })
        }
    },

    // @desc    Delete orderDetail by Id
    // @route   DELETE /orders/:id/details/:detailId
    removeOrderDetailById: async (req, res) => {
        try {
            const orderDetail = await OrderDetail.findOneAndDelete({ _id: req.params.detailId })

            return res.sendStatus(204)
        } catch (error) {
            return res.status(500).json({ success: false, message: outputErrors(error) })
        }
    },
}
