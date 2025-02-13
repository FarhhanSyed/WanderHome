const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const expressError=require("../utils/expressError.js");
const Listing = require("../models/listings.js");
const Review=require("../models/reviews.js");
const {validateReview,isAuthor,isLoggedIn}=require("../middleware.js");

//Post
//Review route
router.post("/",validateReview,isLoggedIn,wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","Review Created");
    res.redirect(`/listings/${listing._id}`);
}))

router.delete("/:rid",isLoggedIn,isAuthor,async(req,res)=>{
    let {id,rid}=req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews:rid}});
    await Review.findByIdAndDelete(rid);
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
})

module.exports=router;