const NotFoundError = require("../errors/not_found")
const ErrorHandler = require("../helper/errorHandler")
const StatisticsObject = require("../objects/StatisticsObject")

module.exports = {
  // @desc:   Show orders statistics
  // @route   GET /statistics/order
  showOrderStatistics: async (req, res) => {
    try {
      const statisticsData = await StatisticsObject.getOrderStats()
      if (statisticsData) {
        return res.status(200).json(statisticsData)
      }
      return res.status(200).json(null)
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc:   Show yearly statistics
  // @route   GET /statistics/yearly
  showYearlyStatistics: async (req, res) => {
    try {
      const statisticsData = await StatisticsObject.getYearlyStats()
      if (statisticsData) {
        return res.status(200).json(statisticsData)
      }
      return res.status(200).json(null)
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc:   Show sales analytics
  // @route   GET /statistics/sales-analytics
  showSalesAnalytics: async (req, res) => {
    try {
      const statisticsData = await StatisticsObject.getSaleAnalytics()
      if (statisticsData) {
        return res.status(200).json(statisticsData)
      }
      return res.status(200).json(null)
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

  // @desc:   Show sales analytics
  // @route   GET /statistics/get-combine-chart-data
  getCombineChartData: async (req, res) => {
    try {
      const statisticsData = await StatisticsObject.getCombineChartData()
      if (statisticsData) {
        return res.status(200).json(statisticsData)
      }
      return res.status(200).json(null)
    } catch (error) {
      return ErrorHandler.sendErrors(res, error)
    }
  },

}
