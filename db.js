const mongoose  = require("mongoose");
require('dotenv').config()

const DB_CONNECTION_STRING = process.env.DB_URL;

mongoose.connect(DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology:true,
}).then(()=>{
console.log("Connected to mongodb...");
}).catch((error)=>{
    console.log("Mongoose connect error ---> \n" +error);
})