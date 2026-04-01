const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        trim : true,
        required : true,
        minLength : 2,
        maxLength : 50
    },
    lastName : {
        type : String,
        trim : true,
        maxLength : 50
    },
    email : {
        type : String,
        trim : true,
        required : true,
        unique : true,
        lowercase : true
    },
    password : {
         type : String,
         trim : true,
         required : true
    },
    gender : {
        type : String,
        required : true,
        enum: ["male", "female", "others"]
    },
    age : {
        type : Number,
        min : 16,
        required : true
    },
    photoUrl : {
         type : String,
         required : true,
         trim : true,
         default : "https://t4.ftcdn.net/jpg/07/91/22/59/360_F_791225927_caRPPH99D6D1iFonkCRmCGzkJPf36QDw.jpg"
    },
    skills : {
         type : [String]
    },
    about : {
         type : String,
         required : true,
         trim: true,
         default : "Hey there! I'm new here."
    }
},{timestamps : true});

const UserModel =  mongoose.model("User",userSchema);

module.exports = UserModel;