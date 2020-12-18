const axiosInstance = require("../../helper/axios.helper")
const { handleErrors, getMenu, handleInvalidationErrors, getValidFields, getUserInstance } = require("../../helper/helper")
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
let totalCost = 0
let checkoutData = {}

const getShippingCost = async function () {
  try {
    let shippingCost = 0
    const response = await axiosInstance.get(`/get-shipping-cost`)
    if (response.status === 200) {
      shippingCost = parseFloat(response.data)
    }

    return shippingCost
  } catch (error) {
    throw error
  }
}
const getCheckoutData = function (reqQuery) {
  return {
    productList: JSON.parse(reqQuery.checkoutData),
    deliveryInfo: {
      address: {
        street: reqQuery.street,
        district: reqQuery.district,
        city: reqQuery.city,
        country: reqQuery.country,
        postalCode: reqQuery.postalCode,
      },
      profile: {
        firstName: reqQuery.firstName,
        lastName: reqQuery.lastName,
        phoneNumber: reqQuery.phoneNumber,
        email: reqQuery.email,
        userId: reqQuery.userId
      }
    },
    voucherCode: reqQuery.voucherCode
  }
}
const calculateTotalCost = async function (productList = []) {
  try {
    if (productList && productList.length > 0) {
      const response = await axiosInstance.post(`/calculate-total-cost`, productList)

      if (response.status === 200) {
        return response.data
      }

    }

    return null 
  } catch (error) {
    throw error
  }
}
module.exports = {
  showCart: async (req, res) => {
    try {
      let user = null
      if (req.isAuthenticated() && req.user.role === "user") {
        try {
          user = await getUserInstance(req)
        } catch (error) {
          user = null
        }
      }

      return res.render("templates/client/cart/cart", {
        layout: "client/index.layout.hbs",
        cart: "address",
        user: user,
        categories: await getMenu(),
        shippingCost: await getShippingCost(),
        csrfToken: req.csrfToken()
      })
    } catch (error) {
      return handleErrors(res, error, "client")
    }
  },

  showCheckoutPage: async function (req, res) {
    if(req.query.checkoutData == null || JSON.parse(req.query.checkoutData).length < 1) {
      req.flash('fail', 'No item to checkout')
      return res.redirect('/cart')
    }

    const { productList, deliveryInfo, voucherCode} = getCheckoutData(req.query)
    try {
      // Validate info
      const response  = await axiosInstance.post(`/validate-delivery-info`, deliveryInfo) 

      if (response.status === 200) {
        checkoutData = getCheckoutData(req.query)
        const costs = await calculateTotalCost(productList)
        if (costs && costs.finalCost > 0) {
          totalCost = costs.finalCost * 100 // (convert to pennies)
          // If voucher applied
          if (voucherCode != null) {
            const isValidVoucher = await axiosInstance.get(`/validate-voucher-code?voucherCode=${voucherCode}&totalCost=${totalCost}`)

            if (isValidVoucher.status === 200) {
              totalCost -= isValidVoucher.data.discountValue
            }
          }
        }
        
        return res.render("templates/client/cart/cart", {
          layout: "client/index.layout.hbs",
          cart: "checkout",
          publishable_key: process.env.STRIPE_PUBLISHABLE_KEY,
          csrfToken: req.csrfToken()
        })
      }
    } catch (error) {
      if(error.response.status === 400) {
        const errors = error.response.data.error.invalidation
        const validData = deliveryInfo

        return res.render("templates/client/cart/cart", {
          layout: "client/index.layout.hbs",
          cart: "address",
          user: (req.isAuthenticated()) ? await getUserInstance(req) : null,
          categories: await getMenu(),
          shippingCost: await getShippingCost(),
          errors: handleInvalidationErrors(errors),
          validData: validData
        })
      }
      return handleErrors(res, error, "client")
    }
  },

  checkout: async (req, res) => {
    try {
      // const { productList, deliveryInfo, voucherCode} = checkoutData
      // Add payment method
      checkoutData.paymentMethod = { method: req.body.paymentMethod }
      if (req.body.paymentMethod === 'CARD') {
        checkoutData.paymentMethod.paymentIntentId = req.body.paymentIntentId
      }
    
      const response = await axiosInstance.post(`/checkout`, {
        // productList, deliveryInfo, paymentMethod
        ...checkoutData
      })

      if(response.status === 201) {
        return res.render("templates/client/cart/cart", {
          layout: "client/index.layout.hbs",
          cart: "finish",
          user: (req.isAuthenticated()) ? await getUserInstance(req) : null,
          categories: await getMenu(),
          orderId: response.data.id
        })
      }
    } catch (error) {
      return handleErrors(res, error, 'client')
    }
  },

  createPaymentIntent: async (req, res) => {
    if (totalCost > 0) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalCost,
        currency: 'usd',
        // Verify your integration in this guide by including this parameter
        metadata: {integration_check: 'accept_a_payment'},
      });
      res.json({client_secret: paymentIntent.client_secret});
    } else {
      res.status(500).end()
    }
  },

  validateVoucherCode: async (req ,res) => {
    try {
      const response = await axiosInstance.get(`/validate-voucher-code?voucherCode=${req.query.voucherCode}&totalCost=${req.query.totalCost}`)

      if(response.status === 200) {
        if (response.data.error != null) {
          return res.status(400).json(response.data.error)
        }

        return res.status(200).json(response.data)
      }

      return res.status(404).end()
    } catch (error) {
      if (error.response.status === 404) {
        return res.status(404).json(error.response.data.error)
      }
      return res.status(error.response.status).end()
    }
  }
}
