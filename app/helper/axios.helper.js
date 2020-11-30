const axios = require("axios")
const axiosInstance = axios.create({
  baseURL: `${process.env.BASE_URL}:${process.env.API_SERVER_PORT}/api`,
  timeout: 60000,
  validateStatus: function (status) {
    return status < 400 // Resolve only if the status code is less than 400
  },
})

module.exports = axiosInstance
