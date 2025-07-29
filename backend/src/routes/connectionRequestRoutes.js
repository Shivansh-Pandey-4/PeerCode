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


module.exports = router;