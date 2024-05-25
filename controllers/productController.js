import categoryModel from "../Models/categoryModel.js";
import productModel from "../Models/productModel.js";
import { getDataUri } from "../utils/features.js";
import cloudinary from "cloudinary";

// GET ALL PRODUCTS
export const getAllProdcutsController = async (req, res) => {
  const { keyword, category } = req.query;

  try {
    const products = await productModel
      .find({
        name: {
          $regex: keyword ? keyword : "",
          $options: "i",
        },
      })
      .populate("category");
    res.status(200).send({
      sucess: true,
      message: "All product fetched successfully",
      totalProduct: products.length,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      sucess: false,
      message: "Error in GET ALL PRODUCTS",
      error,
    });
  }
};

//Get Products in the base of name exits
export const getnameProductsController = async (req, res) => {
  const { name } = req.params;

  try {
    // Using regex to find products with names containing the provided keyword
    const products = await productModel.find({
      name: { $regex: name, $options: "i" },
    });

    // Sending response with the found products
    res.status(200).json({
      success: true,
      message: "Products found based on name.",
      totalProducts: products.length,
      products,
    });
  } catch (error) {
    console.error("Error in GET Name PRODUCTS:", error);
    // Sending error response
    res.status(500).json({
      success: false,
      message: "Error in GET Name PRODUCTS",
      error: error.message,
    });
  }
};

//GET Single PRODUCT
export const getSingleProdcutsController = async (req, res) => {
  try {
    //get Product id
    const product = await productModel.findById(req.params.id);
    //validation
    if (!product) {
      return res.status(404).send({
        sucess: false,
        message: "Product not found",
      });
    }
    res.status(200).send({
      sucess: true,
      message: "Product Found",
      product,
    });
  } catch (error) {
    console.log(error);
    //For object id error message
    if (error.name === "CastError") {
      return res.status(500).send({
        sucess: false,
        message: "Invalid id",
      });
    }
    res.status(500).send({
      sucess: false,
      message: "Error in GET Single Products API",
      error,
    });
  }
};

//Create Product
export const createProductcontroller = async (req, res) => {
  try {
    const { name, description, price, stock, category, images } = req.body;
    const existingCategory = await categoryModel.findOne({ _id: category });

    if (!existingCategory) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }

    // Validation and Cloudinary upload
    if (!req.file) {
      return res.status(500).send({
        success: false,
        message: "Please provide a file Image",
      });
    }

    const file = getDataUri(req.file);
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    const image = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };

    // Create the product
    const createdProduct = await productModel.create({
      name,
      description,
      price,
      category,
      stock,
      images: [image],
    });

    // Update the category's products array
    existingCategory.products.push(createdProduct._id);
    await existingCategory.save();

    res.status(201).send({
      success: true,
      message: "Product created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Create Products API",
      error: error.message,
    });
  }
};

//Update Products
export const updateProductController = async (req, res) => {
  try {
    //Fine Product
    const product = await productModel.findById(req.params.id);
    //validation
    if (!product) {
      return res.status(500).send({
        sucess: false,
        message: "Product not found",
      });
    }
    const { name, description, price, category, stock } = req.body;
    //Validate and Update
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (category) product.category = category;
    if (stock) product.stock = stock;

    await product.save();
    res.status(200).send({
      sucess: true,
      message: "Product saved successfully",
    });
  } catch (error) {
    console.log(error);
    //Cast Error || Object ID
    if (error.name === "CastError") {
      return res.status(500).send({
        sucess: false,
        message: "InvalidId",
      });
    }
    res.status(500).send({
      sucess: false,
      message: "Error in Update Products API",
      error,
    });
  }
};

//Update Product Image
export const updateProductImageCOntroller = async (req, res) => {
  try {
    //find product
    const product = await productModel.findById(req.params.id);
    //validations
    if (!product) {
      return res.status(404).send({
        sucess: false,
        message: "Product not found",
      });
    }
    //check file
    if (!req.file) {
      return res.status(404).send({
        sucess: false,
        message: "Product Image not found",
      });
    }
    const file = getDataUri(req.file);
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    const image = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };
    //save
    product.images.push(image);
    await product.save();
    res.status(200).send({
      sucess: true,
      message: "Image Upoaded successfully",
    });
  } catch (error) {
    console.log(error);
    //Cast Error || Object ID
    if (error.name === "CastError") {
      return res.status(500).send({
        sucess: false,
        message: "InvalidId",
      });
    }
    res.status(500).send({
      sucess: false,
      message: "Error in Update Products API",
      error,
    });
  }
};

//Delete product Image
export const deleteProductImage = async (req, res) => {
  try {
    // find produtc
    const product = await productModel.findById(req.params.id);
    // validatin
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product Not Found",
      });
    }

    // image id find
    const id = req.query.id;
    if (!id) {
      return res.status(404).send({
        success: false,
        message: "product image not found",
      });
    }

    let isExist = -1;
    product.images.forEach((item, index) => {
      if (item._id.toString() === id.toString()) isExist = index;
    });
    if (isExist < 0) {
      return res.status(404).send({
        success: false,
        message: "Image Not Found",
      });
    }
    // DELETE PRODUCT IMAGE
    await cloudinary.v2.uploader.destroy(product.images[isExist].public_id);
    product.images.splice(isExist, 1);
    await product.save();
    return res.status(200).send({
      success: true,
      message: "Product Image Dleteed Successfully",
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
      message: "Error In Get DELETE Product IMAGE API",
      error,
    });
  }
};

//Delete Product
export const deleteProductController = async (req, res) => {
  try {
    //find product
    const product = await productModel.findById(req.params.id);
    //Validation
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }
    //find and delete Image cloudniary
    for (let index = 0; index < product.images.length; index++) {
      await cloudinary.v2.uploader.destroy(product.images[index].public_id);
    }
    await product.deleteOne();
    res.status(200).send({
      success: true,
      message: "Successfully deleted",
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
      message: "Error In Get DELETE Product IMAGE API",
      error,
    });
  }
};
