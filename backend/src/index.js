const express = require("express");
require('dotenv').config({path : "../.env"})
const app = express();
const port = 3000;
const userRoutes = require("./routes/userRoutes");
const  mongoose = require("mongoose");



async function connectDb(){
     try{
        await mongoose.connect(process.env.MONGO_DB_CONN);
        console.log("connected to database successfully");
     }catch(err){
         console.log("failed to connect to the database : ",err.message);
     }
}

connectDb();


app.use("/api/user",userRoutes);


app.listen(port,()=>{
    console.log(`app started listening on the port ${port}`);
})