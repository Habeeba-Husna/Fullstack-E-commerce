import mongoose from "mongoose";


const wishlistSchema=new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:'user',required:true},
    wishlist:[{type:mongoose.Schema.Types.ObjectId,ref:'product'}]
})
const Favourite=mongoose.model('favourite',wishlistSchema)

export default Favourite;
