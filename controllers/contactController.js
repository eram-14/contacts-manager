const asyncHandler = require('express-async-handler')
const Contact = require('../models/contactModel')

//@desc Read All Contacts
//@route GET /api/contacts 
//@access private
const getAllContacts = async (req, res) => {
    const allContacts = await Contact.find({ user_id: req.user._id })
    res.status(200).json(allContacts)
}

//@desc Create a Contact
//@route POST /api/contacts 
//@access private
const createContact = asyncHandler(async (req, res) => {
    const { name, email, phone } = req.body
    if (!name || !email || !phone) {
        res.status(400)
        throw new Error("All Fields are Required!")
    }
    const contact = await Contact.create({ name, email, phone, user_id: req.user._id })
    res.status(201).json(contact)
})


//@desc Read an Individual Contact
//@route GET /api/contacts /:id
//@access private
const getContact = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const contact = await Contact.findById(id);
    if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
    }
    res.status(200).json(contact);
});

//@desc Update a Contact
//@route PUT /api/contacts/:id
//@access private
const updateContact = asyncHandler(async (req, res) => {
    const id = req.params.id
    const contact = await Contact.findById(id);
    if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
    }
    const body = req.body
    if (contact.user_id.toString() !== req.user._id) {
        res.status(403)
        throw new Error("User is not authorised to update this Contact")
    }
    const updatedContact = await Contact.findByIdAndUpdate(
        id,
        body,
        { new: true }
    )
    res.status(200).json(updatedContact)
})

//@desc Delete a Contact
//@route Get /api/contacts/:id
//@access private
const deleteContact = asyncHandler(async (req, res) => {
    const id = req.params.id
    const contact = await Contact.findById(id);
    if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
    }
    if (contact.user_id.toString() !== req.user._id) {
        res.status(403)
        throw new Error("User is not authorised to delete this Contact")
    }
    await Contact.deleteOne({ _id: req.params.id });
    res.status(200).json(contact);
})

module.exports = { getAllContacts, createContact, updateContact, deleteContact, getContact }