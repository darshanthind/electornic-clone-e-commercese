const mongoose=require("mongoose");

const store= new mongoose.Schema({
    Productname:String,
    Description:String,
    Price:Number,
    Discount:Number,
    Ranking:String,
    Categories:String,
    ProductCount:String,
    img:String
});

const storage=mongoose.model("Product_coll",store);
module.exports=storage;