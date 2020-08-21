const router = require('express').Router({mergeParams: true})
const { showOrderDetailList, getOrderDetailById, createNewOrderDetail, updateOrderDetailById, 
    removeOrderDetailById, isExistentOrder } 
    = require('../../controllers/order_detail.controller')

router.use(isExistentOrder)

// @desc    Show list of orderDetails by orderId
// @route   GET /orders/:id/details
router.get('/', showOrderDetailList)

// @desc    Get orderDetail by Id
// @route   GET /orders/:id/details/:detailId
router.get('/:detailId', getOrderDetailById)

// @desc    Add new orderDetail
// @route   POST /orders/:id/details
router.post('/', createNewOrderDetail)

// @desc    Update orderDetail
// @route   PUT /orders/:id/details/:detailId
router.put('/:detailId', updateOrderDetailById)

// @desc    Delete orderDetail
// @route   DELETE /orders/:id/details/:detailId
router.delete('/:detailId', removeOrderDetailById)

module.exports = router