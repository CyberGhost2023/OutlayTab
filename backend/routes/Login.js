const {SECRETKEY}=require("../config/config")
const jwt= require("jsonwebtoken")
const express= require("express")
const router = express.Router();
const db=require("../db/db")
const bcrypt= require("bcrypt")
const {auth2,auth}=require("../middleware/auth")


router.get("/login",auth2,(req,res)=>{
    res.render("Login",{errObj:""});    
})

router.post("/login",auth2,async(req,res)=>{
    let {email,password}=req.body;
    query="Select * from Users where UserEmail=?";
    db.query(query,[email, password] ,async (err,result)=>{
        if(err)
        {
            console.log(err);
        }
        else if(result.length==0)
            res.render("Login",{errObj:"Invalid Email or Password"});
        else
        {
            const validPassword = await bcrypt.compare(password, result[0].UserPassword);
            if(!validPassword)
            res.render("Login",{errObj:"Invalid Email or Password"});
            else
            {
            // console.log(result);
            const payload={
                UserId:result[0].UserId,
                UserName:result[0].UserName,
                UserEmail:result[0].UserEmail,
                }
            const token = jwt.sign(payload,SECRETKEY);
            res.cookie("access_token",token);
            res.send(token);
            }
        }
    })    
})

router.get("/logout",auth,(req,res)=>{
    res.clearCookie("access_token");
    res.redirect("/Login");
})


module.exports=router;