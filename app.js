const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing = require("./models/listings.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const expressError=require("./utils/expressError.js");
const exp = require("constants");

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
app.get("/listings",wrapAsync(async (req,res)=>{
    const allListing=await Listing.find({});
    res.render("./listings/index.ejs",{allListing});
}))

//New Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})

//Post Route
app.post("/listings",wrapAsync(async (req,res,next)=>{
        if(!req.body.listing)
        {
            throw new expressError(400,"Give valid Data");
        }
        const newListing=new Listing(req.body.listing);
        if(!newListing.description)
        {
            throw new expressError(400,"Description is missing");
        }
        await newListing.save();
        res.redirect("/listings");
    }
))

//Show Route
app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;    
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
}))

//Edit Route
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}))

//Update Route
app.patch("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{ ...req.body.listing});
    if(!req.body.listing)
    {
        throw new expressError(400,"Give valid Data");
    }
    res.redirect(`/listings/${id}`);
}))

//Delete Route
app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}))

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

app.all("*",(req,res,next)=>{
    next(new expressError(404,"Page Not Found!"));
})

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{message});
})

app.listen(8080,()=>{
    console.log(`Server started on port 8080`);
})