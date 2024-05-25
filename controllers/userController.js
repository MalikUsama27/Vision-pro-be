import userModel from "../Models/userModel.js";
import { getDataUri } from "../utils/Features.js";
import cloudinary from "cloudinary";

//Register
export const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //Validation
    // if (
    //   !name ||
    //   !email ||
    //   !password ||
    //   !address ||
    //   !city ||
    //   !country ||
    //   !phone
    // ) {
    //   return res.status(400).send({
    //     success: false,
    //     massage: "Please enter All Fields",
    //   });
    // }

    //check exisiting user
    const exisitingUSer = await userModel.findOne({ email });
    //validation
    if (exisitingUSer) {
      return res.status(500).send({
        success: false,
        message: "Email Already Taken",
      });
    }
    const user = await userModel.create({
      name,
      email,
      password,
    });
    res.status(200).send({
      success: true,
      massage: "Register Success",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      massage: "Error In Register API",
      error,
    });
  }
};
//Login
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Please enter your email and password",
      });
    }

    // Check if the user exists
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Compare the entered password with the stored password
    if (password !== user.password) {
      return res.status(401).send({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate a token for the user
    const token = user.generateToken();

    res
      .status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000), // 300 days
        secure: process.env.NODE_ENV !== "Development", // Use secure cookies in production
        httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
        sameSite: process.env.NODE_ENV === "Development" ? "lax" : "strict", // Adjust sameSite attribute accordingly
      })
      .send({
        success: true,
        message: "Login successfully",
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name, // assuming user has a name field
        },
      });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in Login API",
      error: error.message,
    });
  }
};

//GET USER PROFILE
export const profileController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    user.password = undefined;
    res.status(200).send({
      success: true,
      message: "Profile pic Fetch",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: "false",
      message: "Error in Profile Api",
      error,
    });
  }
};

//lOGOUT
export const logoutController = (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", "", {
        expires: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000),
        secure: process.env.NODE_ENV === "Development" ? true : false,
        httpOnly: process.env.NODE_ENV === "Development" ? true : false,
        sameSite: process.env.NODE_ENV === "Development" ? true : false,
      })
      .send({
        success: true,
        message: "Logout successfully",
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: "false",
      message: "Error in Logout Api",
      error,
    });
  }
};

// Update Profile Controller
export const UpdateprofileController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    const { name, email, address, country, city, phone } = req.body;
    //Validation
    if (name) user.name = name;
    if (email) user.email = email;
    if (address) user.address = address;
    if (country) user.country = country;
    if (phone) user.phone = phone;
    if (city) user.city = city;

    //save user
    await user.save();
    res.status(200).send({
      success: true,
      message: "Success USer Profile Update successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: "false",
      message: "Error in Update Profile pic Api",
      error,
    });
  }
};

//Update User PAssword
export const udpatePasswordController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    const { oldPassword, newPassword } = req.body;
    //valdiation
    if (!oldPassword || !newPassword) {
      return res.status(500).send({
        success: false,
        message: "Please provide old or new password",
      });
    }
    // old pass check
    const isMatch = await user.comparePassword(oldPassword);
    //validaytion
    if (!isMatch) {
      return res.status(500).send({
        success: false,
        message: "Invalid Old Password",
      });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).send({
      success: true,
      message: "Password Updated Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In update password API",
      error,
    });
  }
};

//update User  profile
export const UpdateProfilePicController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    // file get from client photo
    const file = getDataUri(req.file);
    // delete prev image
    await cloudinary.v2.uploader.destroy(user.profilePic.public_id);
    // update
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    user.profilePic = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };
    // save func
    await user.save();

    res.status(200).send({
      success: true,
      message: "profile picture updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In update profile pic API",
      error,
    });
  }
};
