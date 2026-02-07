import bcrypt from "bcrypt";
import User from "../../models/user.js";
import Workshop from "../../models/workshop.js";

const updatePassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({
      message: "Email and new password are required.",
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

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    account.password = hashedPassword;
    account.verifyCode = undefined;
    account.codeExpire = undefined;

    await account.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully.",
      accountType,
    });
  } catch (error) {
    console.error("Update password error:", error);
    return res.status(500).json({
      message: "Server error. Please try again later.",
    });
  }
};

export default updatePassword;
