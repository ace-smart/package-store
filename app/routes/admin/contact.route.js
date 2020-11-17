const router = require("express").Router()

const {
    showContactList,
    viewContactById,
    readContactById,
    trashContactById,
    starContactById,
    removeContactById,
} = require("../../controllers/admin/contact.controller")

// @desc    Show list of contacts
// @route   GET /contacts
router.get("/", showContactList)

// @desc    View an contact by id
// @route   GET /contacts/view/:id
router.get("/view/:id", viewContactById)

// @desc    Star a contact by id
// @route   PUT /contacts/remove-message?idArr='id1,id2'
router.put("/remove-message", trashContactById)

// @desc    Star a contact by id
// @route   PUT /contacts/star-message
router.put("/star-message", starContactById)

// @desc    Read an contact by id
// @route   PUT /contacts/read-message?:idArr='id1,id2'
router.put("/read-message", readContactById)

// @desc    Delete an contact by id
// @route   DELETE /contacts/:id
router.delete("/:id", removeContactById)

module.exports = router
