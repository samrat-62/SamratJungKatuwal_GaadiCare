import { Router } from "express";
import handleNewUser from "../controllers/authControllers/handleNewUser.js";
import verifyEmailAndCreateUser from "../controllers/authControllers/createUser.js";
import handleLoginUser from "../controllers/authControllers/loginUser.js";
import resendVerificationCode from "../controllers/authControllers/resendVerificationToken.js";
import getAuthUser from "../controllers/authControllers/getAuthUser.js";
import { logout } from "../controllers/authControllers/logoutUser.js";
import handleForgotPassword from "../controllers/authControllers/handelForgetPass.js";
import verifyForgotPasswordToken from "../controllers/authControllers/verifyForgetPassToken.js";
import updatePassword from "../controllers/authControllers/updateNewPassword.js";
import uploadUserImg from "../service/Multer/uploadUserImage.js";
import { uploadUserImage } from "../controllers/authControllers/handleUserImageUpload.js";
import { deleteUserImage } from "../controllers/authControllers/handleUserImageDelete.js";
import { updateUserProfile } from "../controllers/authControllers/updateUserProfile.js";

const authRouter = Router();

authRouter.post('/register-new-user',handleNewUser);
authRouter.post('/create-user',verifyEmailAndCreateUser);
authRouter.post('/login-user',handleLoginUser);
authRouter.post('/resend-verification-code/:email',resendVerificationCode);
authRouter.delete('/logout',logout);

authRouter.get("/get-auth-user", getAuthUser);
authRouter.post("/forget-password", handleForgotPassword);
authRouter.post("/verify-forget-password-token", verifyForgotPasswordToken);
authRouter.post("/update-password", updatePassword);
authRouter.post("/userImage",uploadUserImg.single("image"),uploadUserImage);
authRouter.delete("/deleteUserImage",deleteUserImage);
authRouter.patch("/updateUserProfile",updateUserProfile);

export default authRouter;