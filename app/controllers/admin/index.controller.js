const axiosInstance = require("../../helper/axios.helper")
const { getUserInstance, handleErrors } = require("../../helper/helper")
const getLatestOrder = async (accessToken) => {
  try {
    const response = await axiosInstance.get(`/admin/orders/`, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })

    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    throw error
  }
}
const getOrderStatistics = async (accessToken) => {
  try {
    const response = await axiosInstance.get(`/admin/statistics/order`, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })

    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    throw error
  }
}
const getYearlyStatistics = async (accessToken) => {
	try {
		const response = await axiosInstance.get(`/admin/statistics/yearly`, {
			headers: {
				Authorization: "Bearer " + accessToken
			}
		})

		if(response.status === 200) {
			return response.data
		}
	} catch (error) {
		throw error
	}
}
const getSalesAnalytics = async (accessToken) => {
	try {
		const response = await axiosInstance.get(`/admin/statistics/sales-analytics`, {
			headers: {
				Authorization: "Bearer " + accessToken
			}
		})

		if(response.status === 200) {
			return response.data
		}
	} catch (error) {
		throw error
	}
}
const getCombineChartData = async (accessToken) => {
	try {
		const response = await axiosInstance.get(`/admin/statistics/get-combine-chart-data`, {
			headers: {
				Authorization: "Bearer " + accessToken
			}
		})

		if(response.status === 200) {
			return response.data
		}
	} catch (error) {
		throw error
	}
}

module.exports = {
  // @desc:   show index page
  // @route:  GET ['/','/index','/home']
  showIndexPage: async (req, res) => {
    try {
      const latestOrders = await getLatestOrder(req.user.accessToken)
      return res.render("templates/admin/index", {
        layout: "admin/index.layout.hbs",
        user: await getUserInstance(req),
				latestOrders: latestOrders,
				orderStatistics: await getOrderStatistics(req.user.accessToken),
				yearlyStatistics: await getYearlyStatistics(req.user.accessToken),
				salesAnalytics: await getSalesAnalytics(req.user.accessToken),
				combineChartData: await getCombineChartData(req.user.accessToken),
      })
    } catch (error) {
      return handleErrors(res, error, "admin")
    }
  },
}
