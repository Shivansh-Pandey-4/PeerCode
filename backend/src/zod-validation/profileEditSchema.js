const zod = require("zod");

const profileEditSchema = zod.object({
     firstName : zod.string().min(2,{message : "minimum 2 characters are required"}).max(30,{message : "maximum 30 characters are allowed only"}).optional(),

     lastName : zod.string().min(2,{message : "minimum 2 characters are required"}).max(30,{message : "maximum 30 characters are allowed only"}).optional(),

     age : zod.number({message : "type number is required"}).min(16,{message : "minimum age 16 is required"}).optional(),

     gender : zod.enum(["female","male","others"],{message : "gender can be male, female or others"}).optional(),

     photoUrl : zod.url({message : "photoUrl should be a url only"}).optional(),

     skills : zod.array(zod.string().min(1,{message: "empty value is not allowed in skill array"})).max(15).optional(),

     about : zod.string(200, {message : "maximum 200 characters are allowed only"}).min(2, {message: "minimum 2 characters are required" }).optional()
})

module.exports = profileEditSchema;