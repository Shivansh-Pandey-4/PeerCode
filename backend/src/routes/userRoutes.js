const express = require("express");
const {userSigninSchema,userSignupSchema} = require("../zod-validation/userSchema");
const router = express.Router();
const UserModel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



router.post("/signup", async(req,res)=>{
    const {firstName,lastName,gender,email,password,age} = req.body;

    const response = userSignupSchema.safeParse({firstName : firstName.trim(), lastName : lastName.trim(), age, gender : gender.trim(), email : email.trim(), password : password.trim()});

    if(!response.success){
         return res.status(400).send({
             msg : "invalid credential format",
             detailError : response.error
         })
    }


     try{
          const hashedPassword = await bcrypt.hash(password.trim(),10);
          if(!hashedPassword){
             return res.status(500).send({
                 msg : "issue with bcrypt library"
             })
          }

          const newUser = await UserModel.create({
            firstName, lastName, age, gender,email,password:hashedPassword
          })

          if(!newUser){
              return res.status(401).send({
                 msg : "failed to signup"
              })
          }

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
     const response = userSigninSchema.safeParse({email : email.trim(), password : password.trim()});

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
        const passwordVerify = await bcrypt.compare(password.trim(),userExist.password);
        if(!passwordVerify){
             return res.status(400).send({
                 msg : "invalid username or password"
             })
        }

        const token = jwt.sign({user_id : userExist._id, name: userExist.firstName},process.env.USER_JWT_SECRET);

        if(!token){
             throw new Error("failed to generate jwt token");
        }

        return res.send({
             msg : "user signed in successfully",
             token
        })

     }catch(err){
         return res.status(500).send({
             msg : "user signin failed",
             detailError : err.message
         })
     }
})

module.exports = router;