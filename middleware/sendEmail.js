import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export async function sendEmail({ to, subject, text }) {
  const transporter = nodemailer.createTransport({
    service: "gmail", // or use host/port for custom SMTP
    auth: {
      user: process.env.MAIL_USER, // your email
      pass: process.env.MAIL_PASS, // app password or SMTP password
    },
  });

  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to,
    subject,
    text,
  });
}
