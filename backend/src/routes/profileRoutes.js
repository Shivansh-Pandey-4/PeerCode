const express = require("express");
const userAuth = require("../middlewares/userAuth");
const UserModel = require("../models/UserModel");
const mongoose = require("mongoose");

const profileEditSchema = require("../zod-validation/profileEditSchema");

const router = express.Router();

router.get("/view", userAuth, (req,res)=>{
    
         const user = req.user;

         return res.json({
             success : true,
             msg : "profile found successfully",
             user
         })
})


router.patch("/edit", userAuth, async (req, res)=>{

      const result = profileEditSchema.safeParse(req.body);
      if(!result.success){
         return res.status(400).json({
             success : false,
             msg : "invalid credential provided",
             error : result.error.issues
         })
      }

      try {
            const data = result.data;
            const allowedFields = ["firstName", "lastName", "age", "gender", "skills", "photoUrl", "about"];

            const updateField = {};
            for(let key of allowedFields){
                 if(data[key] !== undefined){
                     updateField[key] = data[key];
                 }
            }

            if(Object.keys(updateField).length === 0){
                  return res.status(400).json({
                      success : false,
                      msg : "provided fields are not allowed",
                  })
            }

            const newUpdatedProfile = await UserModel.findByIdAndUpdate(req.user._id, { $set : updateField}, {runValidators : true, returnDocument : "after"}).select("-password");

            if(!newUpdatedProfile){
                 return res.status(400).json({
                     success : false,
                     msg : "user not found"
                 })
            }

            return res.json({
                 success : true,
                 msg : "user profile updated successfully",
                 newUpdatedProfile
            })

      } catch (err) {
           if(err instanceof mongoose.MongooseError){
                return res.status(400).json({
                     success : false,
                     msg : `failed to updated profile : ${err.cause}`,
                     error : err.message
                })
           }

           return res.status(500).json({
               success : false,
               msg : "something went wrong",
               error : err.message
           })
      }
})


module.exports = router;