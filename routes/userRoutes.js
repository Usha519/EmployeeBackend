const express=require("express");
const {registerUser,currentUser,loginUser, dashboard}=require("../controllers/userController");
const validateToken=require("../middleware/validateTokenHandler");

const router=express.Router(); 

router.post("/register",registerUser);

router.post("/login",loginUser);

router.get("/current", validateToken ,currentUser);

router.get("/dashboard",validateToken,dashboard);
 

module.exports=router;