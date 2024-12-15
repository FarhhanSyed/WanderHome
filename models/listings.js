const mongoose=require("mongoose");
const schema=mongoose.Schema;

const listingSchema=new schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    price:Number,
    image:{
        type:String,
        default:"https://unsplash.com/photos/a-group-of-people-sitting-on-a-bench-in-front-of-a-building-MF7lMe35MDM",
        set:(v)=> v==="https://unsplash.com/photos/a-group-of-people-sitting-on-a-bench-in-front-of-a-building-MF7lMe35MDM"?"":v,
    },
    location:String,
    country:String
})

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;