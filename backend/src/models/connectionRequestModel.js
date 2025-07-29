const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
     fromUserId : {
         type : mongoose.Schema.Types.ObjectId,
         required : true
     },
     toUserId : {
         type : mongoose.Schema.Types.ObjectId,
         required : true
     },
     status : {
        type : String,
        enum : {
             values : ["ignored", "interested", "rejected", "accepted"],
             message : `{VALUE} is not a valid connection type`
        }
     }
}, {timestamps : true});

connectionRequestSchema.pre("save", function(next){
      if(this.fromUserId.equals(this.toUserId)){
            const err = new Error("bad connection request: user cannot send connection request to itself ");
            return next(err);
      }
      next();
})

const ConnectionRequestModel = mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequestModel;