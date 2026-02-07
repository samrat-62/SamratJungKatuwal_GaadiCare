import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Workshop from "../models/workshop.js";

const setAuthUser = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      req.authUser = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let authUser = await User.findOne({ userId: decoded.userId }).select("-password");


    if (!authUser) {
      authUser = await Workshop.findOne({ workshopId: decoded.userId }).select("-password");
    }

    req.authUser = authUser || null;
    next();
  } catch (error) {
    req.authUser = null;
    next();
  }
};

export default setAuthUser;
