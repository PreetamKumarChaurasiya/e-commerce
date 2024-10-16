const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const cartSchema=Schema({
    type:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String
    },
    specification:{
        type:String
    },
    image:{
        type:String,
        default:"https://live.staticflickr.com/5207/5287310204_86fffc6c5a_b.jpg",
        set:(v)=> v===""?"https://live.staticflickr.com/5207/5287310204_86fffc6c5a_b.jpg":v
    },
    price:Number,
    

});
const Cart=mongoose.model("Cart",cartSchema);
module.exports=Cart;