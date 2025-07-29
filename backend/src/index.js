const express = require("express");
const cookieParser = require("cookie-parser");
require('dotenv').config({path : "../.env"})
const app = express();
const port = 3000;
const authRouter = require("./routes/authRoutes");
const profileRouter = require("./routes/profileRoutes");
const connectionRequestRouter = require("./routes/connectionRequestRoutes");
const  mongoose = require("mongoose");



async function connectDb(){
     try{
        await mongoose.connect(process.env.MONGO_DB_CONN);
        console.log("connected to database successfully");
        app.listen(port,()=>{
            console.log(`app started listening on the port ${port}`);
        })
     }catch(err){
         console.log("failed to connect to the database : ",err.message);
     }
}
connectDb();

app.use(cookieParser(),express.json());

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",connectionRequestRouter);

app.use((err,req,res,next)=>{
     if(err){
         return res.status(500).send({
             msg : "internal server issue",
             detailError : err.message
         })
     }
})

app.use((req,res,next)=>{
     return res.status(404).send({
         msg : "Not found",
         path : req.originalUrl,
         method : req.method
     })
})


