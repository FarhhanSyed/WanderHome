const express=require("express");
const router=express.Router();
const Listing = require("../models/listings.js");
const wrapAsync=require("../utils/wrapAsync.js");
const expressError=require("../utils/expressError.js");
const {listingSchema}=require("../schema.js");
const {isLoggedIn,validateListing,isOwner}=require("../middleware.js");


//Index Route
router.get("/",wrapAsync(async (req,res)=>{
    const allListing=await Listing.find({});
    res.render("./listings/index.ejs",{allListing});
}))

//New Route
router.get("/new",isLoggedIn,(req,res)=>{
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
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success","New Listing created");
    res.redirect("/listings");
    }
))

//Show Route
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;    
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing)
    {
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}))     

//Edit Route
router.get("/:id/edit",isLoggedIn,
    isOwner,
    wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing)
    {
        req.flash("error","Listing you requested for does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
}))

//Update Route
router.patch("/:id",isLoggedIn,
    isOwner,
    wrapAsync(async (req,res)=>{
    let {id}=req.params;
    if(!req.body.listing)
    {
        throw new expressError(400,"Give valid Data");
    }
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
}))

//Delete Route
router.delete("/:id",isLoggedIn,
    isOwner,
    wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
}))

module.exports=router;