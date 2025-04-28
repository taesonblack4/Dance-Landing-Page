/*
VALIDATION LOGIC

WHY THIS MATTERS:

Early Validation --> Prevents invalid data from reaching controllers

Security --> Basic password complexity requirement

Consistency --> Same rules apply across all user creation endpoints

Error Handling --> Uses same error format as central handler
*/

const Joi = require('joi');

// User creation validation
exports.validateLogin = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().min(3).required(),
    password: Joi.string().min(6).required()
  });

  const { error } = schema.validate(req.body);
  if (error) return next(new Error(error.details[0].message));
  next();
};

// Lead creation validation
exports.validateLead = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).required()
  });

  const { error } = schema.validate(req.body);
  if (error) return next(new Error(error.details[0].message));
  next();
};
