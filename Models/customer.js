const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Cart=require("./cart.js");
const Order=require("./order.js");

let customerSchema= Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
       
    },
    mobNo:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    orders:[
        {
            type:Schema.Types.ObjectId,
            ref:"Order",
        }
    ],
    carts:[
       {
        type:Schema.Types.ObjectId,
        ref:"Cart",
       }
    ]
});
const Customer=mongoose.model("Customer",customerSchema);
module.exports=Customer;

