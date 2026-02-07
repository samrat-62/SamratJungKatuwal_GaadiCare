import User from "../../models/user.js";
import Workshop from "../../models/workshop.js";

const verifyForgotPasswordToken = async (req, res) => {
  const { email, token } = req.body;

  if (!email || !token) {
    return res.status(400).json({
      message: "Email and token are required.",
    });
  }

  try {
    let account = await User.findOne({ email });
    let accountType = "user";

    if (!account) {
      account = await Workshop.findOne({ email });
      accountType = "workshop";
    }

    if (!account) {
      return res.status(404).json({
        message: "Account not found.",
      });
    }

    if (!account.verifyCode || !account.codeExpire) {
      return res.status(400).json({
        message: "No reset request found.",
      });
    }

    if (account.verifyCode !== token) {
      return res.status(400).json({
        message: "Invalid reset code.",
      });
    }

    if (account.codeExpire < new Date()) {
      return res.status(400).json({
        message: "Reset code has expired.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Reset code verified successfully.",
      accountType,
    });
  } catch (error) {
    console.error("Verify forgot password token error:", error);
    return res.status(500).json({
      message: "Server error. Please try again later.",
    });
  }
};

export default verifyForgotPasswordToken;
