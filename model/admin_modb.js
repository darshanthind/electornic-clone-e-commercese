const mongoose=require("mongoose");

const shema=new mongoose.Schema({
    Username:{
        type:String
    },
    Password:{
        type:String
    },
    Email:{
        type:String
    },
    Active:{
        type:Boolean
    }
})
const base=mongoose.model('admindata',shema);
module.exports=base;