const mongoose=require("mongoose");
const initData=require("./data.js");

const Item=require("../Models/list.js");

main().then((res)=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
});
async function main(){
     await mongoose.connect("mongodb://127.0.0.1:27017/ElectronicGadgets");
}
const initDB=async()=>{
    await Item.deleteMany({});
    let res=await Item.insertMany(initData.data);
    console.log(res);
    console.log("data was initilized");
}
initDB();