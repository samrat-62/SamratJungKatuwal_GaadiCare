import User from "../../models/user.js";
import Workshop from "../../models/workshop.js";
import { v4 as uuidv4 } from "uuid";

export const createWorkshop = async (req, res) => {
  try {
    const {
      workshopName,
      email,
      phoneNumber,
      workshopAddress,
      latitude,
      longitude,
      isLicenseNumber,
      servicesOffered,
      password,
      userType,
    } = req.body;

    if (
      !workshopName ||
      !email ||
      !phoneNumber ||
      !workshopAddress ||
      !latitude ||
      !longitude ||
      !isLicenseNumber ||
      !servicesOffered ||
      !password ||
      !userType
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (await User.findOne({ email }) || await Workshop.findOne({ email })) {
      return res.status(409).json({ success: false, message: "Email already exists" });
    }

    if (await User.findOne({ phoneNumber }) || await Workshop.findOne({ phoneNumber })) {
      return res.status(409).json({ success: false, message: "Phone number already exists" });
    }

    if (await Workshop.findOne({ isLicenseNumber })) {
      return res.status(409).json({ success: false, message: "License number already exists" });
    }


    let imagePath = "";
    if (req.file) {
      imagePath = `/workshopImage/${req.file.filename}`;
    }

    const newWorkshop = new Workshop({
      workshopId: uuidv4(),
      workshopName,
      email,
      phoneNumber,
      workshopAddress,
      latitude,
      longitude,
      isLicenseNumber,
      servicesOffered: JSON.parse(servicesOffered), 
      password,
      userType,
      workshopImage: imagePath,
      accountVerified: false,
    });

    await newWorkshop.save();

    return res.status(201).json({
      success: true,
      message: "Registration submitted for approval! You will be notified via email.",
    });

  } catch (error) {
    console.error("Workshop register error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
