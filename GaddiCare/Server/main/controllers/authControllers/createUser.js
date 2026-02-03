import User from "../../models/user.js";
import NewUser from "../../models/newUser.js";
import { v4 as uuidv4 } from "uuid";

const verifyEmailAndCreateUser = async (req, res) => {
  const { email, token } = req.body;

  if (!email || !token) {
    return res.status(400).json({ message: "Email and token are required." });
  }

  try {

    const pendingUser = await NewUser.findOne({ email });

    if (!pendingUser) {
      return res.status(404).json({ message: "User not found or already verified." });
    }


    if (pendingUser.verifyCode !== token) {
      return res.status(400).json({ message: "Invalid verification code." });
    }


    if (pendingUser.codeExpire < new Date()) {
      return res.status(400).json({ message: "Verification code expired." });
    }

    const newUser = new User({
      userId: uuidv4(),
      userName: pendingUser.userName,
      email: pendingUser.email,
      password: pendingUser.password, 
      phoneNumber: pendingUser.phoneNumber,
      userType:pendingUser.userType
    });

    await newUser.save();
    await NewUser.deleteOne({ _id: pendingUser._id });

    res.status(201).json({ message: "Email verified successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export default verifyEmailAndCreateUser;
