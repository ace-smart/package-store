const axiosInstance = require("../../helper/axios.helper")
const { handleErrors, getMenu, handleInvalidationErrors, getValidFields, getUserInstance } = require("../../helper/helper")

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
    }
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
      })
    } catch (error) {
      return handleErrors(res, error, "client")
    }
  },

  showCheckoutPage: async (req, res) => {
    if(req.query.checkoutData == null || JSON.parse(req.query.checkoutData).length < 1) {
      req.flash('fail', 'No item to checkout')
      return res.redirect('/cart')
    }

    const { productList, deliveryInfo} = getCheckoutData(req.query)
    try {
      // Validate info
      const response  = await axiosInstance.post(`/validate-delivery-info`, deliveryInfo) 

      if (response.status === 200) {
        // req.session.checkoutData = {deliveryInfo, productList}
        return res.render("templates/client/cart/cart", {
          layout: "client/index.layout.hbs",
          cart: "checkout",
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
      const { productList, deliveryInfo} = getCheckoutData(req.query)
      let paymentMethod = {method: req.body.paymentMethod}
      if (paymentMethod.method === 'CREDITCARD') {
        paymentMethod.cardInfo = {
          nameOnCard: req.body.nameOnCard,
          cardNumber: req.body.cardNumber,
          validUntil: {
            month: req.body['validUntil-month'],
            year: req.body['validUntil-year']
          },
          cvv: req.body.cvv
        }
      }

      const response = await axiosInstance.post(`/checkout`, {
        productList, deliveryInfo, paymentMethod
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

}
