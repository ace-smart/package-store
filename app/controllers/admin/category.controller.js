const axiosInstance = require("../../helper/axios.helper")
const { handleErrors } = require("../../helper/helper")
const helper = require("../../helper/helper")
const getCategoryById = async (accessToken, categoryId) => {
  if (categoryId) {
    try {
      const response = await axiosInstance.get(`/admin/categories/${categoryId}`, {
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

  return null
}
const getSubcategoryByCategory = (category, subcategoryId) => {
  if (category.subcategories instanceof Array && category.subcategories.length > 0) {
    const subcategory = category.subcategories.find(element => element.id == subcategoryId)
    if (subcategory) {
      return subcategory
    }
  }

  return null
}
const getSubcategoryById = async (accessToken, subcategoryId) => {
  if (subcategoryId) {
    try {
      const response = await axiosInstance.get(`/admin/subcategories/${subcategoryId}`, {
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

  return null
}

module.exports = {
  // @desc:   Show categories
  // @route   GET /categories
  showCategoryList: async (req, res) => {
    try {
      const response = await axiosInstance.get("/admin/categories", {
        headers: {
          Authorization: "Bearer " + req.user.accessToken,
        },
      })

      if (response.status === 200) {
        return res.render("templates/admin/category/category.hbs", {
          layout: "admin/main.layout.hbs",
          content: "list",
          header: "List of categories",
          route: "categories",
          categories: response.data,
          user: await helper.getUserInstance(req),
          csrfToken: req.csrfToken(),
        })
      }
    } catch (error) {
      return helper.handleErrors(res, error, "admin")
    }
  },

  // @desc:   Get category by Id
  // @route   GET /categories/view/:id
  viewCategoryById: async (req, res) => {
    let category = null
    try {
      const response = await axiosInstance.get(`/admin/categories/${req.params.id}`, {
        headers: {
          Authorization: "Bearer " + req.user.accessToken,
        },
      })

      if (response.status === 200) {
        return res.render("templates/admin/category/category.hbs", {
          layout: "admin/main.layout.hbs",
          content: "view",
          header: "Category information",
          route: "categories",
          category: response.data,
          user: await helper.getUserInstance(req),
          csrfToken: req.csrfToken(),
        })
      }
    } catch (error) {
      return helper.handleErrors(res, error, "admin")
    }
  },

  // @desc    Show create category form
  // @route   GET /categories/add
  showCreateCategoryForm: async (req, res) => {
    return res.render("templates/admin/category/category.hbs", {
      layout: "admin/main.layout.hbs",
      content: "form",
      formType: "create",
      header: "Add a new category",
      route: "categories",
      user: await helper.getUserInstance(req),
      csrfToken: req.csrfToken(),
    })
  },

  // @desc    Create category form
  // @route   POST /categories/add
  createCategory: async (req, res) => {
    let categoryData = helper.removeCSRF(req.body)
    try {
      const response = await axiosInstance.post("/admin/categories", categoryData, {
        headers: {
          Authorization: "Bearer " + req.user.accessToken,
        },
      })

      if (response.status === 201) {
        req.flash("success", "Successfully! You have created a new category.")
        return res.render("templates/admin/category/category.hbs", {
          layout: "admin/main.layout.hbs",
          content: "form",
          formType: "create",
          header: "Add a new category",
          route: "categories",
          user: await helper.getUserInstance(req),
          csrfToken: req.csrfToken(),
        })
      }
    } catch (error) {
      if (error.response.status === 400) {
        //ValidationError
        const errors = error.response.data.error.invalidation
        const inputFields = Object.keys(categoryData)
        for (let i = 0; i < inputFields.length; i++) {
          const isFound = errors.find((ele) => ele.field === inputFields[i])
          if (isFound) {
            delete categoryData[inputFields[i]]
          }
        }

        req.flash("fail", "Your input is not valid. Please check and then fill in again.")
        return res.render("templates/admin/category/category.hbs", {
          layout: "admin/main.layout.hbs",
          content: "form",
          formType: "create",
          header: "Add a new category",
          route: "categories",
          csrfToken: req.csrfToken(),
          user: await helper.getUserInstance(req),
          errors: errors,
          validData: JSON.parse(JSON.stringify(categoryData)),
        })
      }

      return helper.handleErrors(res, error, "admin")
    }
  },

  // @desc    Update category
  // @route   GET /categories/edit/:id
  showUpdateCategoryForm: async (req, res) => {
    try {
      const response = await axiosInstance.get(`/admin/categories/${req.params.id}`, {
        headers: {
          Authorization: "Bearer " + req.user.accessToken,
        },
      })

      if (response.status === 200) {
        return res.render("templates/admin/category/category.hbs", {
          layout: "admin/main.layout.hbs",
          content: "form",
          formType: "update",
          header: "Add a new category",
          category: response.data,
          route: "categories",
          user: await helper.getUserInstance(req),
          csrfToken: req.csrfToken(),
        })
      }
    } catch (error) {
      return helper.handleErrors(res, error, "admin")
    }
  },

  // @desc    Update category
  // @route   POST /categories/edit/:id
  updateCategoryById: async (req, res) => {
    try {
      const response = await axiosInstance.get(`/admin/categories/${req.params.id}`, {
        headers: {
          Authorization: "Bearer " + req.user.accessToken,
        },
      })

      if (response.status === 200) {
        let category = response.data
        let categoryData = helper.removeCSRF(req.body)
        categoryData = helper.getFilledFields(categoryData, category)

        try {
          const updateResponse = await axiosInstance.put(
            `/admin/categories/${req.params.id}`,
            categoryData,
            {
              headers: {
                Authorization: "Bearer " + req.user.accessToken,
              },
            }
          )

          if (updateResponse.status === 204) {
            category = JSON.parse(JSON.stringify(req.body))
            category.id = response.data.id

            req.flash("success", "Your changes have been saved.")
            return res.render("templates/admin/category/category.hbs", {
              layout: "admin/main.layout.hbs",
              content: "form",
              formType: "update",
              header: "Update the category",
              route: "categories",
              category: category,
              user: await helper.getUserInstance(req),
              csrfToken: req.csrfToken(),
            })
          }
        } catch (error) {
          //ValidationError
          const errors = error.response.data.error.invalidation
          const inputFields = Object.keys(categoryData)
          for (let i = 0; i < inputFields.length; i++) {
            const isFound = errors.find((ele) => ele.field === inputFields[i])
            if (isFound) {
              delete categoryData[inputFields[i]]
            }
          }
          if (error.response && error.response.status === 400) {
            req.flash("fail", "Your changes was not valid. Please check your input.")
            return res.render("templates/admin/category/category.hbs", {
              layout: "admin/main.layout.hbs",
              content: "form",
              formType: "update",
              header: "Update the category",
              route: "categories",
              user: await helper.getUserInstance(req),
              category: category,
              csrfToken: req.csrfToken(),
              errors: errors,
              validData: categoryData,
            })
          } else {
            throw error
          }
        }
      }
    } catch (error) {
      return helper.handleErrors(res, error, "admin")
    }
  },

  // @desc    Deactivate a category by Id
  // @route   PUT /categories/deactivate/:id
  deactivateCategoryById: async (req, res) => {
    try {
      const response = await axiosInstance.put(
        `/admin/categories/${req.params.id}`,
        {
          status: "deactivated",
        },
        {
          headers: {
            Authorization: "Bearer " + req.user.accessToken,
          },
        }
      )

      if (response.status === 204) {
        return res.sendStatus(200)
      }
    } catch (error) {
      return helper.handleErrors(res, error, "admin")
    }
  },

  // @desc    Deactivate a category by Id
  // @route   PUT /categories/deactivate/:id
  activateCategoryById: async (req, res) => {
    try {
      const response = await axiosInstance.put(
        `/admin/categories/${req.params.id}`,
        {
          status: "activated",
        },
        {
          headers: {
            Authorization: "Bearer " + req.user.accessToken,
          },
        }
      )

      if (response.status === 204) {
        return res.sendStatus(200)
      }
    } catch (error) {
      return helper.handleErrors(res, error, "admin")
    }
  },

  // @desc    Delete category
  // @route   DELETE /categories/:id
  removeCategoryById: async (req, res) => {
    try {
      const response = await axiosInstance.delete(`/admin/categories/${req.params.id}`, {
        headers: {
          Authorization: "Bearer " + req.user.accessToken,
        },
      })
      if (response.status === 204) {
        return res.sendStatus(200)
      }
    } catch (error) {
      return helper.handleErrors(res, error, "admin")
    }
  },

  // @desc    Add subcategory
  // @route   POST /categories/:id/subcategories/add
  addSubcategory: async function (req, res) {
    let category = null
    let subcategoryData = helper.removeCSRF(req.body)
    subcategoryData.categoryId = req.params.id
    
    try {
      const createSubcategoryRes = await axiosInstance.post(
        `/admin/subcategories`,
        subcategoryData,
        {
          headers: {
            Authorization: "Bearer " + req.user.accessToken,
          },
        }
      )

      if (createSubcategoryRes.status === 201) {
        req.flash("success", "You have created a new subcategory.")
        return res.redirect(`/admin/categories/view/${req.params.id}`)
      }

    } catch (error) {
      category = await getCategoryById(req.user.accessToken, req.params.id)
      //ValidationError
      if (error.response.status === 400) {
        const errors = error.response.data.error.invalidation
        const inputFields = Object.keys(subcategoryData)
        for (let i = 0; i < inputFields.length; i++) {
          const isFound = errors.find((ele) => ele.field === inputFields[i])
          if (isFound) {
            delete subcategoryData[inputFields[i]]
          }
        }

        req.flash("fail", "Your input is not valid. Please check and then fill in again.")
        return res.render("templates/admin/category/category.hbs", {
          layout: "admin/main.layout.hbs",
          content: "view",
          formType: "create",
          header: "Add a new subcategory",
          route: "categories",
          csrfToken: req.csrfToken(),
          category: category,
          user: await helper.getUserInstance(req),
          errors: errors,
          validData: JSON.parse(JSON.stringify(subcategoryData)),
        })
        }

      return helper.handleErrors(res, error, "admin")
    }
  },

  // @desc:   Get category by Id
  // @route   GET /categories/view/:id/subcategories/edit/:subId
  showUpdateSubcateForm: async (req, res) => {
    try {
      const category = await getCategoryById(req.user.accessToken, req.params.id)
      const subcategory = getSubcategoryByCategory(category, req.params.subId)
      if (subcategory) {
        return res.render("templates/admin/category/category.hbs", {
          layout: "admin/main.layout.hbs",
          content: "view",
          formType: "update",
          header: "Category information",
          route: "categories",
          category: category,
          subcategory: subcategory,
          user: await helper.getUserInstance(req),
          csrfToken: req.csrfToken(),
        })
      } else {
        return helper.renderNotFoundPage(res, 'admin')
      }
      
    } catch (error) {
      return helper.handleErrors(res, error, "admin")
    }
  },

  // @desc    Update subcategory
  // @route   POST /categories/view/:id/subcategories/edit/:subId
  updateSubcategoryById: async (req, res) => {
    let category = null
    let subcategoryData = helper.removeCSRF(req.body)
    try {
      category = await getCategoryById(req.user.accessToken, req.params.id)
      let subcategory = getSubcategoryByCategory(category, req.params.subId)
      if (subcategory) {
        subcategoryData = helper.getFilledFields(subcategoryData, subcategory)

        const updateResponse = await axiosInstance.put(
          `/admin/subcategories/${req.params.subId}`,
          subcategoryData,
          {
            headers: {
              Authorization: "Bearer " + req.user.accessToken,
            },
          }
        )

        if (updateResponse.status === 204) {
          // Set updated subcategory
          subcategory = await getSubcategoryById(req.user.accessToken, req.params.subId)
          req.flash("success", "Your changes have been saved.")
          return res.render("templates/admin/category/category.hbs", {
            layout: "admin/main.layout.hbs",
            content: "view",
            formType: "update",
            header: "Update the category",
            route: "categories",
            category: category,
            subcategory: subcategory,
            user: await helper.getUserInstance(req),
            csrfToken: req.csrfToken(),
          })
        }
      }

    } catch (error) {
      //ValidationError
      const errors = error.response.data.error.invalidation
      const inputFields = Object.keys(subcategoryData)
      for (let i = 0; i < inputFields.length; i++) {
        const isFound = errors.find((ele) => ele.field === inputFields[i])
        if (isFound) {
          delete subcategoryData[inputFields[i]]
        }
      }

      if (error.response && error.response.status === 400) {
        category = await getCategoryById(req.user.accessToken, req.params.id)
        req.flash("fail", "Your changes was not valid. Please check your input.")
        return res.render("templates/admin/category/category.hbs", {
          layout: "admin/main.layout.hbs",
          content: "view",
          formType: "update",
          header: "Update the subcategory",
          route: "categories",
          user: await helper.getUserInstance(req),
          category: category,
          subcategory: getSubcategoryByCategory(category, req.params.subId),
          csrfToken: req.csrfToken(),
          errors: errors,
          validData: subcategoryData,
        })
      }

      return helper.handleErrors(res, error, "admin")
    }
  },

  // @desc    Deactivate a category by Id
  // @route   PUT /categories/view/:id/subcategories/deactivate/:subId
  deactivateSubcateById: async (req, res) => {
    try {
      const subcategory = await getSubcategoryById(req.user.accessToken, req.params.subId)
      if (subcategory) {
        const deactivateRes = await axiosInstance.put(
          `/admin/subcategories/${req.params.subId}`,
          {
            status: "deactivated",
          },
          {
            headers: {
              Authorization: "Bearer " + req.user.accessToken,
            },
          }
        )

        if (deactivateRes.status === 204) {
          return res.sendStatus(200)
        }

      } else {
        return helper.renderNotFoundPage(res, 'admin')
      }

    } catch (error) {
      return helper.handleErrors(res, error, "admin")
    }
  },

  // @desc    Deactivate a category by Id
  // @route   PUT /categories/view/:id/subcategories/activate/:subId
  activateSubcateById: async (req, res) => {
    try {
      const subcategory = await getSubcategoryById(req.user.accessToken, req.params.subId)
      if (subcategory) {
        const deactivateRes = await axiosInstance.put(
          `/admin/subcategories/${req.params.subId}`,
          {
            status: "activated",
          },
          {
            headers: {
              Authorization: "Bearer " + req.user.accessToken,
            },
          }
        )

        if (deactivateRes.status === 204) {
          return res.sendStatus(200)
        }

      } else {
        return helper.renderNotFoundPage(res, 'admin')
      }

    } catch (error) {
      return helper.handleErrors(res, error, "admin")
    }
  },

  // @desc    Delete subcategory by Id
  // @route   PUT /categories/view/:id/subcategories/:subId
  removeSubcateById: async (req, res) => {
    try {
      const subcategory = await getSubcategoryById(req.user.accessToken, req.params.subId)
      if (subcategory) {
        const deactivateRes = await axiosInstance.delete(
          `/admin/subcategories/${req.params.subId}`,
          {
            headers: {
              Authorization: "Bearer " + req.user.accessToken,
            },
          }
        )

        if (deactivateRes.status === 204) {
          return res.sendStatus(200)
        }

      } else {
        return helper.renderNotFoundPage(res, 'admin')
      }

    } catch (error) {
      return helper.handleErrors(res, error, "admin")
    }
  },
}
