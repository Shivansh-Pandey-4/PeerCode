const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        minlength : 3
    },
    lastName : {
        type : String
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
         type : String,
         required : true
    },
    gender : {
        type : String,
        required : true
    },
    age : {
        type : Number,
        required : true
    }
});

const UserModel =  mongoose.model("User",userSchema);

module.exports = UserModel;