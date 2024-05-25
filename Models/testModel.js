import Mongoose from "mongoose";

const BrandSchema = new Mongoose.Schema({
  model: {
    type: String,
    required: [true, "Please Add Model Name"],
  },
  brand: {
    type: String,
    required: [true, "Please Add Brand Name"],
  },
  color: {
    type: String,
    required: [true, "Please Add Color Name"],
  },
  Price: {
    type: Number,
    required: [true, "Please Add Price"],
  },
  size: [
    {
      height: {
        type: String,
        required: [true, "Please Add Height"],
      },
      width: {
        type: String,
        required: [true, "Please Add Width"],
      },
    },
  ],
});

export const BrandModel = Mongoose.model("Mongo-Assignment", BrandSchema);
export default BrandModel;
