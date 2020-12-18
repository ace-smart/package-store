const axiosInstance = require("../../helper/axios.helper")
const helper = require("../../helper/helper")
const {
  handleErrors,
  handleInvalidationErrors,
  getUserInstance,
  getValidFields,
  getFilledFields,
  renderNotFoundPage,
} = require("../../helper/helper")
const getCategoryList = async function (accessToken) {
  try {
    const response = await axiosInstance.get("/admin/categories", {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })

    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    return null
  }
}
const getProductById = async function (accessToken, productId) {
  try {
    const response = await axiosInstance.get(`/admin/products/${productId}`, {
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
const getProductData = function (reqBody) {
  reqBody = JSON.parse(JSON.stringify(reqBody))
  return {
    name: reqBody.name,
    subcategoryId: reqBody.subcategoryId,
    price: parseInt(reqBody.price),
    status: reqBody.status,
    details: {
      color: {
        colorName: reqBody.colorName,
        hexCode: reqBody.hexCode,
      },
      size: reqBody.size,
      material: reqBody.material,
      gender: reqBody.gender,
      season: reqBody.season,
    },
  }
}
const getGallery = async function (accessToken, productId) {
  try {
    const response = await axiosInstance.get(`/admin/gallery?productId=${productId}`, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })

    if (response.status === 200 && response.data != null) {
      const fs = require("fs")
      // Parse response.data to String
      let gallery = response.data.map((image) => {
        return {
          id: image.id,
          productId: image.productId._id,
          fileName: image.fileName + "." + image.extension,
          imageName: image.imageName,
          mimeType: image.mimeType,
          data: fs.readFileSync(`tmp/productImg/${image.fileName + "." + image.extension}`),
        }
      })

      return gallery
    }
    return null
  } catch (error) {
    throw error
  }
}

module.exports = {
  // @desc:   Show products
  // @route   GET /products
  // @query: subcategoryId
  showProductList: async (req, res) => {
    const subcategoryId = req.query.subcategoryId ? req.query.subcategoryId : null
    try {
      const response = await axiosInstance.get("/admin/products", {
        headers: {
          Authorization: "Bearer " + req.user.accessToken,
        },
      })
      let productList = response.data
      if (response.status === 200) {
        // Return productList by 'subcategoryId'
        if (req.query.subcategoryId != null) {
          productList = response.data.filter((element) => element.subcategoryId === subcategoryId)
          return res.status(200).json(productList)
        } else {
          // Render template
          return res.render("templates/admin/product/product.hbs", {
            layout: "admin/main.layout.hbs",
            content: "list",
            header: "List of products",
            route: "products",
            products: response.data,
            user: await getUserInstance(req),
            csrfToken: req.csrfToken(),
          })
        }
      }
    } catch (error) {
      return handleErrors(res, error, "admin")
    }
  },

  // @desc:   View products by Id
  // @route   GET /products/get-data/:id
  getProductById: async (req, res) => {
    try {
      const response = await axiosInstance.get(`/admin/products/${req.params.id}`, {
        headers: {
          Authorization: "Bearer " + req.user.accessToken,
        },
      })

      if (response.status === 200) {
        return res.status(200).json(response.data)
      }
    } catch (error) {
      return res.sendStatus(error.response.status)
    }
  },

  // @desc:   View products by Id
  // @route   GET /products/view/:id
  viewProductById: async (req, res) => {
    try {
      const response = await axiosInstance.get(`/admin/products/${req.params.id}`, {
        headers: {
          Authorization: "Bearer " + req.user.accessToken,
        },
      })

      if (response.status === 200) {
        return res.render("templates/admin/product/product.hbs", {
          layout: "admin/main.layout.hbs",
          content: "view",
          header: "Product information",
          route: "products",
          product: response.data,
          user: await getUserInstance(req),
          csrfToken: req.csrfToken(),
        })
      }
    } catch (error) {
      return handleErrors(res, error, "admin")
    }
  },

  // @desc    show create product form
  // @route   GET /products/add
  showCreateProductForm: async (req, res) => {
    return res.render("templates/admin/product/product.hbs", {
      layout: "admin/main.layout.hbs",
      content: "form",
      formType: "create",
      header: "Create a new product",
      route: "products",
      categories: await getCategoryList(req.user.accessToken),
      user: await getUserInstance(req),
      csrfToken: req.csrfToken(),
    })
  },

  // @desc    Create product
  // @route   POST /products/add
  createProduct: async (req, res) => {
    let productData = getProductData(req.body)
    try {
      const response = await axiosInstance.post(`/admin/products`, productData, {
        headers: {
          Authorization: "Bearer " + req.user.accessToken,
        },
      })

      if (response.status === 201) {
        req.flash("success", "You have created a new product.")
        return res.render("templates/admin/product/product.hbs", {
          layout: "admin/main.layout.hbs",
          content: "form",
          formType: "create",
          header: "Create a new product",
          route: "products",
          categories: await getCategoryList(req.user.accessToken),
          user: await getUserInstance(req),
          csrfToken: req.csrfToken(),
        })
      }
    } catch (error) {
      if (error.response.status === 400) {
        const errors = error.response.data.error.invalidation
        const validData = getValidFields(errors, productData)
        req.flash("fail", "Your input is not valid. Please check and then fill in again.")
        return res.render("templates/admin/product/product.hbs", {
          layout: "admin/main.layout.hbs",
          content: "form",
          formType: "create",
          header: "Create a new product",
          route: "products",
          csrfToken: req.csrfToken(),
          user: await getUserInstance(req),
          categories: await getCategoryList(req.user.accessToken),
          errors: handleInvalidationErrors(errors),
          validData: validData,
        })
      }

      return handleErrors(res, error, "admin")
    }
  },

  // @desc    Show update form
  // @route   GET /products/edit/:id
  showUpdateForm: async (req, res) => {
    try {
      const product = await getProductById(req.user.accessToken, req.params.id)
      if (product) {
        return res.render("templates/admin/product/product.hbs", {
          layout: "admin/main.layout.hbs",
          content: "form",
          formType: "update",
          header: "Update product",
          route: "products",
          csrfToken: req.csrfToken(),
          user: await getUserInstance(req),
          categories: await getCategoryList(req.user.accessToken),
          product: product,
        })
      }
    } catch (error) {
      return handleErrors(res, error, "admin")
    }
  },

  // @desc    Update product
  // @route   PUT /products/edit/:id
  updateProductById: async (req, res) => {
    let productData = {}
    try {
      product = await getProductById(req.user.accessToken, req.params.id)
      if (product) {
        productData = getFilledFields(getProductData(req.body), product)
      }

      const response = await axiosInstance.put(`/admin/products/${req.params.id}`, productData, {
        headers: {
          Authorization: "Bearer " + req.user.accessToken,
        },
      })

      if (response.status === 204) {
        req.flash("success", "Your changes were successfully saved.")
        return res.render("templates/admin/product/product.hbs", {
          layout: "admin/main.layout.hbs",
          content: "form",
          formType: "update",
          header: "Update product",
          route: "products",
          csrfToken: req.csrfToken(),
          user: await getUserInstance(req),
          categories: await getCategoryList(req.user.accessToken),
          product: await getProductById(req.user.accessToken, req.params.id),
        })
      }
    } catch (error) {
      if (error.response.status === 400) {
        const errors = error.response.data.error.invalidation
        const validData = getValidFields(errors, req.body)

        req.flash("fail", "Your input is not valid. Please check and then fill in again.")
        return res.render("templates/admin/product/product.hbs", {
          layout: "admin/main.layout.hbs",
          content: "form",
          formType: "update",
          header: "Update product",
          route: "products",
          csrfToken: req.csrfToken(),
          user: await getUserInstance(req),
          categories: await getCategoryList(req.user.accessToken),
          product: await getProductById(req.user.accessToken, req.params.id),
          errors: handleInvalidationErrors(errors),
          validData: validData,
        })
      }
      return handleErrors(res, error, "admin")
    }
  },

  // @desc    Deactivate product
  // @route   PUT /products/deactivate/:id
  deactivateProductById: async (req, res) => {
    try {
      const response = await axiosInstance.put(
        `/admin/products/${req.params.id}`,
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
      return handleErrors(res, error, "admin")
    }
  },

  // @desc    Activate product
  // @route   PUT /products/activate/:id
  activateProductById: async (req, res) => {
    try {
      const response = await axiosInstance.put(
        `/admin/products/${req.params.id}`,
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
      return handleErrors(res, error, "admin")
    }
  },

  // @desc    Delete product
  // @route   DELETE /products/:id
  removeProductById: async (req, res) => {
    try {
      const response = await axiosInstance.delete(`/admin/products/${req.params.id}`, {
        headers: {
          Authorization: "Bearer " + req.user.accessToken,
        },
      })

      if (response.status === 204) {
        return res.sendStatus(200)
      }
    } catch (error) {
      return handleErrors(res, error, "admin")
    }
  },

  // ==== GALLERY

  //@desc     Show gallery page
  //@route    GET /products/gallery?productId='123'
  showGallery: async (req, res) => {
    let productId = req.query.productId
    try {
      // No productId included in query
      if (!productId) {
        return renderNotFoundPage(res, "admin")
      }

      const product = await getProductById(req.user.accessToken, productId)
      if (product) {
          return res.render("templates/admin/product/product.hbs", {
            layout: "admin/main.layout.hbs",
            content: "gallery",
            header: "Product Gallery",
            route: "products",
            productId: productId,
            gallery: await getGallery(req.user.accessToken, productId),
            user: await getUserInstance(req),
            csrfToken: req.csrfToken(),
          })
      }
      
      return renderNotFoundPage(res, error, 'admin')
    } catch (error) {
      if (error.response.status === 404) {
        // No image in the gallery
        return res.render("templates/admin/product/product.hbs", {
          layout: "admin/main.layout.hbs",
          content: "gallery",
          header: "Product Gallery",
          route: "products",
          productId: productId,
          user: await getUserInstance(req),
          csrfToken: req.csrfToken(),
        })
      }

      return handleErrors(res, error, "admin")
    }
  },

  //@desc     Add image to gallery
  //@route    POST /products/gallery/add?productId='123'
  addToGallery: async (req, res) => {
    let productId = req.query.productId
    try {
      // has error
      if (res.locals.file && res.locals.file.error) {
        req.flash("fail", res.locals.file.error.message)

        return res.redirect(`/admin/products/gallery?productId=${productId}`)
      }
      const [fileName, extension] = req.files.productImg[0].filename.split(".")
      // Add imag data
      const galleryData = {
        fileName: fileName,
        imageName: req.body.imageName,
        extension: extension,
        mimeType: req.files.productImg[0].mimetype,
        size: req.files.productImg[0].size,
        productId: productId,
      }

      const response = await axiosInstance.post(`/admin/gallery/`, galleryData, {
        headers: {
          Authorization: "Bearer " + req.user.accessToken,
        },
      })

      if (response.status === 201) {
        req.flash("success", "Your image was successfully added.")
        return res.redirect(`/admin/products/gallery?productId=${productId}`)
      }
    } catch (error) {
      if (error.response.status == 400) {
        req.flash("fail", error.response.data.error.invalidation[0].message)
        return res.redirect(`/admin/products/gallery?productId=${productId}`)
      }

      return handleErrors(res, error, "admin")
    }
  },

  // @desc    Delete image in gallery
  // @route   DELETE /products/gallery/:id
  removeImageById: async (req, res) => {
    try {
      const image = await axiosInstance.get(`/admin/gallery/${req.params.id}`, {
        headers: {
          Authorization: "Bearer " + req.user.accessToken,
        },
      })

      if (image.status === 200) {
        const fileName = image.data.fileName + "." + image.data.extension
        const fs = require("fs")
        fs.unlinkSync(`tmp\\productImg\\${fileName}`)
        const response = await axiosInstance.delete(`/admin/gallery/${req.params.id}`, {
          headers: {
            Authorization: "Bearer " + req.user.accessToken,
          },
        })

        if (response.status === 204) {
          return res.sendStatus(200)
        }
      }
    } catch (error) {
      return handleErrors(res, error, "admin")
    }
  },
}
