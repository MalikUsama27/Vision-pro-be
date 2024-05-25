import express from "express";
import {
  BrandController,
  UpdateBrandController,
  DeleteBrandController,
  GetBlueShoesController,
  GetBlueOrNeonShoesController,
  GetShoesInPriceRangeController,
  DropShoesCollectionController
} from "../controllers/testController.js";

//object ROUTER
const router = express.Router();

//routes
//create
router.post("/brand", BrandController);

//update
router.put("/update-brand/:id", UpdateBrandController);

//Delete data
router.delete("/brand-delete/:id", DeleteBrandController);

// Get Blue Shoes with Width 2cm
router.get("/shoes/blue/width2cm", GetBlueShoesController);

// Get Blue Shoes with Width 2cm
router.get('/shoes/blueOrNeon', GetBlueOrNeonShoesController);


router.get('/shoes/inPriceRange', GetShoesInPriceRangeController);

router.delete('/shoes/dropCollection', DropShoesCollectionController);

export default router;
