const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing = require("./models/listings.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");


const mongooseURL="mongodb://127.0.0.1:27017/WanderHome";
async function main() {
    await mongoose.connect(mongooseURL);
}

main()
.then(()=>{
    console.log("Connection Successfull");
})
.catch((err)=>{
    console.log(err);
})

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req,res)=>{
    res.send("root working");
})/

//Index Route
app.get("/listings",async (req,res)=>{
    const allListing=await Listing.find({});
    res.render("./listings/index.ejs",{allListing});
})

//New Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})

//Post Route
app.post("/listings",async (req,res,next)=>{
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
})

//Show Route
app.get("/listings/:id",async (req,res)=>{
    let {id}=req.params;    
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
})

//Edit Route
app.get("/listings/:id/edit",async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})

//Update Route
app.patch("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{ ...req.body.listing});
    res.redirect(`/listings/${id}`);
})

//Delete Route
app.delete("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})

// app.get("/listings",async (req,res)=>{
//     let samples=new listing({
//         title:"My home",
//         description:"By the Beach",
//         price:1900,
//         location:"MG ROAD,Banglore",
//         country:"India"
//     });
//     await sample.save();
//     console.log("sample data saved");
//     res.send("sample data working");
// })

app.listen(8080,()=>{
    console.log(`Server started on port 8080`);
})