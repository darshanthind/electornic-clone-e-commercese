const mongoose=require("mongoose");


const base=new mongoose.Schema({
    Product_id:String,
    User_id:String,
    Username:String,
    Products:[
        {
        Productname:String,
        Quentity:Number,
        Description:String,
        Price:Number,
        Discount:Number,
        Categories:String,
        img:String
        }
    ],
    Total:Number
})
const stor=mongoose.model("product_cart",base);
module.exports=stor;