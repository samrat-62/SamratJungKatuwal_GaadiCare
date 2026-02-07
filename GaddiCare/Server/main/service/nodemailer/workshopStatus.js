import nodemailer from "nodemailer";

const sendWorkshopStatusEmail = async ({ email, status, password }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let subject = "";
    let html = "";

    if (status === "rejected") {
      subject = "Workshop Registration Rejected";
      html = `
        <h2>Workshop Registration Update</h2>
        <p>We regret to inform you that your workshop registration has been <b>rejected</b>.</p>
        <p>Please try again with proper and correct details.</p>
        <p>Thank you.</p>
      `;
    }

    if (status === "accepted") {
      subject = "Workshop Registration Approved 🎉";
      html = `
        <h2>Congratulations!</h2>
        <p>Your workshop has been <b>approved</b>.</p>
        <p>Here are your login credentials:</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Password:</b> ${password}</p>
        <p>Please keep these details safe.</p>
      `;
    }

    await transporter.sendMail({
      from:`GADDICARE <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email error:", error);
  }
};

export default sendWorkshopStatusEmail;
