const axiosInstance = require('../../helper/axios.helper')
const helper = require('../../helper/helper')

module.exports = {
  resetPassword: async (req, res, next) => {
    try {
      console.log(req.query)
      const response = await axiosInstance.get(
        `/reset-password?email=${req.query.email}&confirmString=${req.query.confirmString}`)

        if (response.status === 204) {
          // render update password page
          return res.send('Done')
        }

    } catch (error) {
      console.log(error)
      return helper.handleErrors(res, error, 'admin')
    }
  }
}