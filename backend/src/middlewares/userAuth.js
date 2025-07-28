const jwt = require("jsonwebtoken");


const userAuth = (req,res,next)=>{
    const {token} = req?.cookies;

    if(!token){
         return res.status(401).send({
             msg : "token is not provided in the header"
         })
    }     

    try{
         const decode = jwt.verify(token,process.env.USER_JWT_SECRET);
         req.user_id = decode.user_id;
         next();
    }catch(err){
         if (err.name === 'TokenExpiredError') {
            return res.status(401).send({ msg: "Token has expired" });
        }
        return res.status(400).send({ msg: "Invalid token" });
    }
}

module.exports = userAuth;