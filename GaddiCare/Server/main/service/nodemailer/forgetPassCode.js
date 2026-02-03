import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const sendForgotPasswordEmail = async (email, code) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Your App Name" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Code",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Password Reset Request</h2>
          <p>We received a request to reset your password.</p>
          <p>Your password reset code is:</p>
          <h1 style="letter-spacing: 4px;">${code}</h1>
          <p>This code will expire in <b>10 minutes</b>.</p>
          <p>If you did not request a password reset, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent to:", email);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Email not sent");
  }
};

export default sendForgotPasswordEmail;
