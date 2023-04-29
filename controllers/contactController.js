const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

//@desc Get all contacts
//@route GET /api/contacts
//@access private
const getContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.find({ user_id: req.user.id });
    res.status(200).json(contacts);
});


//@desc Create contact
//@route POST /api/contacts
//@access private
const createContact = asyncHandler(async (req, res) => {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const newContact = await Contact.create({
        name,
        email,
        phone,
        user_id: req.user.id,
    });
    res.status(200).json(newContact);
});

//@desc Get contact for particular contactid
//@route GET /api/contacts/:id
//@access private
const getContact = asyncHandler(async (req, res) => {
    await Contact.findById(req.params.id).then((contact) => {
        if(contact.user_id.toString() !== req.user.id) {
            res.status(403);
            throw new Error("User is not authorized");
        }
        res.status(200).json(contact);
    }).catch((err) => {
        res.status(404);
        throw new Error("Contact not found");
    });
});

//@desc Update contact
//@route PUT /api/contacts/:id
//@access private
const updateContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User is not authorized");
    }

    await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    ).then((updatedContact) => {
        res.status(200).json(updatedContact);
    }).catch((err) => {
        res.status(404);
        throw new Error("Contact not found");
    });
});

//@desc Delete contact
//@route DELETE /api/contacts/:id
//@access private
const deleteContact = asyncHandler(async (req, res) => {

    const contact = await Contact.findById(req.params.id);
    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User is not authorized");
    }

    await Contact.findByIdAndRemove(req.params.id).then((contact) => {
        res.status(200).json(contact);
    }).catch((err) => {
        res.status(404);
        throw new Error("Contact not found");
    });
});

module.exports = {
    getContacts,
    createContact,
    getContact,
    updateContact,
    deleteContact
}