const router = require('express').Router()
const { showOrderStatistics,showYearlyStatistics, showSalesAnalytics, getCombineChartData } 
= require('../../controllers/statistics.controller')

// @desc    Show list of orders
// @route   GET /statistics/order
router.get('/order', showOrderStatistics)

// @desc    Show list of orders
// @route   GET /statistics/order
router.get('/yearly', showYearlyStatistics)

// @desc    Show sales analytics
// @route   GET /statistics/sales-analytics
router.get('/sales-analytics', showSalesAnalytics)
// @desc    Show sales analytics
// @route   GET /statistics/get-combine-chart-data
router.get('/get-combine-chart-data', getCombineChartData)

module.exports = router