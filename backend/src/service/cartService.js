import products from "../models/productModel.js";
import Cart from "../models/cartModel.js";
import CustomError from "../utils/customError.js";

//add to cart

export const AddCartServices = async (productId, userId) => {
    const existingProduct = await products.findById(productId);
    if (!existingProduct) {
      throw new CustomError("Product not found", 404);
    }
  
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, products: [] });
    }
  
    const existingIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );
  
    if (existingIndex > -1) {
      if (cart.products[existingIndex].quantity + 1 > existingProduct.quantity) {
        throw new CustomError("Stock limit reached", 400);
      }
      cart.products[existingIndex].quantity += 1;
    } else {
      if (existingProduct.quantity < 1) {
        throw new CustomError("This product is out of stock", 400);
      }
      cart.products.push({ product: productId, quantity: 1 });
    }
  
    await cart.save();
    return await Cart.findOne({ user: userId }).populate("products.product");
  };
  
// export const AddCartServices=async(productId,userId)=>{
//     //find product
//     const existingProduct=await products.findById(productId)
//     if(!existingProduct){
//         throw new CustomError('product is not found',404)
//     }

//     //create cart of user
//     let cart=await Cart.findOne({user:userId})
//     if(!cart){
//         cart=new Cart({user:userId,products:[]})
//     }

//     const existingIndex=cart.products.findIndex(
//         (item)=>item.product.toString()===productId
//     );

//     if(existingIndex>-1){

//         const currentQuantity=cart.products[existingIndex].quantity 

//         // Ensure stock limit is not exceeded
//         if(currentQuantity+1>existingProduct.quantity){
//             throw new CustomError('You cannot add the product to the quantity,stock is empty',400)
//         }

//         // Increase quantity and save cart
//     //     cart.products[existingIndex].quantity+=1
//     //     await cart.save()
//     //     throw new CustomError('Product already exist in the cart',400) //quantity increased
//     // }
//     // else{
//     //     cart.products.push({product:productId,quantity:1})
//     //     await cart.save()
//     // }
//     //}

//     cart.products[existingIndex].quantity += 1;
// } else {
//   // Ensure the product has stock before adding it
//   if (existingProduct.quantity < 1) {
//     throw new CustomError("This product is out of stock", 400);
//   }

//   // Add new product with quantity 1
//   cart.products.push({ product: productId, quantity: 1 });
// }

// await cart.save();
// return cart; // Return updated cart
// };
    
//get cart
export const getCartServices=async(userId)=>{
    const cart=await Cart.findOne({user:userId}).populate('products.product')
    return cart
}

//delete one item in cart

export const removeCartServices=async(productId,userId)=>{
    const result = await Cart.updateOne(
        {user:userId},
        {$pull: {products:{product:productId}}}
    );
    // console.log('Update Result:', result);
    if(result.modifiedCount===0){
        throw new CustomError("Cart not found for the user or product not in cart.", 401)
    } 
}

//update quantity
export const updateCartService=async(productId,quantity,userId)=>{
    if(!productId ||quantity===null){
        throw new CustomError('product id and quantity are required',400)
    }
    const cart=await Cart.findOne({user:userId})
    if(!cart){
        throw new CustomError('cart not found this user')
    }
    // const productItem=cart.products.findIndex((item)=>item.product.toString()===productId);

  //   const productItem = cart.products.findIndex(
  //     (item) => item.product.toString() === new mongoose.Types.ObjectId(productId).toString()
  // );

  const productItem = cart.products.findIndex(
    (item) => item.product.equals(productId)
);


    if(productItem==-1){
        throw new CustomError('product not found in the cart',404)
    }
    const productDetails=await products.findById(productId)
    if(!productDetails){
        throw new CustomError('product not found',404)
    }
    if(quantity>productDetails.quantity){
        throw new CustomError('Insufficient stock for the requested quantity')
    }
    cart.products[productItem].quantity=quantity
    await cart.save()
    return cart
}





// import Product from "../models/productModel.js";
// import Cart from "../models/cartModel.js";
// import CustomError from "../utils/customError.js";

// //add to cart 
// export const addProductToCart = async (productId, userId) => {
//     if (!userId) {
//         throw new CustomError("User authentication failed", 401);
//     }
//     const existingProduct = await Product.findById(productId) 
//     if (!existingProduct)
//         throw CustomError("product is not found", 401)

//     let cart = await Cart.findOne({ user: userId })  
//     if (!cart) {
//         cart = new Cart({ user: userId, products: [] });
//         await cart.save();
//     }

//     const existingIndex = cart.products.findIndex((item) => item.product.toString() === productId)
//     if (existingIndex > -1) {                                                                                // product is already in the cart
//         const currentQuantity = cart.products[existingIndex].quantity;
//         if (currentQuantity + 1 > existingProduct.quantity) {
//             throw new CustomError("Insufficient stock. Cannot add more to the cart.", 400)
//         }
//         cart.products[existingIndex].quantity += 1
//         await cart.save();
//         return;
//         // throw new CustomError("Product already exists in the cart, ", 400)    //quantity increased.
//     }
//     else {
//         cart.products.push({ product: productId, quantity: 1 })
//     }
//     await cart.save()
// }

// export const getUserCart = async (userId) => {
//     const cart = await Cart.findOne({ user: userId }).populate("products.product");
    
//     return cart
// }

// export const    removeProductFromCart = async (userId, productId) => {
//     const result = await Cart.updateOne(
//         { user: userId },
//         { $pull: { products: { product: productId } } }
//     );
//     if (result.modifiedCount === 0) {
//         throw new CustomError("Failed to remove the product from the cart.", 500);
//     }
// };
