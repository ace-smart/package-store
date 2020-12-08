const axiosInstance = require("../../helper/axios.helper")
const helper = require("../../helper/helper")
const getContact = async function (accessToken, contactId) {
  try {
    const response = await axiosInstance.get(`/admin/contacts/${contactId}`, {
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

module.exports = {
  // @desc:   Show contacts
  // @route   GET /contacts
  showContactList: async (req, res) => {
    try {
      const response = await axiosInstance.get("/admin/contacts", {
        headers: {
          Authorization: "Bearer " + req.user.accessToken,
        },
      })
      let contacts = []
      if (response.status === 200 && response.data != null) {
        contacts = response.data
        if (req.query.status) {
          if (req.query.status === "starred") {
            contacts = response.data.filter((element) => element.status === "starred")
          } else if (req.query.status === "removed") {
            contacts = response.data.filter((element) => element.status === "removed")
          } else {
            contacts = response.data.filter((element) => element.status !== "removed")
          }
        } else {
          contacts = response.data.filter((element) => element.status !== "removed")
        }
      }

      // === Pagination CONSTANT
      let currentPage = req.query.page ? parseInt(req.query.page.toString()) : 1
      const itemPerPage = 10
      const numOfItems = (contacts != null) ? contacts.length : 0

      // Default pagination declaration
      let pagination = {
        numOfPages: 1,
        itemPerPage: itemPerPage,
        numOfItems: numOfItems,
        currentPage: 1
      }

      // Make pagination for contact items
      const helperPagination = helper.makePagination(contacts, itemPerPage, currentPage)
      if (helperPagination != null) {
        pagination.numOfPages = helperPagination.numOfPages
        pagination.items = helperPagination.items
      }

      return res.render("templates/admin/contact/contact.hbs", {
        layout: "admin/main.layout.hbs",
        content: "list",
        header: "List of contacts",
        route: "contacts",
        contacts: pagination.items,
        pagination: pagination,
        user: await helper.getUserInstance(req),
        csrfToken: req.csrfToken(),
      })
    } catch (error) {
      return helper.handleErrors(res, error, "admin")
    }
  },

  // @desc:   Get contacts by Id
  // @route   GET /contacts/:id
  viewContactById: async (req, res) => {
    try {
      const contact = await getContact(req.user.accessToken, req.params.id)
      if (contact) {
        return res.render("templates/admin/contact/contact.hbs", {
          layout: "admin/main.layout.hbs",
          content: "view",
          route: "contacts",
          contact: contact,
          user: await helper.getUserInstance(req),
          csrfToken: req.csrfToken(),
        })
      }
    } catch (error) {
      return helper.handleErrors(res, error, "admin")
    }
  },

  // @desc    Read contact
  // @route   PUT /contacts/read-message?idArr='id1,id2'
  readContactById: async (req, res) => {
    let contactIDs = req.query.idArr.split(",")
    try {
      contactIDs.forEach(async (element, index, thisArr) => {
        try {
          const response = await axiosInstance.put(
            `/admin/contacts/${element}`,
            {
              status: "seen",
            },
            {
              headers: {
                Authorization: "Bearer " + req.user.accessToken,
              },
            }
          )

          if (response.status === 204) {
            contactIDs.shift()
          }

          if (thisArr.length == 0) {
            return res.sendStatus(200)
          }
        } catch (error) {
          throw error
        }
      })
    } catch (error) {
      return helper.handleErrors(res, error, "admin")
    }
  },

  // @desc    Trash contact
  // @route   PUT /contacts/remove-message?idArr='id1,id2'
  trashContactById: async (req, res) => {
    let contactIDs = req.query.idArr.split(",")
    try {
      contactIDs.forEach(async (element, index, thisArr) => {
        try {
          const response = await axiosInstance.put(
            `/admin/contacts/${element}`,
            {
              status: "removed",
            },
            {
              headers: {
                Authorization: "Bearer " + req.user.accessToken,
              },
            }
          )

          if (response.status === 204) {
            contactIDs.shift()
          }

          if (thisArr.length == 0) {
            return res.sendStatus(200)
          }
        } catch (error) {
          throw error
        }
      })
    } catch (error) {
      return helper.handleErrors(res, error, "admin")
    }
  },

  // @desc    Star contact
  // @route   PUT /contacts/star-message?idArr='id1,id2'
  starContactById: async (req, res) => {
    let contactIDs = req.query.idArr.split(",")
    try {
      contactIDs.forEach(async (element, index, thisArr) => {
        try {
          const response = await axiosInstance.put(
            `/admin/contacts/${element}`,
            {
              status: "starred",
            },
            {
              headers: {
                Authorization: "Bearer " + req.user.accessToken,
              },
            }
          )

          if (response.status === 204) {
            contactIDs.shift()
          }

          if (thisArr.length == 0) {
            return res.sendStatus(200)
          }
        } catch (error) {
          throw error
        }
      })
    } catch (error) {
      return helper.handleErrors(res, error, "admin")
    }
  },

  // @desc    Delete contact
  // @route   DELETE /contacts/:id
  removeContactById: async (req, res) => {
    let contactIDs = req.params.id.split(",")
    try {
      contactIDs.forEach(async (element, index, thisArr) => {
        try {
          const response = await axiosInstance.delete(`/admin/contacts/${element}`, {
            headers: {
              Authorization: "Bearer " + req.user.accessToken,
            },
          })

          if (response.status === 204) {
            contactIDs.shift()
          }

          if (thisArr.length == 0) {
            return res.sendStatus(200)
          }
        } catch (error) {
          throw error
        }
      })
    } catch (error) {
      return helper.handleErrors(res, error, "admin")
    }
  },
}
