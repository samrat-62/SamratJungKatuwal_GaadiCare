import jwt from "jsonwebtoken";
import User from "../models/user.js";

const setAuthUser = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      req.authUser = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ userId: decoded.userId })
      .select("-password");

    req.authUser = user || null;
    next();

  } catch (error) {
    req.authUser = null;
    next();
  }
};

export default setAuthUser;
