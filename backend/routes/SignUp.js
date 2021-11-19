const express= require("express")
const router = express.Router();
const {SECRETKEY}=require("../config/config")
const jwt= require("jsonwebtoken")
const db=require("../db/db")
const bcrypt= require("bcrypt")
const {auth2}=require("../middleware/auth")
const {body,validationResult}=require("express-validator")


router.get("/",
auth2,
(req,res)=>{
    // console.log(req);
    res.render("SignUp",{errObj:{}});    
})

router.post("/",[
    auth2,
    body('email',"Please Enter Valid Email").isEmail().normalizeEmail().custom(value => {
        return new Promise((resolve,reject)=>{
            db.query("Select * from Users where UserEmail = ?",[value],(err,result)=>
        {
            if(result.length>0)
            return reject("Email Already in Use");
            return resolve("Email valid");
        })
    })
}),
    body('name',"This field cannot be empty").trim().not().isEmpty(),
    body('password',"Password must be atleast 6 characters long").isLength({min:6})
    ],async (req,res)=>{
        try
        {
        validationResult(req).throw();

    let {email,name,password}=req.body;
    //encrypt password
    const Salt= await bcrypt.genSalt(10);
    password= await bcrypt.hash(password,Salt);
    const query="Insert into Users (UserName,UserEmail,UserPassword) values (?,?,?);";
    db.query(query,[name,email, password] ,(err,result)=>{
        if(err)
        {
            console.log(err)
        }
        else 
        {
            //setup token
            const payload={
                UserId:result.insertId,
                UserName:name,
                UserEmail:email,
            }
            const token = jwt.sign(payload,SECRETKEY);
            res.cookie("access_token",token);
            //redirect to home page
            res.send(token);
        }
    })    
}
    catch(err){
        // if invalid data send errors
        err=err.errors;
        const errObj={};
        for(let i=0;i<err.length;i++)
        {
            errObj[err[i].param]=err[i].msg;
        }
        return res.render("SignUp",{"errObj":errObj});
    }
})


module.exports=router;