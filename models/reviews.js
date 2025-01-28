const mongoose=require("mongoose");

const reviewSchema=new mongoose.Schema({
    rating:{
        type:Number,
        min:1,
        max:5,
    },
    comment:String,
    createdAt:{
        type:Date,
        deafult:Date.now(),
    }
});

const Review=mongoose.model("Review",reviewSchema);
module.exports=Review;