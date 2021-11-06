const {SECRETKEY}=require("../config/config")
const jwt= require("jsonwebtoken")
const express= require("express")
const router = express.Router();
const db=require("../db/db")
const bcrypt= require("bcrypt")

router.get("/login",(req,res)=>{
    res.render("Login");    
})

router.post("/login",async (req,res)=>{
    let {email,password}=req.body;
    query="Select * from Users where UserEmail=?";
    db.query(query,[email, password] ,async (err,result)=>{
        if(err)
        {
            console.log(err);
        }
        else if(result.length==0)
            console.log("Invalid Email or Password");
        else
        {
            const validPassword = await bcrypt.compare(password, result[0].UserPassword);
            if(!validPassword)
            console.log("Invalid Email or password");
            else
            {
            console.log(result);
            const payload={
                id:result[0].UserId,
                name:result[0].UserName,
                email:result[0].UserEmail,
                }
            const token = jwt.sign(payload,SECRETKEY);
            res.cookie("access_token",token);
            res.render("GroupList");
            }
        }
    })    
})

router.get("/logout",(req,res)=>{
    res.clearCookie("access_token");
    res.redirect("/SignUp");
})


module.exports=router;