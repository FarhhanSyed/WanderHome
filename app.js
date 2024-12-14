const express=require("express");
const app=express();
const mongoose=require("mongoose");

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
})

app.listen(8080,()=>{
    console.log(`Server started on port 8080`);
})