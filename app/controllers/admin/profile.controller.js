const axiosInstance = require("../../helper/axios.helper")
const helper = require("../../helper/helper")
const fs = require('fs')
const getProfileData = function (reqBody) {
  reqBody = JSON.parse(JSON.stringify(reqBody))
  return {
    firstName: reqBody.firstName,
    lastName: reqBody.lastName,
    dateOfBirth: (reqBody.dateOfBirth != '') ? helper.toDateFormat(reqBody.dateOfBirth.toString()) : '',
    gender: (reqBody.gender == '') ? 'male' : reqBody.gender ,
    phoneNumber: reqBody.phoneNumber,
  }
}
module.exports = {
  // @desc:   Show profile
  // @route   GET /profile
  showProfilePage: async (req, res) => {
    try {
      const user = await helper.getUserInstance(req)
      const tabpane = req.query.tabpane != null ? req.query.tabpane : "account"
      
      return res.render("templates/admin/profile/profile", {
        layout: "admin/profile.layout.hbs",
        user: user,
        tabpane: tabpane,
        csrfToken: req.csrfToken(),
      })
    } catch (error) {
      return res.render("templates/admin/error/404", {
        layout: "admin/error.layout.hbs",
      })
    }
  },

  // @desc    Update profile
  // @route   POST /profile
  updateProfile: async (req, res) => {
    let profileData = getProfileData(req.body)
    try {
      const user = await helper.getUserInstance(req)
      profileData.userId = user.id
      //  Avatar has error
      if (res.locals.file && res.locals.file.error) {
        req.flash("fail", res.locals.file.error.message)
        return res.render("templates/admin/profile/profile", {
          layout: "admin/profile.layout.hbs",
          user: user,
          csrfToken: req.csrfToken(),
          tabpane: "profile",
          errors: {
            avatar: 
              {
                messages: [res.locals.file.error.message]
              }
          },
        })
      } else {
          // Change avatar
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
            profileData = helper.getFilledFields(profileData, user.profile)
          }
          // Send API
          const response = await axiosInstance.put("/profile", profileData, {
              headers: {
                  Authorization: "Bearer " + req.user.accessToken,
              },
          })
          if (response.status === 204) {
              req.flash("success", "Your profile was updated.")
              return res.redirect("/admin/profile?tabpane=profile")
          }
      }
    } catch (error) {
      if (error.response.status === 400) {
        const errors = error.response.data.error.invalidation
        const validData = helper.getValidFields(errors, req.body)

        req.flash("fail", "Failed to update.")
        return res.render("templates/admin/profile/profile", {
          layout: "admin/profile.layout.hbs",
          user: await helper.getUserInstance(req),
          csrfToken: req.csrfToken(),
          tabpane: "profile",
          errors: helper.handleInvalidationErrors(errors),
          validData: validData
        })
      }
      
      return helper.handleErrors(res, error, 'admin')
    }
  },

  // @desc:   Change password
  // @route   GET /changePwd
  showChangePwdPage: (req, res) => {
    return res.redirect("/admin/profile?tabpane=changePwd")
  },

  // @desc    change password
  // @route   POST /changePwd
  changePwd: async (req, res) => {
    // form inputs [password, new_password, confirm_new_password] 
    try {
      const passwordData = {
        password: req.body.password,
        new_password: req.body.new_password,
        confirm_new_password: req.body.confirm_new_password
      }

      const response = await axiosInstance.put(
        "/profile/change-password",
        { ...passwordData },
        {
          headers: {
            Authorization: "Bearer " + req.user.accessToken,
          },
        }
      )

      if (response.status === 204) {
        return res.redirect('/admin/logout')
      }
    } catch (error) {
      if (error.response.status === 400) {
        req.flash("fail", "Your input is not valid.")
        return res.render("templates/admin/profile/profile", {
          layout: "admin/profile.layout.hbs",
          user: await helper.getUserInstance(req),
          csrfToken: req.csrfToken(),
          tabpane: "changePwd",
          errors: helper.handleInvalidationErrors(error.response.data.error.invalidation),
        })
      }

      return helper.handleErrors(res, error, 'admin')
    }
  },
}
