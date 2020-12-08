const axiosInstance = require("../../helper/axios.helper")
const { getUserInstance, handleErrors, handleInvalidationErrors, getMenu } = require("../../helper/helper")
const getAllProducts = async function() {
  try {
    const response = await axiosInstance.get(`/all-products`)
    if(response.status === 200) {
      return response.data
    }

    return null
  } catch (error) {
    throw error
  }
}
const getBestSellers = async function() {
  try {
    const response = await axiosInstance.get(`/get-best-sellers`)
    if (response.status === 200) {
      return response.data
    }

    return null
  } catch (error) {
    throw error
  }
}
const getProductsBySubcategoryId = async function() {
  try {
    const categories = await getMenu()
    let products = []
    for(let i = 0; i < 4; i++) {
      const response = await axiosInstance.get(`/products-by-category?categoryId=${categories[i].id}`)
      if (response.status === 200) {
        products.push({
          categoryId: categories[i].id,
          categoryName: categories[i].name,
          products: response.data
        })
      }
    }

    return products
  } catch (error) {
    throw error
  }
}
module.exports = {
  // @desc:   show index page
  // @route:  GET ['/','/index','/home']
  showIndexPage: async (req, res) => {
    let user = null
    if (req.isAuthenticated() && req.user.role === 'user') {
        try {
            user = await getUserInstance(req)
        } catch (error) {
            user = null
        }
    }


    return res.render("templates/client/index/index.hbs", {
      layout: "client/index.layout.hbs",
      user: user,
      categories: await getMenu(),
      bestSellers: await getBestSellers(),
      allProducts: await getAllProducts(),
      newCollection: await getProductsBySubcategoryId()
    })
  },

  // @desc:   show contact page
  // @route:  GET /contact
  showContactPage: (req, res) => {
    return res.render("templates/client/contact/contact.hbs", {
      layout: "client/index.layout.hbs",
      csrfToken: req.csrfToken(),
      pageTitle: "Contact",
      breadcrumb: [
        {link: '/', routeName: 'Home'},
        {link: '/contact', routeName: 'Contact'}
      ]
    })
  },

  // @desc:   Leave messages
  // @route:  POST /contact
  contact: async(req, res) => {
    try {
      const response = await axiosInstance.post(`/leave-message`, req.body)
      if(response.status === 201) {
        req.flash('success', 'Thank you for reaching out to us. Please wait for our response.')
        return res.redirect('/contact')
      }
    } catch (error) {
      if(error.response.status === 400) {
        req.flash('fail', 'Your input is not valid.')
        return res.render('templates/client/contact/contact.hbs', {
          layout: 'client/index.layout.hbs',
          csrfToken: req.csrfToken(),
          errors: handleInvalidationErrors(error.response.data.error.invalidation)
        })
      }
      return handleErrors(res, error, 'user')
    }
  },

  // @desc:   show about page
  // @route:  GET /about
  showAboutPage: (req, res) => {
    return res.render("templates/client/index/about.hbs", {
      layout: "client/index.layout.hbs",
      pageTitle: 'About us',
      breadcrumb: [
        {link: '/', routeName: 'Home'},
        {link: '/about', routeName: 'About'},
      ]
    })
  },

  // @desc:   show about page
  // @route:  GET /faqs
  showFAQsPage: (req, res) => {
    return res.render("templates/client/index/faq.hbs", {
      layout: "client/index.layout.hbs",
      pageTitle: "FAQ",
      breadcrumb: [
        {link: '/', routeName: 'Home'},
        {link: '/faqs', routeName: 'FAQs'}
      ]
    })
  },
}
