const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const expressError=require("../utils/expressError.js");
const Listing = require("../models/listings.js");
const Review=require("../models/reviews.js");
const {reviewSchema}=require("../schema.js");

const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error)
    {
        let errMsg=error.details.map((ele)=>ele.message).join(",");
        throw new expressError(400,errMsg);
    }else{
        next();
    }
}

//Post
//Review route
router.post("/",validateReview,wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}))

router.delete("/:rid",async(req,res)=>{
    let {id,rid}=req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews:rid}});
    await Review.findByIdAndDelete(rid);
    res.redirect(`/listings/${id}`);
})

module.exports=router;