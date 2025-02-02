const express=require("express");
const router=express.Router();
const Listing = require("../models/listings.js");
const wrapAsync=require("../utils/wrapAsync.js");
const expressError=require("../utils/expressError.js");
const {listingSchema}=require("../schema.js");

const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error)
    {
        let errMsg=error.details.map((ele)=>ele.message).join(",");
        throw new expressError(400,errMsg);
    }else{
        next();
    }
}

//Index Route
router.get("/",wrapAsync(async (req,res)=>{
    const allListing=await Listing.find({});
    res.render("./listings/index.ejs",{allListing});
}))

//New Route
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
})

//Post Route
router.post("/",validateListing,wrapAsync(async (req,res,next)=>{
    let result=listingSchema.validate(req.body);
    if(result.error)
    {
        throw new expressError(400,result.error);
    }
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
    }
))

//Show Route
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;    
    const listing=await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
}))

//Edit Route
router.get("/:id/edit",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}))

//Update Route
router.patch("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{ ...req.body.listing});
    if(!req.body.listing)
    {
        throw new expressError(400,"Give valid Data");
    }
    res.redirect(`/listings/${id}`);
}))

//Delete Route
router.delete("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}))

module.exports=router;