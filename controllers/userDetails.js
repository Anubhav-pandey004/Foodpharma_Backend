const userModel = require('../models/userModel')

module.exports.userDetails=async(req,res)=>{
    try {
        
        const user = await userModel.findById(req.user.id)

        res.status(200).json({
            message : "User Details fetched successfully",
            error : false,
            success : true,
            data : user
        })
    } catch (error) {
        message=error.message
        res.status(400).json({
            message : message || error,
            error : true,
            success : false,
        })
    }
}