const { resolveContent } = require('nodemailer/lib/shared')
const axiosInstance = require('../../helper/axios.helper')
const helper = require('../../helper/helper')
const getRestockById = async function(accessToken, restockId) {
    try {
        const response = await axiosInstance.get(`/admin/restocks/${restockId}`, {
            headers: {
                Authorization: "Bearer " + accessToken
            }
        })        
        if (response.status === 200) {
            return response.data
        }
    } catch (error) {
        throw error
    }
}
const getRestockData = function(reqBody) {
    reqBody = JSON.parse(JSON.stringify(reqBody))
    return {
      productId: reqBody.productId,
      amount: parseInt(reqBody.amount),
      action: reqBody.action,
      status: reqBody.status
    }
}
const getProducts = async function(accessToken) {
  try {
    const response = await axiosInstance.get(`/admin/products`,{
      headers: {
        Authorization: "Bearer " + accessToken
      }
    })

    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    return null
  }
}
module.exports = { 
    // @desc:   Show restocks
    // @route   GET /restocks
    showRestockList: async (req, res) => {
        try {
          const response = await axiosInstance.get(`/admin/restocks`, {
            headers: {
              Authorization: "Bearer " + req.user.accessToken
            }
          })
          
          if (response.status === 200) {
            return res.render("templates/admin/restock/restock.hbs", {
              layout: "admin/main.layout.hbs",
              content: "list",
              header: "List of restockings",
              route: "restocks",
              restocks: response.data,
              user: await helper.getUserInstance(req),
              csrfToken: req.csrfToken()
            })
          }
        } catch (error) {
          return helper.handleErrors(res, error, 'admin')
        }
    },

    // @desc:   Get restocks by Id
    // @route   GET /restocks/:id
    viewRestockById: async (req, res) => {
        // res.render('templates/admin/restock',{
        //     layout: 'admin/table.layout.hbs'
        // })
    },

    // @desc    show create form
    // @route   GET /restocks/add
    showCreateRestockForm: async (req, res) => {
      return res.render("templates/admin/restock/restock.hbs", {
        layout: "admin/main.layout.hbs",
        content: "form",
        formType: "create",
        header: "Add a new restock",
        route: "restocks",
        products: await getProducts(req.user.accessToken),
        user: await helper.getUserInstance(req),
        csrfToken: req.csrfToken()
      })
    },

    // @desc    create form
    // @route   POST /restocks/add
    createRestock: async (req, res) => {
      let restockData = getRestockData(req.body)
      try {
        const response = await axiosInstance.post(`/admin/restocks`,
        restockData,
         {
          headers: {
            Authorization: "Bearer " + req.user.accessToken
          }
        })

        if (response.status === 201) {
          req.flash("success", "You have created a new restock.")
          return res.render("templates/admin/restock/restock.hbs", {
            layout: "admin/main.layout.hbs",
            content: "form",
            formType: "create",
            header: "Add a new restock",
            route: "restocks",
            products: await getProducts(req.user.accessToken),
            user: await helper.getUserInstance(req),
            csrfToken: req.csrfToken()
          })
        }
      } catch (error) {
        if (error.response.status === 400) {
          const errors = error.response.data.error.invalidation
          const validData = helper.getValidFields(errors, restockData)

          req.flash("fail", "Your input is not valid. Please check and then fill in again.")
          return res.render("templates/admin/restock/restock.hbs", {
            layout: "admin/main.layout.hbs",
            content: "form",
            formType: "create",
            header: "Add a new restock",
            route: "restocks",
            user: await helper.getUserInstance(req),
            csrfToken: req.csrfToken(),
            products: await getProducts(req.user.accessToken),
            errors: helper.handleInvalidationErrors(errors),
            validData: validData
          })
        }

        return helper.handleErrors(res, error, 'admin')
      }
    },

    // @desc    show update form
    // @route   GET /restocks/edit/:id
    showUpdateForm: async (req, res) => {
      try {
        const restock = await getRestockById(req.user.accessToken, req.params.id) 
        if (restock) {
          return res.render("templates/admin/restock/restock.hbs", {
            layout: "admin/main.layout.hbs",
            content: "form",
            formType: "update",
            header: "Update restock",
            route: "restocks",
            user: await helper.getUserInstance(req),
            csrfToken: req.csrfToken(),
            products: await getProducts(req.user.accessToken),
            restock: restock
          })
        }
      } catch (error) {
        return helper.handleErrors(res, error, 'admin')
      }
    },

    // @desc    Update restock
    // @route   POST /restocks/:id
    updateRestockById: async (req, res) => {
      let restockData = {}
      try {
        const restock = await getRestockById(req.user.accessToken, req.params.id) 
        if (restock) {
          restockData = helper.getFilledFields(getRestockData(req.body), restock)
        }

        const response = await axiosInstance.put(`/admin/restocks/${req.params.id}`,
        restockData, {
          headers: {
            Authorization: "Bearer " + req.user.accessToken
          }
        })
        
        if (response.status === 204) {
          req.flash("success", "Your changes were successfully saved.")
          return res.render("templates/admin/restock/restock.hbs", {
            layout: "admin/main.layout.hbs",
            content: "form",
            formType: "update",
            header: "Update restock",
            route: "restocks",
            user: await helper.getUserInstance(req),
            csrfToken: req.csrfToken(),
            products: await getProducts(req.user.accessToken),
            restock: await getRestockById(req.user.accessToken, req.params.id)
          })
        }
      } catch (error) {
        if(error.response.status === 400) {
          const errors = error.response.data.error.invalidation
          const validData = helper.getValidFields(errors, req.body)
          
          req.flash("fail", "Your input is not valid. Please check and then fill in again.")
          return res.render("templates/admin/restock/restock.hbs", {
            layout: "admin/main.layout.hbs",
            content: "form",
            formType: "update",
            header: "Update restock",
            route: "restocks",
            csrfToken: req.csrfToken(),
            user: await helper.getUserInstance(req),
            products: await getProducts(req.user.accessToken),
            restock: await getRestockById(req.user.accessToken, req.params.id),
            errors: helper.handleInvalidationErrors(errors),
            validData: validData
          })
        }

        return helper.handleErrors(res, error, 'admin')
      }
    },

    // @desc    Update restock
    // @route   PUT /restocks/deactivate:id
    deactivateRestockById: async (req, res) => {
        try {
          const response = await axiosInstance.put(`/admin/restocks/${req.params.id}`, 
          {
            status: "deactivated"
          },{
            headers: {
              Authorization: "Bearer " + req.user.accessToken
            }
          })
          if (response.status === 204) {
            return res.sendStatus(200)
          }
        } catch (error) {
          return helper.handleErrors(error)
        }
    },

    // @desc    Update restock
    // @route   PUT /restocks/activate/:id
    activateRestockById: async (req, res) => {
      try {
        const response = await axiosInstance.put(`/admin/restocks/${req.params.id}`, 
        {
          status: "activated"
        },{
          headers: {
            Authorization: "Bearer " + req.user.accessToken
          }
        })
        if (response.status === 204) {
          return res.sendStatus(200)
        }
      } catch (error) {
        console.log(error)
        return helper.handleErrors(error)
      }
    },

    // @desc    Delete restock
    // @route   DELETE /restocks/:id
    removeRestockById: async (req, res) => {
      try {
        const response = await axiosInstance.delete(`/admin/restocks/${req.params.id}`, 
        {
          headers: {
            Authorization: "Bearer " + req.user.accessToken
          }
        })

        if (response.status === 204) {
          return res.sendStatus(200)
        }
      } catch (error) {
        return helper.handleErrors(error)
      }
    },
}
