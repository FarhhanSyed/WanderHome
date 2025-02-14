const express=require("express");
const router=express.Router();
const User=require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
})

router.post("/signup",
    wrapAsync(async (req,res,next)=>{
        try{
            let {username,email,password}=req.body;
            let newUser=new User({email,username});
            let registeredUser=await User.register(newUser,password);
            req.login(registeredUser,(err)=>{
                if(err){
                    next(err);
                }
                req.flash("success","Welcome to WanderHome!!");
                res.redirect("/listings");
            })
        }
        catch(e){
            req.flash("error",e.message);
            res.redirect("/signup");
        }
})  
)

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})

router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local",{
        failureRedirect:"/login",
        failureFlash:true
    }),
    async (req,res)=>{  
        req.flash("success","Welcome back to WanderHome");
        let redirect=res.locals.redirectUrl || "/listings";
        res.redirect(redirect);
})

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    })
})

module.exports=router;