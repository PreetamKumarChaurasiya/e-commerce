const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const searchSchema=Schema({
    productId:{
        type:String
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
        default:"https://cdn.vectorstock.com/i/500p/65/30/default-image-icon-missing-picture-page-vector-40546530.jpg",
        set:(v)=> v===""?"https://cdn.vectorstock.com/i/500p/65/30/default-image-icon-missing-picture-page-vector-40546530.jpg":v
    },
    price:{
        type:Number
    }
    

});
const Search=mongoose.model("Search",searchSchema);
module.exports=Search;