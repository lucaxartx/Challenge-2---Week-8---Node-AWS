const Joi = require('joi');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AccountObject = Joi.object({
    firstName: Joi.string().min(3).required(),
    lastName: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),
    confirmPassword: Joi.string().min(5).required(),
    carType: Joi.string().required(),
    zipCode: Joi.string().required(),
    city: Joi.string().required(),
    country: Joi.string().required(),
});

const accountSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 3,
    },
    lastName: {
        type: String,
        required: true,
        minlength: 3,
    },
    email: {
        type: String,
        required: true,
        minlength: 3,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
    },
    carType: {
        type: String,
        required: true,
    },
    zipCode: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true
    },
})


accountSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

accountSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

const AccountModel = mongoose.model('Account', accountSchema);

module.exports = {AccountModel, AccountObject};