const mongoose=require("mongoose");

const schma=new mongoose.Schema({
    ids:String,
    Username:String,
    Email:String,
    Password:String,
    isActive:Boolean,
   
})

const base=mongoose.model("User",schma)
module.exports=base;