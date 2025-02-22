import mongoose from "mongoose";

const productSchema=new mongoose.Schema({
  name:{type:String,required:true},
  price:{type:Number,required:true},
  quantity:{type:Number,required:true},
  description:{type:String,required:true},
  // categories:{type:String,required:true},
  // images:{type:String,required:true},
  category: [{ type: String, required: true }],
  url: [{ type: String, required: true }],
  // categories: { type: [String], required: true }, // Ensure this is an array
  // images: { type: [String], required: true }, // Ensure this is an array
  isDelete:{type:Boolean,required:true,default:false}
})

const products=mongoose.model('product',productSchema)


export default products;
