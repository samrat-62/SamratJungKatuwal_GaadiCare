import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const sendVerificationEmail = async (email, code) => {
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
      subject: "Email Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Email Verification</h2>
          <p>Thank you for registering.</p>
          <p>Your verification code is:</p>
          <h1 style="letter-spacing: 4px;">${code}</h1>
          <p>This code will expire in <b>10 minutes</b>.</p>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Verification email sent to:", email);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Email not sent");
  }
};

export default sendVerificationEmail;
