const mongoose=require("mongoose");
const status = require("./status");
const { stringify } = require("uuid");

const stores=new mongoose.Schema({
    UserName:String,
    ids:String,
    Purches:[
        {
            Products:[
                {
                 ProductName:String,
                Quentity:Number,
                
                Price:Number,
                Discount:Number,
                
                img:String,
                Status:{
                       Status_prod:String,
                       Result:String,
                       Deadline:String
                    }
              
                    
                

                }
               
            ],
            Total:Number,
            Date:String,
          
            

        }
    ],
    Totals:Number

})

const d=mongoose.model("Purches_collection",stores);
module.exports=d;