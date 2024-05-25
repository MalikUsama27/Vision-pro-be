import express from "express";
import {
  getAllProdcutsController,
  getSingleProdcutsController,
  createProductcontroller,
  updateProductController,
  updateProductImageCOntroller,
  deleteProductImage,
  deleteProductController,
  getnameProductsController,
} from "../controllers/productController.js";
import { isAdmin, isAuth } from "../middlewares/authMiddleware.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

//Product Routes
//GET ALL PRODUCT
router.get("/get-all", getAllProdcutsController);

//GET Single Product
router.get("/:id", getSingleProdcutsController);

//Get Products in the base of name exxits
router.get("/p/:name", getnameProductsController);

// Create Product
router.post("/create", isAuth, singleUpload, createProductcontroller);

//Update Product
router.put("/:id", isAuth, updateProductController);

//Update pic product
router.put(
  "/image/:id",
  isAuth,
  isAdmin,
  singleUpload,
  updateProductImageCOntroller
);

//delete product image
router.delete("/delete-image/:id", isAuth, deleteProductImage);

//delete Product
router.delete("/delete/:id", isAuth, deleteProductController);
export default router;
