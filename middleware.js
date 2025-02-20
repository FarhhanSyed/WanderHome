const Listing=require("./models/listings");
const {listingSchema}=require("./schema.js");
const {reviewSchema}=require("./schema.js");
const Review=require("./models/reviews.js");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated())
    {
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged IN");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error)
    {
        let errMsg=error.details.map((ele)=>ele.message).join(",");
        return next(new ExpressError(errMsg, 400));
    }
    next();
}

module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error)
    {
        let errMsg=error.details.map((ele)=>ele.message).join(",");
        throw new expressError(400,errMsg);
    }else{
        next();
    }
}

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id))
    {
        req.flash("error","You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isAuthor=async (req,res,next)=>{
    let {id,rid}=req.params;
    let review=await Review.findById(rid);
    if(!review.author._id.equals(res.locals.currUser._id))
    {
        req.flash("error","You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}