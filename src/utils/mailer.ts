import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // e.g. smtp.gmail.com or smtp-relay.sendinblue.com
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true for port 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendMail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  try {
    await transporter.sendMail({
      from: `"Sikati Services" <${process.env.SMTP_USER}>`, // your brand name + email
      to,
      subject,
      html,
    });
    console.log("✅ Mail sent successfully");
  } catch (error) {
    console.error("❌ Error sending mail:", error);
    throw error;
  }
};
