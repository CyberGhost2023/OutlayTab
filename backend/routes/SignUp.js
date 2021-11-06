const express= require("express")
const router = express.Router();
const db=require("../db/db")
const bcrypt= require("bcrypt")

router.get("/",(req,res)=>{
    res.render("SignUp");    
})

router.post("/",async (req,res)=>{
    let {email,name,password}=req.body;
    const Salt= await bcrypt.genSalt(10);
    password= await bcrypt.hash(password,Salt);
    query="Insert into Users (UserName,UserEmail,UserPassword) values (?,?,?);";
    db.query(query,[name,email, password] ,(err,result)=>{
        if(err)
        {
            console.log(err)
        }
        else 
        console.log(result);
        //setup token.
    })    
})


module.exports=router;