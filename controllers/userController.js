const asyncHandler=require("express-async-handler");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
const User = require("../models/userModel");

//@des register a user
//@route GET /api/users/register
//@access public

const registerUser=asyncHandler(async(req,res)=>{
    const {username ,email,password}=req.body;
    if(!username || !email || !password){
        res.status(400);
        throw new Error("all fields are mandatory");
    }
    const userAvailable =await User.findOne({email});
    if(userAvailable){
        res.status(400);
        throw new Error("user already registered");
    }

    //Hash password
    const hashedPassword=await bcrypt.hash(password,10);
    console.log("hashedPassword ",hashedPassword);
    const user=await User.create({
       username,
       email,
       password:hashedPassword
    });
    console.log(`user created ${user}`); 
    if(user){
        res.json({status:"ok", data:{_id:user.id, email:user.email}});
    }else{
        res.status(400);
        throw new Error("user data is not valid")
    }
    res.json({message:"register the user"});
 });

 //@des login a user
//@route GET /api/users/login
//@access public

 const loginUser=asyncHandler(async(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const user =await User.findOne({email});
    //compare password with hashcode
    if(user && (await bcrypt.compare(password,user.password))){
        const accessToken=jwt.sign(
            {
                user:{
                    username:user.username,
                    email:user.email,
                    id:user.id,
                },
            },
            process.env.ACCESS_TOKEN_SECRET, 
            {expiresIn:"100m"}

        );
        res.json({status:"200",data:{accessToken}});
    }else{
        res.status(401);
        throw new Error("email or password invalid")
    }

 });

 

 //@des current user info
//@route GET /api/users/current
//@access private

 const currentUser=asyncHandler(async(req,res)=>{
    res.json(req.user);
 });

 //@des dashboard
 //@route GET /api/users/dashboard
 //@access private

 const dashboard = asyncHandler(async (req,res) => {
    if(req && req.user){
       res.json({status:"200",data:"dashboard viewed"})
    }else{
       res.status(401);
       throw new Error("user unauthorized")
    }
});


module.exports = { registerUser, loginUser, currentUser,dashboard };