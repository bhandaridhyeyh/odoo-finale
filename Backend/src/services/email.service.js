// src/services/email.service.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === "true", // true for 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendMail = async ({ to, subject, html, text }) => {
  const info = await transporter.sendMail({
    from: `"${process.env.EMAIL_FROM_NAME || "TravelApp"}" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
    to,
    subject,
    text,
    html
  });
  return info;
};

const sendEmailVerification = async (to, name, verifyUrl) => {
  const subject = "Verify your email";
  const html = `<p>Hi ${name},</p><p>Click <a href="${verifyUrl}">here</a> to verify your email.</p>`;
  await sendMail({ to, subject, html });
};

export default { sendMail, sendEmailVerification };
