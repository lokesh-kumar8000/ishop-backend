import contactModel from "../model/contact.model";
import { createdSuccess } from "../utility/response";

const contact = {
  async message(req, res) {
    try {
      const { fName, lName, email, phone, country, subject, message } =
        req.body;

      const contact = await contactModel.create({
        fName,
        lName,
        email,
        phone,
        country,
        subject,
        message,
      });
      await contact.save();

      return createdSuccess(res, "your complaint Submited!");
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Error sending email" });
    }
  },
};

export default contact;
