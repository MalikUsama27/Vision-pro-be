import { response } from "express";
import orderModel from "../Models/orderModel.js";
import productModel from "../Models/productModel.js";
import { stripe } from "../index.js";

//order Controller
export const createOrderController = async (req, res) => {
  console.log("Received request body:", req.body);
  try {
    const { shippingInfo, orderItems, paymentMethod } = req.body;

    // if (!shippingInfo || !Array.isArray(orderItems) || orderItems.length === 0 || !paymentMethod) {
    //   return res.status(400).send({
    //     success: false,
    //     message: 'Please add all required details for the order',
    //   });
    // }

    const itemPrice = orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const totalAmount = itemPrice + shippingInfo.shippingCharges;

    const createdOrder = await orderModel.create({
      user: req.user._id,
      shippingInfo,
      orderItems,
      paymentMethod,
      itemPrice,
      shippingCharges: shippingInfo.shippingCharges,
      
      orderStatus: "processing",
    });

    for (const orderItem of orderItems) {
      const product = await productModel.findById(orderItem.product);
      if (!product) {
        return res.status(400).send({
          success: false,
          message: "Invalid product ID in orderItems",
        });
      }
      product.stock -= orderItem.quantity;
      await product.save();
    }

    res.status(201).send({
      success: true,
      message: "Order Placed Successfully",
      order: createdOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in Create Order API",
      error,
    });
  }
};

//GET All Orders _MY ORDER
export const getMyOrdersController = async (req, res) => {
  try {
    //Find Order
    const orders = await orderModel.find({ user: req.user._id });

    //validation
    if (!orders) {
      return res.status(404).send({
        success: false,
        message: "Order not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Your Order Data",
      totalOrder: orders.length,
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In My Create Order API",
      error,
    });
  }
};

//Single Order Controller
export const singleOrderController = async (req, res) => {
  try {
    //find Product
    const order = await orderModel.findById(req.params.id);
    //validation
    if (!order) {
      return res.status(404).send({
        success: false,
        message: "Order not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Order successfully Fetched",
      order,
    });
  } catch (error) {
    console.log(error);
    // cast error ||  OBJECT ID
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error while  single order api",
    });
  }
};

// ACCEPT PAYMENTS
export const paymetsController = async (req, res) => {
  try {
    // get ampunt
    const { totalAmount } = req.body;
    // validation
    if (!totalAmount) {
      return res.status(404).send({
        success: false,
        message: "Total Amount is require",
      });
    }
    const { client_secret } = await stripe.paymentIntents.create({
      amount: Number(totalAmount * 100),
      currency: "inr",
    });
    res.status(200).send({
      success: true,
      client_secret,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Get UPDATE Products API",
      error,
    });
  }
};

//Admin Order
export const getAdminAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.status(200).send({
      success: true,
      message: "Orders Data All",
      totalOrders: orders.length,
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Admin-Orders Data Api Error",
      error,
    });
  }
};

// CHANGE ORDER STATUS
export const changeOrderStatusController = async (req, res) => {
  try {
    // find order
    const order = await orderModel.findById(req.params.id);
    // validation
    if (!order) {
      return res.status(404).send({
        success: false,
        message: "order not found",
      });
    }
    if (order.orderStatus === "processing") order.orderStatus = "shipped";
    else {
      return res.status(500).send({
        success: false,
        message: "order already delivered",
      });
    }
    await order.save();
    res.status(200).send({
      success: true,
      message: "order status updated",
    });
  } catch (error) {
    console.log(error);
    // cast error || OBJECT ID
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error In Get UPDATE Products API",
      error,
    });
  }
};
