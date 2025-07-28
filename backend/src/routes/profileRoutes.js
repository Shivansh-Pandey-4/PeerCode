const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/userAuth");
const UserModel = require("../models/UserModel");
const profileEditSchema = require("../zod-validation/profileSchema");


router.get("/profile/view",userAuth, async(req,res)=>{
     const user_id = req.user_id;
     try{
         const userExist = await UserModel.findById(user_id);
         if(!userExist){
             return res.status(400).send({
                 msg : "no user exist with this user_id"
             })
         }

         return res.send({
             success : true,
             userExist
         })
     }catch(err){
         return res.status(500).send({
             msg : "internal server issue",
             detailError : err.message
         })
     }
})



module.exports = router;