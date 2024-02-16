const express = require('express')
const { getAllContacts, createContact, updateContact, deleteContact, getContact } = require('../controllers/contactController');
const validateToken = require('../middleware/validateToken');

const router = express.Router()

router.use(validateToken)
router.route('/').get(getAllContacts).post(createContact);
router.route('/:id').get(getContact).put(updateContact).delete(deleteContact)

module.exports = router