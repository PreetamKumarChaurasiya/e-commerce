// requires basic packages and files
const express=require("express");
const methodOverride=require("method-override");
const path=require("path");
const ejsMate=require("ejs-mate");
const mongoose=require("mongoose");
const Item=require("./Models/list.js");
const Customer=require("./Models/customer.js");
const CurrentUser=require("./Models/currentUser.js");
const Cart=require("./Models/cart.js");
const Order=require("./Models/order.js");
const Search=require("./Models/search.js");
const customError=require("./customError.js");
const session=require("express-session");
const flash=require("connect-flash");

const app=express();
//basic setup

// database connectivity
main().then((res)=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
});
async function main(){
     await mongoose.connect("mongodb://127.0.0.1:27017/ElectronicGadgets");
}

// for creating sessions
let sessionOption={
     secret:"mysupersecretcode",
     resave:false,
     saveuninitialized:true,
     cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 *1000,
        maxAge:Date.now() + 7 * 24 * 60 * 60 *1000,
        httpOnly:true,
     }
}
app.use(session(sessionOption));
app.use(flash());

app.use((req,res,next)=>{
     res.locals.success=req.flash("success");
     res.locals.error=req.flash("error");
     next();
});

// for get data from post request that is send as a post request
app.use(express.urlencoded({extended:true}));

// form can only send  get and post request, to convert other type request
app.use(methodOverride("_method"));

// ejs file set path
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

// serving static files(css,js)
app.use(express.static(path.join(__dirname,"public")));

// for use ejs-mate
app.engine("ejs",ejsMate);

const port=8080;
app.listen(port,()=>{
    console.log(`Server started at port ${port}`);
});

// routes (Homepage)
app.get("/",(req,res)=>{
    res.send("Hii, I am root directory");
});

// homepage
app.get("/homepage",async(req,res,next)=>{
    try
    {
        let allItem=await Item.find({});
        res.render("homepage.ejs",{allItem});
    }
    catch(err)
    {
        next(new customError(500,"Failed to load Homepage"));
    }
    
});

//login
app.get("/homepage/login",(req,res)=>{
    res.render("loginform.ejs");
});

// signUp
app.get("/homepage/signup",(req,res)=>{
    res.render("signupform.ejs");
});

// show route(display specification of particular product)
app. get("/homepage/:id/showInfo",async (req,res,next)=>{
    try{
        let {id}=req.params;
        let item=await Item.findById(id);
        if(!item)
            throw new customError(500,"Item Not Found");
        res.render("show.ejs",{item});
    }
    catch(err){
        next(err);
    }
    
});

// admin panel
app.get("/admin",(req,res)=>{
    res.render("adminform.ejs");
});



// verification and login(get access to admin)
app.post("/admin/homepage",async(req,res,next)=>{
    try{
        let name="Admin";
        let pass="aa";
        let {username,password}=req.body;
        if(username==name && password==pass){
            let allItem=await Item.find({});
            res.render("alter.ejs",{allItem});
        }
    else{
            res.render("adminError.ejs");
        }
    }
    catch(err){
        next(err);
    }
    
   
   
});

app.get("/admin/homepage",async(req,res,next)=>{
    try
    {
        let allItem=await Item.find({});
        res.render("alter.ejs",{allItem});
    }
    catch(err){
        next(err);
    }
});

// delete particualar item(delete route)
app.delete("/admin/:id/delete",async (req,res,next)=>{
    try
    {
        let {id}=req.params;
        let deletedItem=await Item.findByIdAndDelete(id);
        req.flash("success","Deleted item successfully");
        let allItem=await Item.find({});
        res.redirect("/admin/homepage");
    
    }
    catch(err){
        next(err);
    }



   
});

// app.get("/admin/homepage",async(req,res)=>{
//     let allItem=await Item.find({});
//     res.render("alter.ejs",{allItem});
// });

//edit item(update route)
app.get("/admin/:id/edit",async(req,res,next)=>{
    try
    {
        let {id}=req.params;
        let item=await Item.findById(id);
        if(!item)
            throw new customError(500,"Item Not Found");
        res.render("edit.ejs",{item});
    }
    catch(err){
        next(err);
    }
    
});
app.put("/admin/:id",async(req,res,next)=>{
    try
    {
        let {id}=req.params;
        let item=req.body.item;
        await Item.findByIdAndUpdate(id,item);
        req.flash("success","Edit Successfully");
        let allItem=await Item.find({});
        res.redirect("/admin/homepage");
    }
    catch(err){
        next(new customError(500,"Please follow all mongoose schema constraints"));
    }
   
});

// add item
app.get("/admin/new",(req,res)=>{
    res.render("new.ejs");
});
app.post("/admin/new",async(req,res,next)=>{
    try
    {
        let newItem=req.body.item;
        let i=new Item(newItem);
        await i.save();
        req.flash("success","Item added successfully");
        let allItem=await Item.find({});
        res.redirect("/admin/homepage");
    }
    catch(err){
        next(new customError(500,"Please follow all mongoose schema constraints"));
    }
   
});

// signUp (User panel)
// signUp stores(customers data)
app.post("/homepage/signUp",async(req,res,next)=>{
    try
    {

        await CurrentUser.deleteMany({}); // for track current login or signup user
        let {username,email,password,mobNo,address}=req.body;
        let data={username,email,password,mobNo,address};
        let user=new CurrentUser({
            username:data.username
        });
        let customer=new Customer(data);
        await customer.save();
        await user.save();

    // // find Who login
    //  let currentUser=await CurrentUser.find({});
    //  let customers=await Customer.find({});
    //  let cust;
    //  for(customer of customers){
    //      if(customer.username==currentUser[0].username){
    //           cust=customer;
    //      }
    //   }
        let allItem=await Item.find({});
        // res.render("loginHomepage.ejs",{allItem,cart:cust.carts.length});  
        res.redirect("/loginHomepage");
    }
    catch(err){
       req.flash("error","Username or email already exist");
       res.redirect("/homepage/signup");
    }
    
  
});

// login user
app.post("/homepage/login",async (req,res,next)=>{
    try
    {
        await CurrentUser.deleteMany({});
        let login=req.body.login;
        let user=new CurrentUser({
            username:login.username,
        });
        await user.save();
        let customers=await Customer.find({});
        for(customer of customers){
         if(login.username===customer.username && login.password===customer.password){
                //  cust=customer;
                //  let allItem=await Item.find({});
                //  res.render("loginHomepage.ejs",{allItem,cart:cust.carts.length});    
                res.redirect("/loginHomepage");

             }
         }
        res.render("error.ejs");
    }
    catch(err){
        next(err);
    }
    
});


app. get("/homepage/:id/loginShowInfo",async (req,res,next)=>{
    try
    {
        let {id}=req.params;
        let item=await Item.findById(id);
        if(!item)
            throw new customError(500,"Item Not Found");
        res.render("loginShow.ejs",{item});
    }
    catch(err){
        next(err);
    }
    
});

// add to cart
app.post("/homepage/signUp/:id/cart",async(req,res,next)=>{
    try
    {
        let {id}=req.params;
        let currentUser=await CurrentUser.find({});
        
        // find Who login
        let customers=await Customer.find({});
        let cust;
        for(customer of customers){
            if(customer.username==currentUser[0].username){
                 cust=customer;
            }
        }

      let item=await Item.findById(id);
      let newItem=new Cart({
           type:item.type,
           title:item.title,
           description:item.description,
           specification:item.specification,
           image:item.image,
           price:item.price
      });

      cust.carts.push(newItem);

      await newItem.save();
      let result=await cust.save();
      console.log(result);
      
      let allItem=await Item.find({});
      console.log(allItem);
    //   let cart={no:6};
    //   res.render("loginHomepage.ejs",{allItem,cart:cust.carts.length});   
       res.redirect("/loginHomepage");  
    }
    catch(err){
        next(err);
    }
     
});

// show cart
app.get("/homepage/signUp/cart",async(req,res,next)=>{
    try
    {
          // find Who login
     let currentUser=await CurrentUser.find({});
     let customers=await Customer.find({});
     let cust;
     for(customer of customers){
         if(customer.username==currentUser[0].username){
              cust=customer;
         }
      }
      let items=await Customer.find({username:cust.username}).populate("carts");
      let Items=items[0];
      // calculate price
      let price=0;
      for(item of Items.carts){
          price=price+item.price;
      }
      if(cust.carts.length)
         res.render("cart.ejs",{Items,totalPrice:price});
      else 
        res.render("emptyCart.ejs");
    }
    catch(err)
    {
        next(err);
    }
   
});

// delete from cart
app.delete("/homepage/:id/carts/:cartId",async(req,res,next)=>{
  try
  {
         
        let {id,cartId}=req.params;
        let res1=await Customer.findByIdAndUpdate(id,{$pull:{carts:cartId}});
        let res2=await Cart.findByIdAndDelete(cartId);
        res.redirect("/homepage/signUp/cart");
  }
  catch(err){
    next(err);
  }
    
});

// buy route (by without going to  cart)
app.get("/homepage/signUp/:itemId/buy",async(req,res,next)=>{
    try
    {
        let {itemId}=req.params;
       

    // find Who login
     let currentUser=await CurrentUser.find({});
     let customers=await Customer.find({});
     let cust;
     for(customer of customers){
         if(customer.username==currentUser[0].username){
              cust=customer;
         }
      }
        let date=Math.floor(Math.random()*30) + 1;
        let month=new Date().getMonth();
        let year=new Date().getFullYear();
        let status="Expected at: "+date+"/"+month+"/"+year;
      let item=await Item.findById(itemId);
      let newOrder=new Order({
           orderName:item.title,
           orderImage:item.image,
           orderPrice:item.price,
           orderStatus:status,
           orderAddress:cust.address,
           customerName:cust.username,
           mobNo:cust.mobNo,
           status:"Pending"

      });
      await cust.orders.push(newOrder);
      await newOrder.save();
      await cust.save();
      res.render("orderSuccess.ejs",{item});
    }
    catch(err){
        next(err);
    }
    
    
});
// buy route (through cart)
app.get("/homepage/signUp/:cartId/buyNow",async(req,res,next)=>{
    try
    {
      let {cartId}=req.params;
      // find Who login
     let currentUser=await CurrentUser.find({});
     let customers=await Customer.find({});
     let cust;
     for(customer of customers){
         if(customer.username==currentUser[0].username){
              cust=customer;
         }
      }
        let date=Math.floor(Math.random()*30) + 1;
        let month=new Date().getMonth();
        let year=new Date().getFullYear();
        let status="Expected at: "+date+"/"+month+"/"+year; 

        let item=await Cart.findById(cartId);

        let newOrder=new Order({
            orderName:item.title,
            orderImage:item.image,
            orderPrice:item.price,
            orderStatus:status,
            orderAddress:cust.address,
            customerName:cust.username,
            mobNo:cust.mobNo,
            status:"Pending"
 
       });
       await cust.orders.push(newOrder);
       await newOrder.save();
       await cust.save();
       res.render("orderSuccess.ejs",{item});

    }
    catch(err){
        next(err);
    }
   
});

// All orders
app.get("/homepage/signUp/orders",async(req,res,next)=>{
    try
    {
     // find Who login
     let currentUser=await CurrentUser.find({});
     let customers=await Customer.find({});
     let cust;
     for(customer of customers){
         if(customer.username==currentUser[0].username){
              cust=customer;
         }
      }
      let order=await Customer.find({username:cust.username}).populate("orders");
      let Orders=order[0];
      if(cust.orders.length)
        res.render("orders.ejs",{Orders}); 
      else 
        res.render("emptyOrder.ejs");
    }
    catch(err){
        next(err);
    }    
});

// cancel orders
app.get("/homepage/signUp/:id/cancelOrder/:orderId",async(req,res,next)=>{
    try 
    {
        let {id,orderId}=req.params;
        await Customer.findByIdAndUpdate(id,{$pull:{orders:orderId}});
        await Order.findByIdAndDelete(orderId);
        res.render("orderCancel.ejs");

    }
    catch(err){
        next(err);
    }
    

});

// return to login(User) from Logout
app.get("/loginHomepage",async(req,res,next)=>{
    try 
    {
     // find Who login
     let currentUser=await CurrentUser.find({});
     let customers=await Customer.find({});
     let cust;
     for(customer of customers){
         if(customer.username==currentUser[0].username){
              cust=customer;
         }
      }

        let allItem=await Item.find({});
        res.render("loginHomepage.ejs",{allItem,cart:cust.carts.length}); 
    }
    catch(err){
        next(err);
    }
    
});

// searching items (homepage)
app.post("/homepage/searchResult",async (req,res,next)=>{
    try
    {
        let {searchType}=req.body;
        let allItem=await Item.find({});
        await Search.deleteMany({});
        for(items of allItem){
            if(items.type===searchType || items.title===searchType){
                let search=new Search({
                       productId:items._id,
                       title:items.title,
                       description:items.description,
                       specification:items.specification,
                       image:items.image,
                       price:items.price
                });
                await search.save();
            }
        }
        let countSearch=await Search.countDocuments({});
        if(countSearch==0)
           res.render("noSearchFound.ejs");
        else {
           let searchItem=await Search.find({});
           res.render("searches.ejs",{searchItem});
        }
    }
    catch(err){
        next(err);
    }
    
     
     
});

// searching items (login Homepage)
app.post("/homepage/signUp/searchResult",async(req,res,next)=>{
    try
    {
         // find Who login
        let currentUser=await CurrentUser.find({});
        let customers=await Customer.find({});
        let cust;
        for(customer of customers){
             if(customer.username==currentUser[0].username){
                 cust=customer;
             }
         }
            let {searchType}=req.body;
            let allItem=await Item.find({});
            await Search.deleteMany({});
            for(items of allItem){
                if(items.type===searchType || items.title===searchType){
                    let search=new Search({
                    productId:items._id,
                    title:items.title,
                    description:items.description,
                    specification:items.specification,
                    image:items.image,
                    price:items.price
             });
             await search.save();
            }
        }
        let countSearch=await Search.countDocuments({});
         if(countSearch==0)
            res.render("noSearchFoundLogin.ejs");
         else {
            let searchItem=await Search.find({});
            res.render("loginSearches.ejs",{searchItem,cart:cust.carts.length}); 
        }
    }
    catch(err){
        next(err);
    }
    
});

// error handling middleWare 
app.use((err,req,res,next)=>{
    console.log("--------ERROR----------");
    console.log(err.name);
    console.log(err.message);
    let {status=500,message="Some Error Occured"}=err;  
    // res.status(status).send(message);
    res.status(status).render("errors.ejs",{message});
});  

// when any route not match (page not found)
app.use((req,res)=>{
    res.render("pageNotFound.ejs");
});






