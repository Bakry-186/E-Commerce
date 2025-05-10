import nodemailer from "nodemailer";

// Nodemailer
export const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
      pass: process.env.NODE_CODE_SENDING_EMAIL_PASSWORD,
    },
  });

  // Define email options (from, to, subject and email content)
  const mailOpts = {
    from: `E-shop App <abdobakry823@gmail.com>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  // Send email
  await transporter.sendMail(mailOpts);
};
