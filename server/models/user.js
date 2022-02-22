const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255
  },
  lastName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id }, process.env.PRIVET_KEY, { expiresIn: "2d" });
};

const User = mongoose.model('User', userSchema);

module.exports = User;

/**
 * VALIDATE USER REGISTRATION FORM FIELDS
 * @param {*} data 
 * @returns 
 */
const validateUserSchema = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(255).required().label("First Name"),
    lastName: Joi.string().min(2).max(255).required().label("Last Name"),
    email: Joi.string().min(6).max(255).required().label("Email"),
    password: passwordComplexity().required().label("Password"),
  });
  return schema.validate(data);
};


/**
 * VALIDATE USER LOGIN FORM FIELDS
 * @param {*} data 
 * @returns 
 */
function validLoginFileds(data) {
  const schema = Joi.object({
    email: Joi.string().min(6).max(255).required().label("Email"),
    password: Joi.string().required().label("Password"),
  });
  return schema.validate(data);
}

module.exports = {
  User,
  validateUserSchema,
  validLoginFileds,
}
