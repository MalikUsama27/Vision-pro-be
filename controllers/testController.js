// import BrandModel from "../Models/testModel.js";

// //create controlelr
// export const BrandController = async(req, res) => {

//   try {
//     const {model,brand,color,Price,size,height,width}=req.body;
//     // if(!model || !brand || color || size || height || width || Price) {
//     //   return res.status(404).send({
//     //     success:"false",
//     //     Message:'Please Add All filed data',
//     //   })
//     // }
//     await BrandModel.create({model,brand,color,size,Price,height,width    })
//     res.status(200).send({
//       message: "Data created successfully in Mongo DB",
//       success: true,
    
//     });
//   } catch (error) {
//     res.status(500).send({
//       success:false,
//       message: "Brand Create Routes Api Error",
//     })
//   }
// };


// //Update Controller Using id
// export const UpdateBrandController=async (req,res)=>{
//   try {
//     const brands= await BrandModel.findById(req.params.id);
   
//     const{model,brand,color,Price,size,height,width}=req.body;
//    if(model) brands.model= model;
//    if(brand) brands.brand=brand;
//    if(color) brands.color= color;
//    if(Price) brands.Price= Price;
//   //  if(size) brands.size= size;
//    if(height) brands.height= height; 
//    if(width) brands.width= width;

//     await brands.save();
//     res.status(200).send({
//       success: true,
//       message: 'Data Change Successfully',
//       brands
//     })
//   } catch (error) {
//     res.status(500).send({
//       success:false,
//       message: "Brand Update Routes Api Error",
//     })
//   }
// }

// //delete 
// export const DeleteBrandController=async(req,res)=>{
//   try {
//     const brands=await BrandModel.findById(req.params.id)
//     await brands.deleteOne();
//     res.status(200).send({
//       success: true,
//       message: "Brand deleted successfully",})
//   } catch (error) {
//     res.status(500).send({
//       success:false,
//       message: "Brand Delete Routes Api Error",
//     })
//   }
// }

// //// Get Blue Shoes with Width 2cm
// export const GetBlueShoesController = async (req, res) => {
//   try {
//     const shoes = await BrandModel.find({
//       color: 'Blue',
//     });

//     res.status(200).json({
//       success: true,
//       totalblueShoes: shoes.length,
//       shoes,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error in getShoesByColorAndWidth controller',
//       error: error.message,
//     });
//   }
// };


// export const GetBlueOrNeonShoesController = async (req, res) => {
//   try {
//     const colorsToMatch = ['blue', 'neon'];

//     const shoes = await BrandModel.find({
//       color: { $in: colorsToMatch.map(color => new RegExp(color, 'i')) },
//     });

//     res.status(200).json({
//       success: true,
//       totalLength: shoes.length,
//       shoes,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error in GetBlueOrNeonShoesController',
//       error: error.message,
//     });
//   }
// };


// export const GetShoesInPriceRangeController = async (req, res) => {
//   try {
//     const minPrice = 20;
//     const maxPrice = 80;

//     const shoes = await BrandModel.find({
//       Price: { $gte: minPrice, $lte: maxPrice },
//     });

//     res.status(200).json({
//       success: true,
//       totalstock:shoes.length,
//       shoes,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error in GetShoesInPriceRangeController',
//       error: error.message,
//     });
//   }
// };


// export const DropShoesCollectionController = async (req, res) => {
//   try {
//     await BrandModel.collection.drop();

//     res.status(200).json({
//       success: true,
//       message: 'Shoes collection dropped successfully.',
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error in DropShoesCollectionController',
//       error: error.message,
//     });
//   }
// };