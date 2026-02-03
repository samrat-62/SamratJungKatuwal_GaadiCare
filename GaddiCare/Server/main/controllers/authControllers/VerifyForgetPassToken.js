import User from "../../models/user.js";

const verifyForgotPasswordToken = async (req, res) => {
  const { email, token } = req.body;

  if (!email || !token) {
    return res.status(400).json({
      message: "Email and token are required.",
    });
  }

  try {
    const user = await User.findOne({ email });


    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    if (!user.verifyCode || !user.codeExpire) {
      return res.status(400).json({
        message: "No reset request found.",
      });
    }

    if (user.verifyCode !== token) {
      return res.status(400).json({
        message: "Invalid reset code.",
      });
    }

    if (user.codeExpire < new Date()) {
      return res.status(400).json({
        message: "Reset code has expired.",
      });
    }

    return res.status(200).json({
      message: "Reset code verified successfully.",
    });
  } catch (error) {
    console.error("Verify forgot password token error:", error);
    return res.status(500).json({
      message: "Server error. Please try again later.",
    });
  }
};

export default verifyForgotPasswordToken;
