const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listings");

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
});

const initDB=async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"67ab35b697500c74242d94b5"}));
    await Listing.insertMany(initData.data);
    console.log("Initialized Database");
}
initDB();