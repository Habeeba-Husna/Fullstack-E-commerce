import Product from '../models/productModel.js';
import CustomError from '../utils/customError.js';

//add new product 

export const addProductionServices = async ({ name, ...rest }) => {
  const existingItem = await Product.findOne({ name });
  
  if (existingItem) {
    throw new CustomError("Product already exists.", 400);
  }

  const newProduct = new Product({ name, ...rest });
  await newProduct.save();
  return newProduct;
};


//update a Product

export const updateProductService=async(_id,updateItems)=>{     
  const existing=await Product.findById(_id)

  if(!existing){
      throw new CustomError('product is unavailable',400)
  }

  const data=await Product.findByIdAndUpdate({_id,isDelete:false},{ $set:{...updateItems}},{new:true})  
  //{new:true} -ensures that the function returns the updated document, not the old one
  return data
}

//delete single product

export const deleteProductService=async(productId)=>{
  const existingProduct=await Product.findById(productId)
  // console.log("Product id:", productId);  

  if(!existingProduct){
      throw new CustomError('Product is unavailable',400)
  }

  return await Product.findByIdAndUpdate(
      productId,{isDelete:true},{new:true}       //Soft Delete the Product
  )
}

//get allproducts

export const getAllProductsService = async ({ category, page = 1, limit = 10, search }) => {
  const query = { isDelete: false };

  if (category) {     //If a category is provided in the request
    query.category = { $regex: `^${category}$`, $options: "i" };
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
    ];
  }
  // console.log("Query:", query);

  const skip = (page - 1) * limit;        //  calculates how many documents to skip
  const total = await Product.countDocuments(query);   //total product count
  const products = await Product.find(query).skip(skip).limit(limit);    // query to find the products that match the conditions (query)


  return {
    products,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get product by ID single product

export const getProductByIdService = async (id) => {
  const productDetails = await Product.findById(id);
  
  if (!productDetails) {
    throw new CustomError('Product not found', 404);
  }

  return productDetails;
};
