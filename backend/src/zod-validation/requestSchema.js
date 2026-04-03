const zod = require('zod');


const requestSendParamsSchema = zod.object({
     status : zod.enum(["interested", "ignored"], "invalid param status provided"),
     toUserId : zod.string().trim().min(1, "id not provided")
})

const requestReviewParamsSchema = zod.object({
      status : zod.enum(["accepted", "rejected"], "invalid status param provided"),
      requestId : zod.string().trim().min(1, "id not provided")
})

module.exports = {requestSendParamsSchema, requestReviewParamsSchema};