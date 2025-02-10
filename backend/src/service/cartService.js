import Product from "../models/productModel.js";
import Cart from "../models/cartModel.js";
import CustomError from "../utils/customError.js";

//add to cart 
export const addProductToCart = async (productId, userId) => {
    const existingProduct = await Product.findById(productId) 
    if (!existingProduct)
        throw CustomError("product is not found", 401)

    let cart = await Cart.findOne({ user: userId })  
    if (!cart) {
        cart = new Cart({ user: userId, products: [] });
    }

    const existingIndex = cart.products.findIndex((item) => item.product.toString() === productId)
    if (existingIndex > -1) {                                                                                // product is already in the cart
        const currentQuantity = cart.products[existingIndex].quantity;
        if (currentQuantity + 1 > existingProduct.quantity) {
            throw new CustomError("Insufficient stock. Cannot add more to the cart.", 400)
        }
        cart.products[existingIndex].quantity += 1
        await cart.save();
        return;
        // throw new CustomError("Product already exists in the cart, ", 400)    //quantity increased.
    }
    else {
        cart.products.push({ product: productId, quantity: 1 })
    }
    await cart.save()
}

export const getUserCart = async (userId) => {
    const cart = await Cart.findOne({ user: userId }).populate("products.product");
    
    return cart
}

export const removeProductFromCart = async (userId, productId) => {
    const result = await Cart.updateOne(
        { user: userId },
        { $pull: { products: { product: productId } } }
    );
    if (result.modifiedCount === 0) {
        throw new CustomError("Failed to remove the product from the cart.", 500);
    }
};
