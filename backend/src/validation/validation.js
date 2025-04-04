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

