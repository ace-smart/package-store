const axiosInstance = require("../../helper/axios.helper")
const {
  handleErrors,
  handleInvalidationErrors,
  getFilledFields,
  getValidFields,
  getUserInstance,
  renderNotFoundPage,
  toDateFormat,
} = require("../../helper/helper")
const fs = require('fs')
const getProfileData = function (reqBody) {
  reqBody = JSON.parse(JSON.stringify(reqBody))

  return {
    firstName: reqBody.firstName,
    lastName: reqBody.lastName,
    dateOfBirth: reqBody.dateOfBirth != "" ? toDateFormat(reqBody.dateOfBirth.toString()) : "",
    gender: reqBody.gender == "" ? "male" : reqBody.gender,
    phoneNumber: reqBody.phoneNumber,
  }
}
module.exports = {
  showMyAccount: async (req, res) => {
    try {
      let user = await getUserInstance(req)
      
      if (user) {
        return res.render("templates/client/account/my-account", {
          layout: "client/index.layout.hbs",
          user: user,
          tabContent: 'profile',
          csrfToken: req.csrfToken(),
        })
      }

      return renderNotFoundPage(res, "client")
    } catch (error) {
      return handleErrors(res, error, "client")
    }
  },

  updateProfile: async (req, res) => {
    let profileData = getProfileData(req.body)
    try {
      const user = await helper.getUserInstance(req)
      profileData.userId = user.id
      // Uploaded avatar not valid
      if (res.locals.file && res.locals.file.error) {
        req.flash("fail", res.locals.file.error.message)
        return res.render("templates/client/account/my-account", {
          layout: "client/index.layout.hbs",
          user: user,
          csrfToken: req.csrfToken(),
          tabContent: 'profile',
          errors: {
            avatar: {
              messages: [res.locals.file.error.message],
            },
          },
        })
      } else {
        // Changed avatar
        if (req.files.avatar != null) {
          profileData.avatar = {
            fileName: req.files.avatar[0].filename.replace("temp-", ""),
            mimeType: req.files.avatar[0].mimetype,
          }
          // Remove old avatar
          if (fs.existsSync(`tmp\\avatar\\${profileData.avatar.fileName}`)) {
            fs.unlinkSync(`tmp\\avatar\\${profileData.avatar.fileName}`)
          }
          // Rename 
          fs.renameSync(`tmp\\avatar\\temp-${profileData.avatar.fileName}`, `tmp\\avatar\\${profileData.avatar.fileName}`)
        }
        // Update profile 
        if(user.profile != null) {
          profileData = getFilledFields(profileData, user.profile)
        }

        // Send API
        const response = await axiosInstance.put("/profile", profileData, {
          headers: {
            Authorization: "Bearer " + req.user.accessToken,
          },
        })
        
        if (response.status === 204) {
          req.flash("success", "Your profile was updated.")
          return res.redirect("/my-account")
        }
      }
    } catch (error) {
      if (error.response.status === 400) {
        const errors = error.response.data.error.invalidation
        const validData = getValidFields(errors, req.body)

        req.flash("fail", "Your input is not valid.")
        return res.render("templates/client/account/my-account", {
          layout: "client/index.layout.hbs",
          user: await getUserInstance(req),
          errors: handleInvalidationErrors(errors),
          validData: validData,
          csrfToken: req.csrfToken(),
        })
      }
      return handleErrors(res, error, "client")
    }
  },

  changePassword: async (req, res) => {
    try {
      const passwordData = {
        password: req.body.password,
        new_password: req.body.new_password,
        confirm_new_password: req.body.confirm_new_password
      }

      const response = await axiosInstance.put(`/profile/change-password`, passwordData, {
        headers: {
          Authorization: "Bearer " + req.user.accessToken,
        },
      })

      if (response.status === 204) {
        req.flash("success", "Your password was changed.")
        return res.redirect("/my-account/change-password")
      }
    } catch (error) {
      if (error.response.status === 400) {
        const errors = error.response.data.error.invalidation

        req.flash("fail", "Your input is not valid.")
        return res.render("templates/client/account/my-account", {
          layout: "client/index.layout.hbs",
          user: await getUserInstance(req),
          errors: handleInvalidationErrors(errors),
          csrfToken: req.csrfToken(),
          tabContent: 'change-password',
        })
      }

      return handleErrors(res, error, "client")
    }
  },

  updateAddress: async (req, res) => {
    let addressData = {
      street: req.body.street,
      district: req.body.district,
      city: req.body.city,
      country: req.body.country,
      postalCode: req.body.postalCode,
    }
    try {
      const user = await getUserInstance(req)
      addressData.userId = user.id

      // Update address 
      if(user.address != null) {
        addressData = getFilledFields(addressData, user.address)
      }
      const response = await axiosInstance.put(`/profile/address`, addressData, {
        headers: {
          Authorization: "Bearer " + req.user.accessToken
        }
      })

      if (response.status === 204) {
        req.flash('success', 'Your address is updated.')
        return res.redirect('/my-account/address')
      }
    } catch (error) {
      if (error.response.status === 400) {
        const errors = error.response.data.error.invalidation
        const validData = getValidFields(errors, req.body)

        req.flash('fail', 'Your input is not valid.')
        return res.render('templates/client/account/my-account', {
          layout: 'client/index.layout.hbs',
          user: await getUserInstance(req),
          csrfToken: req.csrfToken(),
          tabContent: 'address',
          errors: handleInvalidationErrors(errors),
          validData: validData
        })
      }

      return handleErrors(res, error, 'client')
    }
  }
}
