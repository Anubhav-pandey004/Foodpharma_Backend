

const jwt = require('jsonwebtoken')

async function authToken (req,res,next){
    try {
        const token = req.cookies?.token
        // console.log("Token : ",token);
        
        if(!token){
            return res.status(200).json({
                 message : "Please login ...",
                 error : true,
                 success : false
             })
         }

        jwt.verify(token, process.env.JWT_SECRET,function(err,decoded){
            if(err){

            }
            // console.log("decoded info from token :",decoded);
            if (!req.user) {
                req.user = {};
            }
            req.user.id = decoded?._id
            console.log("req.user.id : ",req.user.id);
            
            next()
        })
    } catch (err) {
        res.status(400).json({
            message : err.message||err,
            data:[],
            error : true,
            success : false
        })
    }
}



module.exports =authToken