import JWT from "jsonwebtoken";
import userModel from "../Models/userModel.js";

//User Authentication
export const isAuth = async (req, res, next) => {
  const token = req?.headers["authorization"]?.replace("Bearer ", "");
  // const token =req.Cookie;
  //Validation
  if (!token) {
    return res.status(401).send({
      success: false,
      message: "UnAuthorized User",
    });
  }
  // const decodeData = JWT.verify(token, process.env.JWT_SECRET);
  // req.user = await userModel.findById(decodeData._id);
  next();
};

//ADMIN AUTH ISADMIN

export const isAdmin = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(401).send({
      success: false,
      message: "You are not Admin",
    });
  }
  next();
};
