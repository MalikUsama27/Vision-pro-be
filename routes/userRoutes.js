import express from "express";
import {
  loginController,
  registerController,
  // profileController,
  // logoutController,
  // UpdateprofileController,
  // udpatePasswordController,
} from "../controllers/userController.js";
// import { isAuth } from "../middlewares/authMiddleware.js";

//router object
const router = express.Router();

//routes
//register routes
router.post("/register", registerController);

//login
router.post("/login", loginController);

//profile
// router.get("/profile", isAuth, profileController);

//logout
// router.get("/logout", isAuth, logoutController);



//update Profile
// router.put("/profile-update", isAuth, UpdateprofileController);

// updte password
// router.put("/update-password", isAuth, udpatePasswordController);

//Update prfile pic 
// router.put("/update-profilepic",isAuth, singleUpload,UpdateProfilePicController)

//export
export default router;
