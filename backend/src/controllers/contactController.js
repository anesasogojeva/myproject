const Contact = require("../models/mysql/Contact");

exports.createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newContact = await Contact.create({ name, email, message });
    res.status(201).json(newContact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to submit contact form" });
  }
};

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.findAll({ order: [["createdAt", "DESC"]] });
    res.status(200).json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByPk(id);

    if (!contact) return res.status(404).json({ error: "Contact not found" });

    await contact.destroy();
    res.status(200).json({ message: "Contact deleted" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete contact" });
  }
};
