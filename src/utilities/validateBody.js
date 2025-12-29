const joi = require("joi");

const loginSchema = joi.object({
  email: joi.string().email().trim().required(),
  password: joi.string().trim().min(8).required(),
});

const signupSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().email().trim().required(),
  password: joi.string().trim().min(8).required(),
});

module.exports = { loginSchema, signupSchema };
