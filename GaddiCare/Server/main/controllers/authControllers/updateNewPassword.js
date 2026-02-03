import bcrypt from "bcrypt";
import User from "../../models/user.js";

const updatePassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({
      message: "Email and new password are required.",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.verifyCode = undefined;
    user.codeExpire = undefined;

    await user.save();

    return res.status(200).json({
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error("Update password error:", error);
    return res.status(500).json({
      message: "Server error. Please try again later.",
    });
  }
};

export default updatePassword;
