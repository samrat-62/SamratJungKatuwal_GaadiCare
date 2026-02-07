import User from "../../models/user.js";
import Workshop from "../../models/workshop.js";
import { generateVerificationToken } from "../../service/createVerifyToken.js";
import sendForgotPasswordEmail from "../../service/nodemailer/forgetPassCode.js";

const handleForgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    let account = await User.findOne({ email });
    let accountType = "user";

    if (!account) {
      account = await Workshop.findOne({ email });
      accountType = "workshop";
    }

    if (!account) {
      return res.status(404).json({ message: "Account not found." });
    }

    const { token, expiresAt } = generateVerificationToken();

    account.verifyCode = token;
    account.codeExpire = expiresAt;

    await account.save();
    await sendForgotPasswordEmail(email, token);

    return res.status(200).json({
      success: true,
      message: "Password reset code sent to your email.",
      accountType,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      message: "Server error. Please try again later.",
    });
  }
};

export default handleForgotPassword;
