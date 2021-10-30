const express= require("express")
const router = express.Router();
const db=require("../db/db")


router.get("/",(req,res)=>{
    db.query("SELECT * FROM Users;",(err,results)=>{
        if(err)
        throw err;
        res.send(results);
    })    
})

router.post("/",(req,res)=>{
    const qry= "INSERT INTO Users (UserName,UserEmail,UserPassword,Date) VALUES ?";
    const {UserName,UserEmail,UserPassword}=req.body;
    let date= new Date();
    let values = [[UserName,UserEmail,UserPassword,date]];
    db.query(qry,[values],(err,result)=>{
        if(err)
        {
        throw err;
        }
        res.send(result)
        // console.log(result);
    })
})

module.exports = router;