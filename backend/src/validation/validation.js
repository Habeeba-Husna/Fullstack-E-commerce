import Joi from "joi";

// Validation for register
export const registerValidation = Joi.object({
  name:Joi.string(),
  username: Joi.string()
    .min(4)
    .max(15)
    .required()
    .pattern(/^\S+$/)
    .messages({
      'string.min': 'Username must be at least 4 characters long.',
      'string.max': 'Username must not exceed 15 characters.',
      'string.empty': 'Username is required.',
      'string.pattern.base': 'Username must not contain spaces.',
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please enter a valid email address.',
      'string.empty': 'Email is required.',
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long.',
      'string.empty': 'Password is required.',
    }),
  // confirmPassword: Joi.string()
  //   .valid(Joi.ref('password'))
  //   .required()
  //   .messages({
  //     'any.only': 'Confirm Password must match Password.',
  //     'string.empty': 'Confirm Password is required.',
  //   }),
});

// Validation for login
export const loginValidation = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please enter a valid email address.',
      'string.empty': 'Email is required.',
    }),
  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Password is required.',
    }),
});






// import Joi from "joi";
// import mongoose from "mongoose";

// // User Registration Schema
// export const userValidationSchema = Joi.object({
//   name: Joi.string().required(),
//   username: Joi.string().required(),
//   email: Joi.string().email().required(),
//   password: Joi.string().min(6).required(),

  
//   // username: Joi.string().min(3).max(30).required(),
//   // email: Joi.string().email().required(),
//   // password: Joi.string()
//   //   .min(8)
//   //   .pattern(new RegExp("[A-Z]")) // At least one uppercase letter
//   //   .pattern(new RegExp("[0-9]")) // At least one number
//   //   .required(),
//   // name: Joi.string().min(3).max(50).required(),
//   isAdmin: Joi.boolean().default(false),
//   isBlock: Joi.boolean().default(false),
// });

// // User Login Schema
// export const loginValidationSchema = Joi.object({
//   email: Joi.string().email().required(),
//   password: Joi.string().required(),
// });

// // Product Validation Schema
// export const productValidationSchema = Joi.object({
//   _id: Joi.string().optional(),
//   name: Joi.string().min(3).max(50).required(),
//   price: Joi.number().positive().required(),
//   quantity: Joi.number().integer().min(0).required(),
//   url: Joi.string().uri().optional(),
//   description: Joi.string().min(10).max(500).required(),
//   category: Joi.string().min(3).max(50).required(),
//   isDelete: Joi.boolean().default(false),
// });


// // Cart Validation Schema
// export const cartValidationSchema = Joi.object({
//   productId: Joi.string().custom((value, helper) => {
//     if (!mongoose.Types.ObjectId.isValid(value)) {
//       return helper.message("Invalid product ID");
//     }
//     return value;
//   }).required(),
// });

// // Wishlist Validation Schema
// export const wishlistValidationSchema = Joi.object({
//   id: Joi.string().custom((value, helper) => {
//     if (!mongoose.Types.ObjectId.isValid(value)) {
//       return helper.message("Invalid product ID");
//     }
//     return value;
//   }).required(),
// });


// // Order Validation Schema
// export const orderValidationSchema = Joi.object({
//   name: Joi.string().min(3).max(100).required(),
//   address: Joi.string().min(5).max(500).required(),
//   paymentMethod: Joi.string().valid("razorpay", "card", "paypal").required()
// });


// export const validateBody = (schema) => (req, res, next) => {
//   const { error } = schema.validate(req.body, { abortEarly: false });

//   if (error) {
//     return res.status(400).json({ errors: error.details.map((err) => err.message) });
//   }
//   next();
// };

// export const validateParams = (schema) => (req, res, next) => {
//   const { error } = schema.validate(req.params, { abortEarly: false });

//   if (error) {
//     return res.status(400).json({ errors: error.details.map((err) => err.message) });
//   }
//   next();
// };

