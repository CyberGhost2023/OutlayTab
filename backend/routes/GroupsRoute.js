const express= require("express")
const router = express.Router();
const db=require("../db/db")
const auth=require("../middleware/auth")


router.get("/",async (req,res)=>{
    console.log("In groups");
    const qry="Select * from `Groups`";
    await db.query(qry ,(err,result)=>{
        if(err)
        console.log(err)
        else
        {
            console.log(result);
        }
    })    
})

router.get("/newGroup",(req,res)=>{
    res.render("GroupForm");
})

router.post("/newGroup",async (req,res)=>{
    const qry= "INSERT INTO `Groups` (GroupName) VALUES (?);";
    const {GroupName,UsersList}=req.body;
    db.query(qry,[GroupName,UsersList],(err,result)=>{
        if(err)
        {
        throw err;
        }
        // console.log("Inserted")
        // console.log(result.insertId);
        // console.log("Inserted")
        const GrpId=result.insertId;
        const qry="Select UserId from Users where UserEmail in (?);"
        db.query(qry,[UsersList,GrpId],(err,result)=>{
            if(err)
                throw err;
        // console.log("Inserted")
        // console.log(result);
            if(result.length!=UsersList.length)
            {
                console.log("All Email Addresses are not valid");
                return;
            }        
            else 
            {
                // console.log(result)
                const qry="Insert into UserGroups (UsrId,GrpId) values ?;"
                const ary=[];
                for(let i=0;i<result.length;i++)
                {
                    ary.push([result[i].UserId,GrpId]);
                }
                // console.log(ary);
                db.query(qry,[ary],(err,result)=>{
                    if(err)
                    throw err;
                    // console.log(result);
                    res.send("HELLO WORLD")
                });  
            }
        })

    })
})

router.get("/view/:grpId",(req,res)=>{
    // const UsersList=[]
    const id=req.params.grpId;
    const qry="SELECT UsrId from UserGroups where grpId = ?"
    db.query(qry,[id],(err,result)=>{
        if(err)
        throw err;    
        console.log(result);
        const UsersList=[]
        for(let i=0;i<result.length;i++)
        {
            UsersList.push(result[i].UsrId);
        }
        const qry="Select * from Users where UserId in (?)"
        db.query(qry,[UsersList],(err,result)=>{
            if(err)
            throw err;
            console.log(result);
        })
    })
})

router.post("/view/:grpId/AddUser",(req,res)=>{
    const qry="Select UserId from Users where UserEmail = ?";
    const Gid=req.params.grpId;
    const UEmail=req.body.UEmail;
    console.log(UEmail);
    db.query(qry,[UEmail,Gid],(err,result)=>{
        if(err)
        {
            throw err;
        }
        const Uid =result[0].UserId;
        const qry="Insert into UserGroups (UsrId,GrpId) values (?,?)";
        db.query(qry,[Uid,Gid],(err,result)=>{
            if(err)
            throw err;
            console.log(result);
        })

    })
})

router.delete("/:grpId/delete",(req,res)=>{
    const Gid=parseInt(req.params.grpId);
    const qry="Delete from `Groups` where GroupId = ?";
        db.query(qry,[Gid],(err,result)=>{
            if(err)
            throw err;
            console.log(result);
        })
})

module.exports = router;