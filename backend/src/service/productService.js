import Product from '../models/productModel.js';
import CustomError from '../utils/customError.js';

//get product

export const productService=async({search,category,page=1,limit=10})=>{
    const query={isDelete:false}

    //Add search

    if(search){
        query.$or=[
            {name:{$regex:search,$options:'i'}},
            {category:{$regex:search,$options:'i'}}
        ]
    }

    //Add category

    if(category){
        query.category={$regex:`^${category}$`, $options:'i'}
    }


    //pagination

    const skip=(page-1)*limit
    const total=await Product.countDocuments(query)
    const product=await Product.find(query).skip(skip).limit(limit)
    // const product=await products.find()

    return{
        product,
        pagination:{
            total,
            page,
            limit,
            totalPages:Math.ceil(total/limit)
        }
    }
}

//add new Product

export const addProductService=async({ name, ...rest })=>{
    console.log("Saving Product:", name, rest);

    const existingItem=await Product.findOne({name})
    if(existingItem){
        throw new CustomError('Product already exists',400)
    }
    const newProduct=new Product({ name, ...rest });
    await newProduct.save()
    return newProduct
}

//delete single product

export const deleteProductService=async(productId)=>{
    const existingProduct=await Product.findById(productId)
    if(!existingProduct){
        throw new CustomError('Product is unavailable',400)
    }
    return await Product.findByIdAndUpdate(
        productId,{isDelete:true},{new:true}
    )

}

//update a Product

export const updateProductService = async (_id, updateItems) => {
    console.log("123456789")
    const existing = await Product.findById(_id);
    if (!existing) {
      throw new CustomError("Product is unavailable", 400);
    }
  
    const data = await Product.findByIdAndUpdate(
      _id,  // No need for `isDelete:false` in query
      { $set: { ...updateItems } },
      { new: true }
    );
  
    return data;
  };
  

//get single product

export const singleProductService=async(id)=>{
    const existingproduct=await Product.findById(id)
    // console.log(existingproduct)
    if(!existingproduct){
        throw new CustomError('product is not available',400)
    }
    return existingproduct
}



