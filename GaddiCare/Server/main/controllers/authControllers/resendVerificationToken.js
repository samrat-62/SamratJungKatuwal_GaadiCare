import NewUser from "../../models/newUser.js";
import User from "../../models/user.js";
import { generateVerificationToken } from "../../service/createVerifyToken.js";
import sendForgotPasswordEmail from "../../service/nodemailer/forgetPassCode.js";
import sendVerificationEmail from "../../service/nodemailer/verifyNewUser.js";

const resendVerificationCode = async (req, res) => {
  const { email } = req.params;
  const { type } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    if (type === "reset") {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      const { token, expiresAt } = generateVerificationToken();

      user.verifyCode = token;
      user.codeExpire = expiresAt;

      await user.save();

      await sendForgotPasswordEmail(email, token);

      res.status(200).json({
        message: "Password reset code resent successfully.",
      });
    } else {
      const user = await NewUser.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      const { token, expiresAt } = generateVerificationToken();

      user.verifyCode = token;
      user.codeExpire = expiresAt;

      await user.save();

      await sendVerificationEmail(email, token);

      res.status(200).json({
        message: "Verification code resent successfully.",
      });
    }
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({
      message: "Server error. Please try again later.",
    });
  }
};

export default resendVerificationCode;