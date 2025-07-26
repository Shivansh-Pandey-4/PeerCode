const zod = require("zod");

const userSignupSchema = zod.object({
     email : zod.string().email({message: "invalid email format"}),

     password : zod.string().min(6,{message: "minimum 6 characters required in password field"}).max(50,{message: "maximum 50 characters are allowed in the password field"}),

     gender : zod.enum(["female","male","others"]),

     age : zod.number({message: "format number is required in the age field"}).min(16,{message:"minimum 16 years required to signup"}),

     firstName : zod.string().min(3,{message: "minimum 3 characters are required in the firstName field"}),
     lastName : zod.string().min(2, {message : "minimum 2 characters required in the last Name field"})

});

const userSigninSchema = zod.object({
     email : zod.string().email({message : "invalid email format"}),
     password : zod.string().min(6,{message : "minimum 6 characters are required in the password field"}).max(50, {message : "maximum 50 characters are allowed in the password field"})
})

module.exports = {userSignupSchema, userSigninSchema};