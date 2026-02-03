import bcrypt from "bcrypt";
import NewUser from "../../models/newUser.js";
import { generateVerificationToken } from "../../service/createVerifyToken.js";
import sendVerificationEmail from "../../service/nodemailer/verifyNewUser.js";

const handleNewUser = async (req, res) => {
  const { userName, email, password, phoneNumber, userType } = req.body;

  if (!userName || !email || !password || !phoneNumber || !userType) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const existingUser = await NewUser.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { token, expiresAt } = generateVerificationToken();

    const newUser = new NewUser({
      userName,
      email,
      phoneNumber,
      userType,
      password: hashedPassword,
      verifyCode: token,
      codeExpire: expiresAt,
    });

    await newUser.save();
    await sendVerificationEmail(email, token);

    res.status(201).json({
      message: "User registered successfully. Verify your email.",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export default handleNewUser;
