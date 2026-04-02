const zod = require('zod');


const requestSendParamsSchema = zod.object({
     status : zod.enum(["interested", "ignored"], "invalid param status provided"),
     toUserId : zod.string().trim().min(1, "id not provided")
})

module.exports = {requestSendParamsSchema};