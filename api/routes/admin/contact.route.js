const express = require('express')
const router = express.Router()
const {  showContactList, getContactById, createNewContact, updateContactById, removeContactById } 
    = require('../../controllers/contact.controller')

// @desc    Show list of contacts
// @route   GET /contacts
router.get('/', showContactList)

// @desc    Get contact by Id
// @route   GET /contacts/:id
router.get('/:id', getContactById)

// @desc    Add new contact
// @route   POST /contacts
router.post('/', createNewContact)

// @desc    Update contact
// @route   PUT /contacts/:id
router.put('/:id', updateContactById)

// @desc    Delete contact
// @route   DELETE /contacts/:id
router.delete('/:id', removeContactById)

module.exports = router