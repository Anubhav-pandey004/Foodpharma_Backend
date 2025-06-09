const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required', error: true, success: false });
        }

        if (!password) {
            return res.status(400).json({ message: 'Password is required', error: true, success: false });
        }

        const user = await UserModel.findOne({ email }).select('+password');

        if (!user) {
            return res.status(404).json({ message: 'User not found', error: true, success: false });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch){
            const tokendata = {
                _id : user._id,
                email : user.email
            }
            // console.log("Checkpoint4...............",user._id);
            
         
            //token
            const token = await jwt.sign(tokendata, process.env.JWT_SECRET, {expiresIn : "8h"})

            const tokenOption = {
                httpOnly : true,
                secure:true
            }
            console.log(token,tokenOption);
            //cookie, passing token in cookie
            res.cookie("token",token,tokenOption).json({
                message : "User signin successfully",
                error : false,
                success : true,
                data : token
            })
    }else{
        res.json({
            message : {message:"Incorrect password"},
            error : true,
            success : false,
        })
    }
    } catch (error) {
        res.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
};
