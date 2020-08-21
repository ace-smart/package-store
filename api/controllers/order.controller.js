const Order = require("../models/OrderModel")
const {validate_add_inp, validate_update_inp} = require("../validation/order")
const sanitize = require("../validation/sanitize")
const { outputErrors } = require("../validation/validation")

module.exports = {
    // @desc:   Show orders
    // @route   GET /orders
    showOrderList: async (req, res) => {
        try {
            const orders = await Order.find().lean()
            return res.status(200).json({ success: true, orders: orders })
        } catch (error) {
            return res.status(500).json({ success: false, message: outputErrors(error) })
        }
    },

    // @desc:   Get orders by Id
    // @route   GET /orders/:id
    getOrderById: async (req, res) => {
        try {
            const order = await Order.findOne({ _id: req.params.id }).lean()
            if (order)
                return res.status(200).json({
                    success: true,
                    order: order,
                })
            // Not found
            return res.status(404).json({ success: false, message: "No order found." })
        } catch (error) {
            return res.status(500).json({ success: false, message: outputErrors(error) })
        }
    },

    // @desc    Add new address
    // @route   POST /orders
    createNewOrder: async (req, res) => {
        try {
            const isValidInp = await validate_add_inp({ ...req.body })
            if (isValidInp) {
                const newOrder = await Order.create(
                    sanitize.order({ ...req.body }, "create")
                )
                return res.status(201).json({
                    success: true,
                    order: newOrder,
                })
            }
        } catch (error) {
            return res.status(500).json({ success: false, error: outputErrors(error) })
        }
    },

    // @desc    Update order
    // @route   PUT /orders/:id
    updateOrderById: async (req, res) => {
        try {
            const order = await Order.findOne({ _id: req.params.id }).lean()
            const isValidInp = await validate_update_inp({ ...req.body }, order._id)
            if (isValidInp) {
                await Order.findOneAndUpdate(
                    { _id: req.params.id },
                    sanitize.order({ ...req.body }, "update")
                )
                return res.sendStatus(204)
            }
        } catch (error) {
            return res.status(500).json({ success: false, message: outputErrors(error) })
        }
    },

    // @desc    Delete order
    // @route   DELETE /orders/:id
    removeOrderById: async (req, res) => {
        try {
            const order = await Order.findOneAndDelete({ _id: req.params.id })

            return res.sendStatus(204)
        } catch (error) {
            return res.status(500).json({ success: false, message: outputErrors(error) })
        }
    },
}
