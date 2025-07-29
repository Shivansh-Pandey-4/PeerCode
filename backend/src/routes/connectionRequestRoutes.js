const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/userAuth");
const ConnectionRequestModel = require("../models/connectionRequestModel");
const UserModel = require("../models/UserModel");
const mongoose = require("mongoose");


router.post("/request/send/:status/:toUserId",userAuth, async(req,res)=>{
        const {status, toUserId} = req.params;
        
        if( (status==="interested" || status==="ignored") && toUserId){

            if (!mongoose.Types.ObjectId.isValid(toUserId)) {
                    return res.status(400).send({
                        msg: "Invalid userId format"
                    });
                }

            const validUserId = await UserModel.findById(toUserId);
            if(!validUserId){
                 return res.status(400).send({
                     msg : "invalid userId"
                 })
            }
             
            const existingConnnectionRequest = await ConnectionRequestModel.findOne({
                 $or : [ {
                     toUserId, fromUserId : req.user_id   
                 },
                {
                    toUserId : req.user_id , fromUserId : toUserId
                } ]
            });

            if(existingConnnectionRequest){
                 return res.status(400).send({
                     msg : "already connection request exist"
                 })
            }


            try{
                const newConnection = await ConnectionRequestModel.create({
                    toUserId , fromUserId : req.user_id , status
                })
                
                if(!newConnection){
                    return res.status(400).send({
                        msg : "invalid connection request"
                    })
                }

                res.send({
                    msg : `connection request of ${status} sent successfully`
                })   

            }catch(err){
                 return res.status(500).send({
                     msg : err ? err.message :"internal server issue",
                 })
            }
        }else {
             return res.status(400).send({
                 msg : `invalid connection status :${status} or toUserId :${toUserId}`
             })
        }

});

router.post("/request/review/:status/:requestId", userAuth, async(req,res)=>{
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