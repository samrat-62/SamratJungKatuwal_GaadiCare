import bcrypt from "bcrypt";
import User from "../../models/user.js";
import Workshop from "../../models/workshop.js";
import { generateAccessToken } from "../../service/jsonWebService.js";

const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    let account = await User.findOne({ email });
    let accountType = "user";

    if (!account) {
      account = await Workshop.findOne({ email });
      accountType = "workshop";
    }

    if (!account) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = generateAccessToken(account.userId || account.workshopId);

    return res
      .status(200)
      .cookie("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: "Login successful",
        userType: account.userType,
      });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export default handleLogin;
