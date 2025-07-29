const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/userAuth");
const ConnectionRequestModel = require("../models/connectionRequestModel");


router.get("/user/requests/received",userAuth, async(req,res)=>{
         try{
              const allRequest = await ConnectionRequestModel.find({toUserId : req.user_id, status : "interested"}).populate({path : "fromUserId",select : "firstName lastName age skills about gender photoUrl"});

              if(allRequest.length === 0){
                     return res.status(400).send({
                         msg : "no request exist"
                     })
              }
              return res.send({
                 msg : `${allRequest.length} requests exist`,
                 allRequest
              })

         }catch(err){
              return res.status(500).send({
                 msg : "internal server issue",
                 detailError : err.message
              })
         }
})

router.get("/user/connections",userAuth, async(req,res)=>{
      try{
         const allConnections = await ConnectionRequestModel.find({
             $or : [{toUserId : req.user_id, status: "accepted"},
                    {fromUserId : req.user_id, status : "accepted"}

             ] }).populate([{path : "fromUserId", select : "firstName lastName age gender about skills photoUrl"},{path : "toUserId", select : "firstName lastName age gender about skills photoUrl"}]);

         if(allConnections.length === 0){
             return res.status(400).send({ 
                 msg : "no connections exist"
             })
         }

         const data = allConnections.map((row)=> {
             if(row.fromUserId._id.toString() === req.user_id.toString()){
                  return row.toUserId
             }else {
                 return row.fromUserId;
             }
         });

         return res.send({
             msg : "connections exist",
             data
         })

      }catch(err){
          return res.status(500).send({
              msg : "internal server issue"
          })
      }
})

module.exports = router;