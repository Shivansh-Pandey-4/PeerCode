const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");


const userAuth = async (req,res,next)=>{
    const token = req.cookies?.token;

    if(!token){
         return res.status(401).json({
            success : false,
             msg : "Authentication token missing"
         })
    }     

    try{
         const decode = jwt.verify(token, process.env.USER_JWT_SECRET);
         const userExist = await UserModel.findById(decode.user_id);

         if(!userExist){
             return res.status(400).json({
                 success : false,
                 msg : "user not found"
             })
         }

         req.user = userExist;
         next();

    }catch(err){

         if (err instanceof jwt.TokenExpiredError) {
             return res.status(401).json({
                 success : false,
                 msg : "token is expired : login again",
                 error : err.message
             })
        }

        if(err instanceof jwt.JsonWebTokenError){
             return res.status(400).json({
                 success : false,
                 msg : "invalid token provided",
                 error : err.message
             })
        }
        
        return res.status(400).json({
             success : false,
             msg : "authentication failed",
             error : err.message
        })
    }
}

module.exports = userAuth;