const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const orderSchema=Schema({
    orderName:{
        type:String
    },
    orderImage:{
        type:String
    },
    orderPrice:{
        type:Number
    },
    orderStatus:{
        type:String
    },
    orderAddress:{
        type:String
    },
    customerName:{
        type:String
    },
    mobNo:{
        type:String
    },
    status:{
        type:String
    }
    
    

});
const Order=mongoose.model("Order",orderSchema);
module.exports=Order;