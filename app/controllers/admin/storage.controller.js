const axiosInstance = require("../../helper/axios.helper")
const helper = require("../../helper/helper")
const getStorageById = async function (accessToken, storageId) {
  try {
    const response = await axiosInstance.get(`/admin/storages/${storageId}`,{
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
const getStorageData = function (reqBody) {
  reqBody = JSON.parse(JSON.stringify(reqBody)) 
  return {
    id: (reqBody.id) ? reqBody.id : null,
    name: reqBody.name,
    propertyType: reqBody.propertyType,
    capacity: reqBody.capacity,
    status: reqBody.status,
    address: {
      street: reqBody.street,
      district: reqBody.district,
      city: reqBody.city,
      country: reqBody.country,
      postalCode: parseInt(reqBody.postalCode.toString())
    },
    addressId: (reqBody.addressId) ? reqBody.addressId : null
  }
}
module.exports = {
  // @desc:   Show storages
  // @route   GET /storages
  showStorageList: async (req, res) => {
    try {
      const response = await axiosInstance.get(`/admin/storages`,{
        headers: {
          Authorization: "Bearer " + req.user.accessToken
        }
      })

      if(response.status === 200) {
        return res.render("templates/admin/storage/storage.hbs", {
          layout: "admin/main.layout.hbs",
          content: "list",
          header: "List of storages",
          route: "storages",
          storages: response.data,
          user: await helper.getUserInstance(req),
          csrfToken: req.csrfToken(),
        })
      }
    } catch (error) {
      return helper.handleErrors(res, error, 'admin')
    }
  },

  // @desc:   Get storages by Id
  // @route   GET /storages/view/:id
  viewStorageById: async (req, res) => {
    try {
      const storage = await getStorageById(req.user.accessToken, req.params.id)
      
      if(storage) {
        return res.render("templates/admin/storage/storage.hbs", {
          layout: "admin/main.layout.hbs",
          content: "view",
          header: "Storage information",
          route: "storages",
          storage: storage,
          user: await helper.getUserInstance(req),
          csrfToken: req.csrfToken(),
        })
      }
    } catch (error) {
      return helper.handleErrors(res, error, 'admin')
    }
  },

  // @desc    Show create form
  // @route   GET /storages/add
  showCreateStorageForm: async (req, res) => {
    return res.render("templates/admin/storage/storage.hbs", {
      layout: "admin/main.layout.hbs",
      content: "form",
      formType: "create",
      header: "Add a new storage",
      route: "storages",
      user: await helper.getUserInstance(req),
      csrfToken: req.csrfToken(),
    })
  },

  // @desc    Show create form
  // @route   POST /storages/add
  createStorage: async (req, res) => {
    let storageData = getStorageData(req.body)
    try {
      const response = await axiosInstance.post(`/admin/storages/`, storageData, {
        headers: {
          Authorization: "Bearer " + req.user.accessToken
        }
      })
      
      if(response.status === 201) {
        req.flash("success", "You have created a new storage.")
        return res.render("templates/admin/storage/storage.hbs", {
          layout: "admin/main.layout.hbs",
          content: "form",
          formType: "create",
          header: "Add a new storage",
          route: "storages",
          user: await helper.getUserInstance(req),
          csrfToken: req.csrfToken()
        })
      }

    } catch (error) {
      if(error.response.status === 400) {
        //ValidationError
        const errors = error.response.data.error.invalidation
        const validData = helper.getValidFields(errors, req.body)
        
        req.flash("fail", "Your input is not valid. Please check and then fill in again.")
        return res.render("templates/admin/storage/storage.hbs", {
          layout: "admin/main.layout.hbs",
          content: "form",
          formType: "create",
          header: "Add a new storage",
          route: "storages",
          user: await helper.getUserInstance(req),
          csrfToken: req.csrfToken(),
          errors: helper.handleInvalidationErrors(errors),
          validData: validData,
        })
      }

      return helper.handleErrors(res, error, 'admin')
    }
  },

  // @desc    Show update form
  // @route   GET /storages/edit/:id
  showUpdateStorageForm: async (req, res) => {
    try {
      const storage = await getStorageById(req.user.accessToken, req.params.id)
      
      if(storage) {
        return res.render("templates/admin/storage/storage.hbs", {
          layout: "admin/main.layout.hbs",
          content: "form",
          formType: "update",
          header: "Update storage",
          route: "storages",
          storage: storage,
          user: await helper.getUserInstance(req),
          csrfToken: req.csrfToken(),
        })
      }
    } catch (error) {
      return helper.handleErrors(res, error, 'admin')
    }
  },

  // @desc    Update storage
  // @route   PUT /storages/edit/:id
  updateStorageById: async (req, res) => {
    let storageData = {}
    storageData.id = req.params.id
    try {
      const storage = await getStorageById(req.user.accessToken, req.params.id)
      if (storage) {
        storageData = helper.getFilledFields(getStorageData(req.body), storage)
        storageData.addressId = (storage.addressId) ? storage.addressId.toString() : null
      }
      
      const response = await axiosInstance.put(`/admin/storages/${req.params.id}`, 
        storageData, {
        headers: {
          Authorization: "Bearer " + req.user.accessToken,
        },
      })

      if (response.status === 204) {
        req.flash("success", "Your changes were successfully saved.")
        return res.render("templates/admin/storage/storage.hbs", {
          layout: "admin/main.layout.hbs",
          content: "form",
          formType: "update",
          header: "Update storage",
          route: "storages",
          storage: await getStorageById(req.user.accessToken, req.params.id),
          user: await helper.getUserInstance(req),
          csrfToken: req.csrfToken()
        })
      }
    } catch (error) {
      if (error.response.status === 400) {
        //ValidationError
        const errors = error.response.data.error.invalidation
        const validData = helper.getValidFields(errors, req.body)
        req.flash("fail", "Your input is not valid. Please check and then fill in again.")
        return res.render("templates/admin/storage/storage.hbs", {
          layout: "admin/main.layout.hbs",
          content: "form",
          formType: "update",
          header: "Update storage",
          route: "storages",
          user: await helper.getUserInstance(req),
          csrfToken: req.csrfToken(),
          errors: helper.handleInvalidationErrors(errors),
          validData: validData,
          storage: await getStorageById(req.user.accessToken, req.params.id)
        })
      }

      return helper.handleErrors(res, error, "admin")
    }
  },

  // @desc    Set 'Full' status
  // @route   PUT /storages/set-full/:id
  setFullStorage: async (req, res) => {
    try {
      const response = await axiosInstance.put(`/admin/storages/${req.params.id}`, 
      {
        status: "full"
      }, {
        headers: {
          Authorization: "Bearer " + req.user.accessToken
        }
      })

      if (response.status === 204) {
        return res.sendStatus(200)
      }
    } catch (error) {
      return helper.handleErrors(res, error, 'admin')
    }
  },


  // @desc    Set 'Full' status
  // @route   PUT /storages/set-available/:id
  setAvailableStorage: async (req, res) => {
    try {
      const response = await axiosInstance.put(`/admin/storages/${req.params.id}`, 
      {
        status: "available"
      }, {
        headers: {
          Authorization: "Bearer " + req.user.accessToken
        }
      })

      if (response.status === 204) {
        return res.sendStatus(200)
      }
    } catch (error) {
      return helper.handleErrors(res, error, 'admin')
    }
  },


  // @desc    Delete storage
  // @route   DELETE /storages/:id
  removeStorageById: async (req, res) => {
    try {
      const response = await axiosInstance.delete(`/admin/storages/${req.params.id}`, 
      {
        headers: {
          Authorization: "Bearer " + req.user.accessToken
        }
      })

      if (response.status === 204) {
        return res.sendStatus(200)
      }
    } catch (error) {
      return helper.handleErrors(res, error, 'admin')
    }
  },
}
