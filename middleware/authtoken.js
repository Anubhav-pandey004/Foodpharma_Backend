const jwt = require('jsonwebtoken')

async function authToken (req,res,next){
    try {
        const token = req.cookies?.token
        if(!token){
            return res.status(401).json({
                 message : 'Unauthorized',
                 error : true,
                 success : false
             })
         }

        jwt.verify(token, process.env.JWT_SECRET, function(err, decoded){
            if(err || !decoded){
                return res.status(401).json({
                    message: 'Unauthorized',
                    error: true,
                    success: false
                })
            }
            if (!req.user) {
                req.user = {};
            }
            req.user.id = decoded._id
            return next()
        })
    } catch (err) {
        res.status(401).json({
            message : 'Unauthorized',
            data:[],
            error : true,
            success : false
        })
    }
}

module.exports = authToken
