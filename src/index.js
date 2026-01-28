import {app} from "./app.js"
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import connectDB from "./db/index.js";



connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`app is listening on port ${process.env.PORT}`);
    })
})
.catch(()=>{
    console.log("Mongodb connection failed",err)
})