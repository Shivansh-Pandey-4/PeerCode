const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/userAuth");
const UserModel = require("../models/UserModel");
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

router.get("/user/feed", userAuth, async (req,res)=>{
       try{
        
        //    const allUsers = await UserModel.find({}).select("-password -email");
        //    if(allUsers.length === 0){
        //         return res.status(400).send({
        //              msg : "no users exist in your feed"
        //         })
        //    }

        //    const everyOneExceptMe = allUsers.filter((user)=> user._id.toString()!= req.user_id.toString());


        //    const myAllRequest = await ConnectionRequestModel.find({
        //         $or : [{toUserId : req.user_id},{fromUserId : req.user_id}]
        //    }).populate([{path: "fromUserId", select : "firstName lastName"},{path : "toUserId", select : "firstName lastName"}]);


        //    if(myAllRequest.length === 0){
        //         return res.send({
        //             msg : "your feed",
        //             everyOneExceptMe
        //         })
        //    }

        //        const refineData = myAllRequest.map((user)=>{
        //            if(user.fromUserId){
        //                if(user.fromUserId._id.toString()!= req.user_id.toString()){
        //                    return user.fromUserId;
        //                 }
        //             }else if(user.toUserId){
        //                 if(user.toUserId._id.toString()!= req.user_id.toString()){
        //                     return user.toUserId;
        //                 }
        //             }
        //         })

        //         const allIds = refineData.map((user) => user._id.toString());
        //         const finalData = everyOneExceptMe.filter((user) => {
        //               if(!allIds.includes(user._id.toString())){
        //                     return user;
        //               }
        //         })

        //         return res.send({
        //              msg : "your user feed",
        //              finalData
        //         })

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 20 ? 10 : limit;

        const skip = (page - 1)*limit ;


        const connectionRequests = await ConnectionRequestModel.find({
            $or: [{ fromUserId: req.user_id }, { toUserId: req.user_id }],
            }).select("fromUserId  toUserId");

            const hideUsersFromFeed = new Set();
                connectionRequests.forEach((req) => {
                    hideUsersFromFeed.add(req.fromUserId.toString());
                    hideUsersFromFeed.add(req.toUserId.toString());
                });

            const users = await UserModel.find({
            $and: [
                    { _id: { $nin: Array.from(hideUsersFromFeed) } },
                    { _id: { $ne: req.user_id } },
                ],
            }).select("-email -password -createdAt -updatedAt").skip(skip).limit(limit);

            return res.send({
                 msg : "your feed",
                 users
            })
          
       }catch(err){
          return res.status(500).send({
             msg : "internal server issue",
             detailError : err.message
          })
       }
})

module.exports = router;