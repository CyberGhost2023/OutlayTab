const express= require("express")
const router = express.Router();
const db=require("../db/db")
const auth=require("../middleware/auth")


router.get("/friends",auth,(req,res)=>{
    const CurUser=req.user.UserId;
    const qry = "Select UsrId2 from Friends where UsrId1= (?)";
    db.query(qry,[CurUser],(err,result)=>{
        if(err)
        throw err;
        const friendList=[]
        for(let i=0;i<result.length;i++)
        {
            friendList.push(result[i].UsrId2);
        }
        const qry="Select UserName, UserEmail from Users where UserId in (?)";
        db.query(qry,[friendList],(err,result)=>{
            if(err)
            throw err;
            console.log(result);
        })
    })
})

router.post("/friends",auth,(req,res)=>{
    const UEmail = req.body.UEmail;
    const qry="Select UserId from Users where UserEmail = (?)";
    db.query(qry,[UEmail],(err,result)=>{
        if(err)
        throw err;
        const UserId1=req.user.UserId;
        const UserId2=result[0].UserId;
        const qry1="Select UsrId2 from Friends where UsrId1=(?) and UsrId2=(?)";
        db.query(qry1,[UserId1,UserId2],(err,result)=>{
            if(err)
            throw err;
            if(result.length>0)
            {
                console.log("User already friends");
                return;
            }
        })
        const qry="Insert into Friends (UsrId1, UsrId2) values ?";
        db.query(qry,[[UserId1,UserId2],[UserId2,UserId1]],(err,result)=>{
            if(err)
            throw err;
            console.log(result);
        })
    })
})

router.get("/",auth,(req,res)=>{

})