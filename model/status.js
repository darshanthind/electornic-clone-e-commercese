const mongoose=require("mongoose")


const status=new mongoose.Schema({
    Deadline:String,
    Status:String,
    Result:String
})

module.exports=mongoose.model("Status",status);