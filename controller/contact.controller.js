import nodemailer from "nodemailer"; 

const contact = {
  async message(req, res) {
    try {
      const { fName, lName, email, phone, country, subject, message } =
        req.body;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MAIL_USER, // sender email
          pass: process.env.MAIL_PASS, // app password
        },
      });


      await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: process.env.ADMIN_EMAIL, // Admin will receive notification
        subject: `New Contact Form Submission from ${fName}`,
        html: `
          <h2>New Contact Form Message</h2>
          <p><strong>Name:</strong> ${fName} ${lName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Country:</strong> ${country}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong> ${message}</p>
        `,
      });

      // -----------------------------------------
      // 2️⃣ Confirmation Email to USER
      // -----------------------------------------
      await transporter.sendMail({
        from: process.env.ADMIN_EMAIL,
        to: email,
        subject: "Thank you for contacting us!",
        html: `
          <h3>Hello ${fName},</h3>
          <p>Thank you for reaching out to us. We have received your message.</p>
          <p>We will contact you soon!</p>
          <br />
          <p>Regards,<br/>SWAT Techmart Team</p>
        `,
      });


      return res.status(200).json({ message: "Emails sent successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Error sending email" });
    }
  },
};

export default contact;
