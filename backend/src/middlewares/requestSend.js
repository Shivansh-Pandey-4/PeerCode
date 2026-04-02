const { default: mongoose } = require("mongoose");
const { requestSendParamsSchema } = require("../zod-validation/requestSchema");

function requestSend(req, res, next){

    const result = requestSendParamsSchema.safeParse(req.params);

    if(!result.success){
         return res.status(400).json({
             success : false,
             msg : "invalid values provided",
             error : result.error.issues
         })
    }

    const {toUserId, status} = result.data;

    if(!mongoose.Types.ObjectId.isValid(toUserId)){
          return res.status.json({
             success : false,
             msg : "invalid id value provided"
          })
    }

    if(req.user._id.toString() === toUserId){
          return res.status(400).json({
             success : false,
             msg : "user cannot send connection request to yourself"
          })
    }

    next();
}

module.exports = requestSend;