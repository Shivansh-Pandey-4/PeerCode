const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserModel = require("../models/UserModel");
const {userSigninSchema,userSignupSchema} = require("../zod-validation/userSchema");

const router = express.Router();


router.post("/signup", async(req,res)=>{

    const result = userSignupSchema.safeParse(req.body);

    if(!result.success){
         return res.status(400).json({
             success : false,
             msg : "invalid credential format",
             error : result.error.issues
         })
    }

     try{
          const {firstName, lastName, email, password} = result.data;

          const userExist = await UserModel.findOne({email});
          if(userExist){
              return res.status(400).json({
                 success : false,
                 msg : "email should be unique"
              })
          }

          const hashedPassword = await bcrypt.hash(password,10);
          const newUser = await UserModel.create({firstName, lastName, email, password : hashedPassword});

          const token = jwt.sign({user_id : newUser._id, name : newUser.firstName}, process.env.USER_JWT_SECRET, {expiresIn : "1d"});

          if(!token){
              throw new Error("failed to generate jwt token");
          }

          res.cookie("token", token, {httpOnly: true , maxAge : 24*60*60*1000});

          return res.json({
             success : true,
             msg : "user signed up successfully",
             newUser
          })

     }catch(err){
         return res.status(500).json({
             success : false,
             msg : "server issue",
             error : err.message
         })
     }
})

router.post("/signin",async(req,res)=>{

     const result = userSigninSchema.safeParse(req.body);

     if(!result.success){
         return res.status(400).json({
             success : false,
             msg : "invalid credential format",
             error : result.error.issues
         })
     }

     try{
        const userExist = await UserModel.findOne({email});
        if(!userExist){
             return res.status(400).json({
                 success : false,
                 msg : "invalid email or password"
             })
        }

        const passwordVerify = await bcrypt.compare(password,userExist.password);
        if(!passwordVerify){
             return res.status(400).json({
                 success : false,
                 msg : "invalid email or password"
             })
        }

        const token = jwt.sign({user_id : userExist._id, name: userExist.firstName},process.env.USER_JWT_SECRET, {expiresIn : "1d"});

        if(!token){
             throw new Error("failed to generate jwt token");
        }

        res.cookie("token", token, {httpOnly : true, maxAge :24*60*60*1000})
        return res.json({
             success : true,
             msg : "user logged in successfully",
             userExist
        })

     }catch(err){
         return res.status(500).json({
             success : false,
             msg : "user failed to login",
             error : err.message
         })
     }
})

router.post("/logout", (req,res)=>{
         res.clearCookie("token",{httpOnly: true});

         return res.json({
             success : true,
             msg : "Logout successfully"
         })
})



module.exports = router;