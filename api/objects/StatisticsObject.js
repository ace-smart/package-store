const OrderModel = require('../models/OrderModel')
const RestockModel = require('../models/RestockModel')
const UserModel = require('../models/UserModel')
class StatisticsObject {
  constructor() {

  }

  static async getOrderStats() {
    try {
      // Cancelled orders
      const cancelledOrderStat = await OrderModel.aggregate([
				{ $match: {status: "cancelled"} },
				{ $lookup: {
					from: 'orderdetails',
					localField: '_id',
          foreignField: 'orderId',
					as: 'details'
        }},
        // $count = ($group -> $project)
				{ $group: {
          _id: null,
          numOfOrders: {$sum: 1},
					purchasedAmount: {$sum: {$arrayElemAt: ["$details.amount", 0]}},
					revenue: {$sum: "$finalCost"}
				} },
        { $project: {_id: 0}},
        {$limit: 1}
			])
      
      // Done orders
      const doneOrderStat = await OrderModel.aggregate([
				{ $match: {status: "done"} },
				{ $lookup: {
					from: 'orderdetails',
					localField: '_id',
          foreignField: 'orderId',
					as: 'details'
        }},
        // $count = ($group -> $project)
				{ $group: {
          _id: null,
          numOfOrders: {$sum: 1},
					purchasedAmount: {$sum: {$arrayElemAt: ["$details.amount", 0]}},
					revenue: {$sum: "$finalCost"}
				} },
        { $project: {_id: 0}}
      ])

      const importStat = await RestockModel.aggregate([
        {$match: {action: "import"}},
        { $lookup: {
					from: 'products',
					localField: 'productId',
          foreignField: '_id',
					as: 'products'
        }},
        {$group: {
          _id: null,
          importNumbers: {$sum: "$amount"},
          totalValue: {$sum: {$arrayElemAt: ["$products.price", 0]}},
          totalProducts: {$sum: 1}
        }},
        {$project: {_id: 0}}
      ])

      const anonymousUserStat = await OrderModel.aggregate([
        {$match: {userId: null}},
				{ $lookup: {
					from: 'orderdetails',
					localField: '_id',
          foreignField: 'orderId',
					as: 'details'
        }},
        {$group: {
          _id: null,
          purchasedAmount: {$sum: {$arrayElemAt: ["$details.amount", 0]}},
          totalValue: {$sum: "$finalCost"},
          numOfUsers: {$sum: 1}
        }},
        {$project: {_id: 0}}
      ])
      
      return  {
				cancelledOrders: cancelledOrderStat[0],
				doneOrders: doneOrderStat[0],
				imports: importStat[0],
				anonymousUsers: anonymousUserStat[0]
      } 
      
    } catch (error) {
			throw error
		}
  }

  static async getYearlyStats() {
    const initialObject = { current: null, last: null, diff: null}
    const currentYear = (new Date()).getFullYear()
    const currentCriteria = {$gte: new Date(currentYear,0,1), $lte: new Date(currentYear,11,31)}
    const lastCriteria = {$gte: new Date(currentYear - 1,0,1), $lte: new Date(currentYear - 1,11,31)}
    try {
      // Total sales - Total orders - Total users - Total anonymous users
      // Total sales
      let totalSales = Object.assign({}, initialObject)
      totalSales.current = (await OrderModel.aggregate([
        {$match: {createdAt: currentCriteria, status: "done"}},
        {$lookup: {
          from: "orderdetails",
          localField: "_id",
          foreignField: "orderId",
          as: "details"
        }},
        {$group: {
          _id: null,
          totalSales: {$sum: {$arrayElemAt: ["$details.amount", 0]}},
          revenue: {$sum: "$finalCost"}
        }},
        {$project: {_id: 0}}
      ]))[0]
      totalSales.last = (await OrderModel.aggregate([
        {$match: {createdAt: lastCriteria, status: "done"}},
        {$lookup: {
          from: "orderdetails",
          localField: "_id",
          foreignField: "orderId",
          as: "details"
        }},
        {$group: {
          _id: null,
          totalSales: {$sum: {$arrayElemAt: ["$details.amount", 0]}},
          revenue: {$sum: "$finalCost"}
        }},
        {$project: {_id: 0}}
      ]))[0]
      
      // Reassign if the query return 'undefined' 
      totalSales.current = (totalSales.current != null) ? totalSales.current : {totalSales: 0, revenue: 0}
      totalSales.last = (totalSales.last != null) ? totalSales.last : {totalSales: 0, revenue: 0}
      // Calculate the diff 
      if (totalSales.current != null && totalSales.last != null) {
        const saleDiff = (totalSales.current.totalSales  - totalSales.last.totalSales) / (totalSales.last.totalSales) * 100
        // Check whether the data existent
        totalSales.diff = (saleDiff === Infinity) ? (totalSales.current.totalSales * 100) : saleDiff
      } else {
        totalSales.diff = 0
      }

      // Total orders
      let totalOrders = Object.assign({}, initialObject)
      totalOrders.current = (await OrderModel.aggregate([
        {$match: {createdAt: currentCriteria, status: "done"}},
        {$group: {
          _id: null,
          totalOrders: {$sum: 1},
          revenue: {$sum: "$finalCost"}
        }},
        {$project: {_id: 0}}
      ]))[0]
      totalOrders.last = (await OrderModel.aggregate([
        {$match: {createdAt: lastCriteria, status: "done"}},
        {$group: {
          _id: null,
          totalOrders: {$sum: 1},
          revenue: {$sum: "$finalCost"}
        }},
        {$project: {_id: 0}}
      ]))[0]
      
      // Reassign if the query return 'undefined' 
      totalOrders.current = (totalOrders.current != null) ? totalOrders.current : {totalOrders: 0, revenue: 0}
      totalOrders.last = (totalOrders.last != null) ? totalOrders.last : {totalOrders: 0, revenue: 0}
      // Calculate the diff 
      if (totalOrders.current != null && totalOrders.last != null) {
        const orderDiff = (totalOrders.current.totalOrders  - totalOrders.last.totalOrders) / (totalOrders.last.totalOrders) * 100
        // Check whether the data existent
        totalOrders.diff = (orderDiff === Infinity) ? (totalOrders.current.totalOrders * 100) : orderDiff
      } else {
        totalOrders.diff = 0
      }
      
      // Total users
      let totalUsers = Object.assign({}, initialObject)
      totalUsers.current = (await UserModel.aggregate([
        {$match: {createdAt: currentCriteria}},
        {$lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "userId",
          as: "orders"
        }},
        {$group: {
          _id: null,
          totalUsers: {$sum: 1},
          revenue: {$sum: {$arrayElemAt: ["$orders.finalCost", 0]}}
        }},
        {$project: {_id: 0}}
      ]))[0]
      totalUsers.last = (await UserModel.aggregate([
        {$match: {createdAt: lastCriteria}},
        {$lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "userId",
          as: "orders"
        }},
        {$group: {
          _id: null,
          totalUsers: {$sum: 1},
          revenue: {$sum: {$arrayElemAt: ["$orders.finalCost", 0]}}
        }},
        {$project: {_id: 0}}
      ]))[0]
      
      // Reassign if the query return 'undefined' 
      totalUsers.current = (totalUsers.current != null) ? totalUsers.current : {totalUsers: 0, revenue: 0}
      totalUsers.last = (totalUsers.last != null) ? totalUsers.last : {totalUsers: 0, revenue: 0}
      // Calculate the diff 
      if (totalUsers.current != null && totalUsers.last != null) {
        const userDiff = (totalUsers.current.totalUsers  - totalUsers.last.totalUsers) / (totalUsers.last.totalUsers) * 100
        // Check whether the data existent
        totalUsers.diff = (userDiff === Infinity) ? (totalUsers.current.totalUsers * 100) : userDiff
      } else {
        totalUsers.diff = 0
      }

      // Total anonymous users
      let totalAnonymous = Object.assign({}, initialObject)
      totalAnonymous.current = (await OrderModel.aggregate([
        {$match: {createdAt: currentCriteria, userId: null, status: "done"}},
        {$group: {
          _id: null,
          totalAnonymous: {$sum: 1},
          revenue: {$sum: "$finalCost"}
        }},
        {$project: {_id: 0}}
      ]))[0]
      totalAnonymous.last = (await OrderModel.aggregate([
        {$match: {createdAt: lastCriteria, userId: null, status: "done"}},
        {$group: {
          _id: null,
          totalAnonymous: {$sum: 1},
          revenue: {$sum: "$finalCost"}
        }},
        {$project: {_id: 0}}
      ]))[0]
      
      // Reassign if the query return 'undefined' 
      totalAnonymous.current = (totalAnonymous.current != null) ? totalAnonymous.current : {totalAnonymous: 0, revenue: 0}
      totalAnonymous.last = (totalAnonymous.last != null) ? totalAnonymous.last : {totalAnonymous: 0, revenue: 0}
      // Calculate the diff 
      if (totalAnonymous.current != null && totalAnonymous.last != null) {
        const anonymousDiff = (totalAnonymous.current.totalAnonymous  - totalAnonymous.last.totalAnonymous) / (totalAnonymous.last.totalAnonymous) * 100
        // Check whether the data existent
        totalAnonymous.diff = (anonymousDiff === Infinity) ? (totalAnonymous.current.totalAnonymous * 100) : anonymousDiff
      } else {
        totalAnonymous.diff = 0
      }

      return {
        totalSalesData: {...totalSales.current, diff: totalSales.diff}, 
        totalOrdersData: {...totalOrders.current, diff: totalOrders.diff}, 
        totalUsersData: {...totalUsers.current, diff: totalUsers.diff}, 
        totalAnonymousData: {...totalAnonymous.current, diff: totalAnonymous.diff}
      }
    } catch (error) {
      throw error
    }
  }

  static async getSaleAnalytics() {
    const currentYear = (new Date()).getFullYear()
    const currentCriteria = {$gte: new Date(currentYear,0,1), $lte: new Date(currentYear,11,31)}
    let totalNum = 0 
    let totalValue = 0 
    let analyticsData = {}
    try {
      let saleAnalyticsData = await OrderModel.aggregate([
        { $match: { createdAt: currentCriteria } },
        {
          $group: {
            _id: "$status",
            totalValue: { $sum: "$finalCost" },
            num: { $sum: 1 },
          },
        },
        { $project: { _id: 1, totalValue: 1, num: 1 } }
      ])
      
      if (saleAnalyticsData && saleAnalyticsData.length > 0) {
        // Total num and value
        saleAnalyticsData.forEach(value => {
          totalNum += value.num
          totalValue += value.totalValue
        })
        // percentage
        saleAnalyticsData.map(value => {
          analyticsData[value._id] = {
            totalValue: value.totalValue,
            percentData: (value.num / totalNum) * 100
          }
        })
      }

      analyticsData.totalNum = totalNum
      analyticsData.totalValue = totalValue

      return analyticsData
    } catch (error) {
      throw error
    }
  }

  // Get total revenue form order and the cost from restocking
  static async getCombineChartData() {
    try {
      const currentYear = (new Date()).getFullYear()
      const currentCriteria = {$gte: new Date(currentYear,0,1), $lte: new Date(currentYear,11,31)}
      
      let anonymousRevenue = await OrderModel.aggregate([
        {$match: {createdAt: currentCriteria, status: "done", userId: null}},
        {$group: {
          _id: {$month: "$createdAt"},
          revenue: {$sum: "$finalCost"}
        }}
      ])

      let userRevenue = await OrderModel.aggregate([
        {$match: {createdAt: currentCriteria, status: "done", userId: {$ne: null}}},
        {$group: {
          _id: {$month: "$createdAt"},
          revenue: {$sum: "$finalCost"}
        }}
      ])

      let restockCost = await RestockModel.aggregate([
        {$match: {createdAt: currentCriteria, status: "activated", action: "import"}},
        {$lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "products"
        }},
        {$group: {
          _id: {$month: "$createdAt"},
          totalCost: {$sum: {$multiply: [{$arrayElemAt: ["$products.price", 0]}, "$amount"]}}
        }}
      ])

      return {
        anonymous: StatisticsObject.sortChartData(anonymousRevenue),
        user: StatisticsObject.sortChartData(userRevenue),
        restock: StatisticsObject.sortChartData(restockCost)
      }
    } catch (error) {
      throw error
    }
  }

  static sortChartData(arrayElement) {
    let resultArray = []

    for(let i = 0; i < 12; i++){
      arrayElement.forEach(element => {
        if(i === element._id - 1) {
          if(element.revenue != null) {
            resultArray[i] = element.revenue
          } else if (element.totalCost != null) {
            resultArray[i] = element.totalCost
          }
        } else {
          resultArray[i] = 0
        }
      })
    }

    return resultArray
  }
}

module.exports = StatisticsObject