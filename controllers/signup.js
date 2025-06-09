const UserModel = require('../models/userModel')
const bcrypt = require('bcrypt')

module.exports = Signup =async(req,res)=>{
    console.log("Signup",req.body);
    try {
        const {username, email, password} = req.body;
        if(!email){
            throw new Error("Email is required")
        }
        if(!username){
            throw new Error("Name is required")
        }
        if(!password){
            throw new Error("Password is required")
        }
        if (await UserModel.findOne({email})) {
            res.json({
                message: {message: "Email already exists"},
                error:true,
                success:false,
            })
        } else {
            let salt = bcrypt.genSaltSync(10);
            let hashPassword = await bcrypt.hashSync(password,salt);
            const payload={
                ...req.body,
                password:hashPassword,
            }
            let newuser = await new UserModel(payload);
            
            let userindb=await newuser.save();
            res.status(201).json({
                message : "User registered successfully",
                error : false,
                success : true,
                data :userindb,
        })
    }
    } catch (error) {
        res.json({
            message : err,
            error : true,
            success : false,
        })
    }
}