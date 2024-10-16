const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const currentUserSchema=Schema({
     username:{
          type:String,
          required:true,
          unique:true
      },
});
const CurrentUser=mongoose.model("CurrentUser",currentUserSchema);
module.exports=CurrentUser;