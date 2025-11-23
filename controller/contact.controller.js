const contactModel = require("../model/contact.model");
const { createdSuccess } = require("../utility/response");

const contact = {
  async message(req, res) {
    try {
      const { fName, lName, email, phone, country, subject, message } =
        req.body;

      const newContact = await contactModel.create({
        fName,
        lName,
        email,
        phone,
        country,
        subject,
        message,
      });

      return createdSuccess(res, "Your complaint submitted!");
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Error saving message" });
    }
  },
};

module.exports = contact;
