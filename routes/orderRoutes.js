import express from "express";
import {
  createOrderController,
  getMyOrdersController,
  singleOrderController,
  paymetsController,
  getAdminAllOrdersController,
  changeOrderStatusController,
} from "../controllers/orderController.js";
import { isAdmin, isAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

//Order Routes
router.post("/create", isAuth, createOrderController);

//Get All Routes
router.get("/my-order", isAuth, getMyOrdersController);

//GET SIGNGLE ORDER
router.get("/my-order/:id", isAuth, singleOrderController);

//Accpect Payment
router.post("/payments", isAuth, paymetsController);

//Admin Routes
///getALl product
router.get(
  "/admin/get-all-orders",
  isAuth,
  isAdmin,
  getAdminAllOrdersController
);

//change order status
router.put("/admin/order/:id", isAuth, isAdmin, changeOrderStatusController);
export default router;
