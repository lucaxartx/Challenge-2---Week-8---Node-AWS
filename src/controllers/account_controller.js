const { StatusCodes } = require('http-status-codes')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const CustomError = require('../errors');
const {AccountModel, AccountObject} = require('../models/accounts_schema');


const createAccount = async (req, res) => {
    try {
       
        const { error, value } = AccountObject.validate(req.body);

     if (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details });
     }
  
     
     const existingAccount = await AccountModel.findOne({ email: value.email });
     if (existingAccount) {
         return res.status(StatusCodes.BAD_REQUEST).json({error: "Email already exists"});
    }
        
        if(value.password !== value.confirmPassword){
            return res.status(StatusCodes.BAD_REQUEST).json({error: "Password and Confirm Password does not match"});
        }

    delete value.confirmPassword;

    const newAccount = await AccountModel.create(value);

    newAccount.password = undefined;

    res.status(StatusCodes.CREATED).json({data: newAccount});
       
   
    } catch (error) {
        console.log(error);
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({"statusCode": StatusCodes.INTERNAL_SERVER_ERROR , message: error.message, error: "Internal Server Error"});
    }
    
};

const getAccount = async (req, res) => {
    
    const accounts = await AccountModel.find({}, {password: 0});
    res.status(StatusCodes.OK).json({data: accounts});
}

const loginObj = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),
});

const loginUser = async (req, res) => {
    try {
        const { error, value } = loginObj.validate(req.body);
         
        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details });
        }


        const existingAccount = await AccountModel.findOne({ email: value.email });
        console.log(existingAccount);
        if (!existingAccount) {
            return res.status(StatusCodes.BAD_REQUEST).json({error: "Email does not exists"});
        }

        const isMatch = await bcrypt.compare(value.password, existingAccount.password);

        if (!isMatch) {
            return res.status(StatusCodes.BAD_REQUEST).json({error: "Invalid Credentials"});
        }

        const token = jwt.sign({ id: existingAccount._id, email: existingAccount.email}, process.env.JWT_SECRET, {expiresIn: '1d',})

        existingAccount.password = undefined;
        existingAccount.email = undefined;
        existingAccount.__v = undefined;
        existingAccount.carType = undefined;
        existingAccount.zipCode = undefined;
        existingAccount.city = undefined;
        existingAccount.country = undefined;
        existingAccount.password = undefined;

        res.status(StatusCodes.OK).json({user: existingAccount, token});

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({"statusCode": StatusCodes.INTERNAL_SERVER_ERROR , message: error.message, error: "Internal Server Error"});
    }
}


const updateAccount = async (req, res) => {
    try {
        const {firstName, lastName, email, password, confirmPassword, carType, zipCode, city, country} = req.body;
        
        if(!email){
            return res.status(StatusCodes.BAD_REQUEST).json({error: "Email is required"});
        }

        const existingAccount = await AccountModel.findOne({ email: email });
        if (!existingAccount) {
            return res.status(StatusCodes.BAD_REQUEST).json({error: "user with this email does not exists"});
        }

        if(firstName){
            existingAccount.firstName = firstName;
        }

        if(lastName){
            existingAccount.lastName = lastName;
        }

        if(carType){
            existingAccount.carType = carType;
        }

        if(zipCode){
            existingAccount.zipCode = zipCode;
        }

        if(city){
            existingAccount.city = city;
        }

        if(country){
            existingAccount.country = country;
        }

        
        if(password){
            if(!confirmPassword){
                throw new CustomError.BadRequestError("Confirm Password is required");
            }

            if(password !== confirmPassword){
                throw new CustomError.BadRequestError("Password and Confirm Password does not match");
            }

            existingAccount.password = password;
        }

        await existingAccount.save();

        existingAccount.password = undefined;
        existingAccount.__v = undefined;

        res.status(StatusCodes.OK).json({user: existingAccount});

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({"statusCode": StatusCodes.INTERNAL_SERVER_ERROR , message: error.message, error: "Internal Server Error"});
    }
};




module.exports = {createAccount,getAccount, loginUser, updateAccount};