const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const listing=require("./models/listings.js");
const Listing = require("./models/listings.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

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

app.get("/",(req,res)=>{
    res.send("root working");
})/

app.get("/listings",async (req,res)=>{
    const allListing=await Listing.find({});
    res.render("./listings/index.ejs",{allListing});
})

// app.get("/listings",async (req,res)=>{
//     let sample=new listing({
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