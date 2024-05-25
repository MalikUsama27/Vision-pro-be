import categoryModel from "../Models/categoryModel.js";
import productModel from "../Models/productModel.js";
import mongoose from "mongoose";

//Create a new Category Controllwer
export const createCategoryController = async (req, res) => {
  try {
    const { category } = req.body;
    if (!category) {
      return res.status(404).send({
        success: false,
        massage: "Please enter a category name",
      });
    }
    await categoryModel.create({ category });
    res.status(201).send({
      success: true,
      message: `${category}Category created successfully`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      Message: "Error creating category APi",
    });
  }
};

//Get All Categories
//Get All Categories with Products
export const getCategoryController = async (req, res) => {
  try {
    const categories = await categoryModel.find().populate("products");
    res.status(200).send({
      success: true,
      message: "Categories fetched successfully with products",
      totalCategories: categories.length,
      categories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in GET ALL category API",
      error: error.message,
    });
  }
};

//Delete  CATtegory controller
export const deleteCategoryController = async (req, res) => {
  try {
    // find category
    const category = await categoryModel.findById(req.params.id);
    //validation
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }
    // find product with this category id
    const products = await productModel.find({ category: category._id });
    // update producty category
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      product.category = undefined;
      await product.save();
    }
    // save
    await category.deleteOne();
    res.status(200).send({
      success: true,
      message: "Catgeory Deleted Successfully",
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
      message: "Error In DELETE CAT API",
      error,
    });
  }
};

//Update Category
export const updateCategoryController = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { updatedCategoryName, category } = req.body;

    // Validate if categoryId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).send({
        success: false,
        message: "Invalid categoryId format",
      });
    }

    // Validate category existence
    const existingCategory = await categoryModel.findById(categoryId);
    if (!existingCategory) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }

    // Update category name if provided
    if (updatedCategoryName) {
      existingCategory.category = updatedCategoryName;
    }

    // Save changes to the category
    await existingCategory.save();

    res.status(200).send({
      success: true,
      message: "Category Updated Successfully",
    });
  } catch (error) {
    console.error("Error in updateCategoryController:", error);

    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id",
      });
    }

    res.status(500).send({
      success: false,
      message: "Error In UPDATE CATEGORY API",
      error,
    });
  }
};

//Single category
export const SinglegetCategoryController = async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Use findById to query the database based on the categoryId
    const category = await categoryModel
      .findById(categoryId)
      .populate("products");

    // Check if the category is found
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // If the category is found, send it in the response
    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
