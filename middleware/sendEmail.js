import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, text, html }) {
  try {
    const response = await resend.emails.send({
      from: process.env.MAIL_FROM,
      to,
      subject,
      text,
      html: html || `<p>${text}</p>`,
    });

    console.log("Email sent:", response);
    return response;

  } catch (error) {
    console.error("Email error:", error);
    throw new Error("Failed to send email");
  }
}
