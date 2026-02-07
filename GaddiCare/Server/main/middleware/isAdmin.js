const isAdmin = (req, res, next) => {
  try {
    const user = req.authUser;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login.",
      });
    }

    if (user.userType !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export default isAdmin;
