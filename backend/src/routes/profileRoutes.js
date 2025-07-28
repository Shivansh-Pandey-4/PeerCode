const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/userAuth");
const UserModel = require("../models/UserModel");
const profileEditSchema = require("../zod-validation/profileEditSchema");


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

router.patch("/profile/edit", userAuth, async (req,res)=>{
    const allowedFields = ["firstName", "lastName", "age", "gender", "skills", "photoUrl", "about"]; 

    const isEditAllowed = Object.keys(req.body).every((field) => allowedFields.includes(field));

    if(!isEditAllowed){
         return res.status(400).send({
             msg : "invalid edit request"
         })
    }

     const response = profileEditSchema.safeParse(req.body);

     if(!response.success){
         return res.status(400).send({
             msg : "invalid credentail format",
             detailError : response.error
         })
     }


      const requestField = Object.keys(req.body);

      const validFieldsToUpdate = requestField.filter((field) => allowedFields.includes(field));

      const updateField = {};
      validFieldsToUpdate.forEach((field) => updateField[field] = req.body[field]);

      try{
          const updateUser = await UserModel.findOneAndUpdate({_id : req.user_id},{ $set : updateField}, {runValidators : true, new : true});

          if(!updateUser){
              throw new Error("failded to update the user");
          }
          return res.send({
             msg : "user updated successfully"
          })

      }catch(err){

        return res.status(500).send({
             msg : "internal server issue",
             detailError : err.message
        })
      }

})


module.exports = router;