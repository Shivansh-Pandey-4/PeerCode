const express = require("express");
const {userSigninSchema,userSignupSchema} = require("../zod-validation/userSchema");
const router = express.Router();
const UserModel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



router.post("/signup", async(req,res)=>{
    const {firstName,lastName,gender,email,password,age} = req.body;

    const response = userSignupSchema.safeParse(req.body);

    if(!response.success){
         return res.status(400).send({
             msg : "invalid credential format",
             detailError : response.error
         })
    }


     try{

          const userExist = await UserModel.findOne({email});
          if(userExist){
              return res.status(400).send({
                 msg : "email should be unique"
              })
          }

          const hashedPassword = await bcrypt.hash(password,10);
          const newUser = await UserModel.create({
             firstName,lastName,age , email, password : hashedPassword, gender
          });

          const token = jwt.sign({user_id : newUser._id, name : newUser.firstName}, process.env.USER_JWT_SECRET, {expiresIn : "1d"});

          if(!newUser || !token){
              return res.status(500).send({
                 msg : "Internal server error during signup"
              })
          }

          res.cookie("token",token,{httpOnly: true , maxAge : 24*60*60*1000});
          return res.send({
             msg : "user signed up successfully" 
          })

     }catch(err){
         return res.status(500).send({
             msg : "server issue",
             detailError : err.message
         })
     }
})

router.post("/signin",async(req,res)=>{
     const {email, password} = req.body;

     const response = userSigninSchema.safeParse(req.body);

     if(!response.success){
         return res.status(400).send({
             msg : "invalid credential format",
             detailError : response.error
         })
     }

     try{
        const userExist = await UserModel.findOne({email});
        if(!userExist){
             return res.status(400).send({
                 msg : "invalid username or password"
             })
        }

        const passwordVerify = await bcrypt.compare(password,userExist.password);
        if(!passwordVerify){
             return res.status(400).send({
                 msg : "invalid username or password"
             })
        }

        const token = jwt.sign({user_id : userExist._id, name: userExist.firstName},process.env.USER_JWT_SECRET, {expiresIn : "1d"});

        if(!token){
             throw new Error("failed to generate jwt token");
        }

        res.cookie("token", token, {httpOnly : true, maxAge :24*60*60*1000})
        return res.send({
             msg : "user logged in successfully",
        })

     }catch(err){
         return res.status(500).send({
             msg : "user login failed",
             detailError : err.message
         })
     }
})

router.post("/logout", (req,res)=>{
         res.clearCookie("token",{httpOnly: true});
         return res.send({
             msg : "Logout successfully"
         })
})



module.exports = router;