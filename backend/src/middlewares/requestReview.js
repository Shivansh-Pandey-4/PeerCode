const { default: mongoose } = require("mongoose");
const { requestReviewParamsSchema } = require("../zod-validation/requestSchema");

function requestReview(req, res, next){
     const requestId = req.params?.requestId;
     const status = req.params?.status;

     const result = requestReviewParamsSchema.safeParse({status, requestId});

     if(!result.success){
         return res.status(400).json({
             success : false,
             msg : "invalid values provided",
             error : result.error.issues
         })
     }

     if(!mongoose.Types.ObjectId.isValid(requestId)){
           return res.status(400).json({
               success : false,
               msg : "invalid requestId provided"
           })
     }

     if(req.user._id.toString() === requestId){
          return res.status(400).json({
              success : false,
              msg : "requestId cannot be same to userId"
          })
     }

     next();
}

module.exports = requestReview;