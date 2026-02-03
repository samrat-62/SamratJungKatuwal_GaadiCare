import User from "../../models/user.js";
import { generateVerificationToken } from "../../service/createVerifyToken.js";
import sendForgotPasswordEmail from "../../service/nodemailer/forgetPassCode.js";


const handleForgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const { token, expiresAt } = generateVerificationToken();

    user.verifyCode = token;
    user.codeExpire = expiresAt;

    await user.save();
    await sendForgotPasswordEmail(email, token);

    return res.status(200).json({
      message: "Password reset code sent to your email.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      message: "Server error. Please try again later.",
    });
  }
};

export default handleForgotPassword;
