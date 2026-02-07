import Workshop from "../../models/workshop.js";
import sendWorkshopStatusEmail from "../../service/nodemailer/workshopStatus.js";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";

export const updateWorkshopStatus = async (req, res) => {
  try {
    const { workshopId } = req.params;
    const { status } = req.body; 

    if (!workshopId || !status) {
      return res.status(400).json({
        success: false,
        message: "Workshop ID and status are required",
      });
    }

    if (!["accepted", "rejected"].includes(status)) {

      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const workshop = await Workshop.findOne({ workshopId });

    if (!workshop) {
      return res.status(404).json({
        success: false,
        message: "Workshop not found",
      });
    }


    if (status === "rejected") {
      if (workshop.workshopImage) {
    const imagePath = path.resolve(`./Upload${workshop.workshopImage}`);

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }
      await Workshop.findOneAndDelete({ workshopId });

      await sendWorkshopStatusEmail({
        email: workshop.email,
        status: "rejected",
      });

      return res.status(200).json({
        success: true,
        message: "Workshop rejected and email sent",
      });
    }

    if (status === "accepted") {
        const hashedPassword = await bcrypt.hash(workshop?.password, 10);
        await sendWorkshopStatusEmail({
            email: workshop.email,
            status: "accepted",
            password: workshop.password,
        });

        workshop.accountVerified = true;
        workshop.password = hashedPassword;
        await workshop.save();

      return res.status(200).json({
        success: true,
        message: "Workshop approved and email sent",
      });
    }

  } catch (error) {
    console.error("Update workshop status error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
