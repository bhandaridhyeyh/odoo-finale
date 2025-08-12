// src/services/email.service.js
import nodemailer from "nodemailer";

const port = Number(process.env.SMTP_PORT || 587);
const secure = process.env.SMTP_SECURE === "true" || port === 465;

const transporter = process.env.SMTP_HOST
  ? nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure, // true for 465, false for 587/STARTTLS
    auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    } : undefined,
  })
  : nodemailer.createTransport({ jsonTransport: true }); // dev fallback: logs emails instead of sending

const sendMail = async ({ to, subject, html, text }) => {
  const info = await transporter.sendMail({
    from: `"${process.env.EMAIL_FROM_NAME || "TravelApp"}" <${process.env.EMAIL_FROM || process.env.SMTP_USER || "no-reply@example.com"}>`,
    to,
    subject,
    text,
    html,
  });
  return info;
};

const sendEmailVerification = async (to, name, verifyUrl) => {
  const subject = "Verify your email";
  const html = `<p>Hi ${name},</p><p>Click <a href="${verifyUrl}">here</a> to verify your email.</p><p>If you didn't request this, you can ignore this email.</p>`;
  await sendMail({ to, subject, html });
};

const sendEmailOtp = async (to, name, otp, minutesValid = 10) => {
  const subject = "Your verification code";
  const html = `<p>Hi ${name},</p>
  <p>Your one-time verification code is:</p>
  <p style="font-size: 20px; font-weight: bold; letter-spacing: 4px;">${otp}</p>
  <p>This code will expire in ${minutesValid} minutes. If you didn't request this, you can ignore this email.</p>`;
  await sendMail({ to, subject, html, text: `Your verification code is ${otp}. It expires in ${minutesValid} minutes.` });
};

const sendInviteEmail = async (to, token, tripId) => {
  const link = `${process.env.FRONTEND_URL}/accept-invite?tripId=${tripId}&token=${token}`;
  // ...nodemailer code...
  await transporter.sendMail({
    to,
    subject: "Trip Collaboration Invite",
    html: `<p>You've been invited! <a href="${link}">Click here to join</a></p>`,
  });
};

export default { sendMail, sendEmailVerification, sendEmailOtp, sendInviteEmail };
