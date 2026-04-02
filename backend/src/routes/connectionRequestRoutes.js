const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/userAuth");
const ConnectionRequestModel = require("../models/connectionRequestModel");
const UserModel = require("../models/UserModel");
const mongoose = require("mongoose");
const requestSend = require("../middlewares/requestSend");


router.post("/send/:status/:toUserId", userAuth, requestSend, async(req,res)=>{
        
            const status = req.params?.status;
            const toUserId = req.params?.toUserId;

            const userExist = await UserModel.findById(toUserId);
            if(!userExist){
                 return res.status(400).json({
                     success : false,
                     msg : "invalid userId provided"
                 })
            }
             
            const existingConnnectionRequest = await ConnectionRequestModel.findOne({
                 $or : [ {
                     toUserId, fromUserId : req.user._id   
                 },
                {
                    toUserId : req.user._id , fromUserId : toUserId
                } ]
            });

            if(existingConnnectionRequest){
                 return res.status(400).json({
                    success : false,
                     msg : "already connection request exist"
                 })
            }


            try{
                const newConnection = await ConnectionRequestModel.create({
                    toUserId , fromUserId : req.user._id , status
                })
                

                res.json({
                    success : true,
                    msg : `connection request of ${status} sent successfully`
                })   

            }catch(err){
                 
                 return res.status(500).json({
                    success : false,
                     msg :"something went wrong",
                     error : err.message
                 })
            }
        }
);

router.post("/review/:status/:requestId", userAuth, async(req,res)=>{
         const {status, requestId} = req.params;
         if((status === "accepted" || status === "rejected") && requestId){
            try{
                if(!mongoose.Types.ObjectId.isValid(requestId)){
                    return res.status(400).send({
                        msg : "invalid request id"
                    })
                }
                
                const connectionRequest = await ConnectionRequestModel.find({
                    _id : requestId,
                    toUserId : req.user_id,
                    status : "interested"
                })
                
                if(!connectionRequest){
                    return res.status(404).send({
                        msg : "no connection request found"
                    })
                }
                
                const response = await ConnectionRequestModel.findOneAndUpdate({_id : requestId},{$set : {status : status}}, {runValidators : true, new : true});

                if(!response){
                     throw new Error("Db operation failed");
                }

                return res.send({
                    msg : `connection request is ${status} successfully`
                })
                
            }catch(err){
                  return res.status(500).send({
                       msg : "internal server issue",
                       detailError : err.message
                  })
            }

         }else {
             return res.status(400).send({
                 msg : `invalid status : ${status} or requestId : ${requestId}`
             })
         }
});



module.exports = router;