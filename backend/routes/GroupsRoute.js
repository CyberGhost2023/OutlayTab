const express= require("express")
const router = express.Router();
const db=require("../db/db")
const {auth}=require("../middleware/auth")


//working
router.get("/",auth,(req,res)=>{
    const curUser=req.user.UserId;
    const qry="Select GrpId from UserGroups where UsrId = (?)";
    db.query(qry,[curUser],(err,result)=>{
        if(err)
        throw err;
        const grpList=[];
        for(let i=0;i<result.length;i++)
        {
            grpList.push(result[i].GrpId);
        }
        if(grpList.length>0)
        {
            const qry="Select * from `Groups` where GroupId in (?) ";
            db.query(qry ,[grpList],(err,result)=>{
            if(err)
            console.log(err)
            else
            {
                // console.log(result);
                return res.render("groups",{groups:result});
            }
            })
        }
        else
        {
            res.render("groups",{groups:{}});
        }
    })      
})

//working
router.get("/newGroup",auth,(req,res)=>{
    
    res.render("groupForm",{ user:req.user,errors:""});
})

//working
router.post("/newGroup",auth, (req,res)=>{
    console.log(req.body);
    const UsersList=[]
    for( const [key,val] of Object.entries(req.body)){
        if(key.startsWith('Member') && val!="")
        {
            UsersList.push(val);
        }
    }
    // console.log(UsersList);
    const qry= "INSERT INTO `Groups` (GroupName) VALUES (?);";
    const {GroupName}=req.body;
    db.query(qry,[GroupName,UsersList],(err,result)=>{
        if(err)
        {
            return res.send("Group Name already present");
        }
        const GrpId=parseInt(result.insertId);
        // console.log(GrpId)
        const qry="Select UserId from Users where UserEmail in (?);"
        db.query(qry,[UsersList,GrpId],(err,result)=>{
            if(err)
                throw err;
            if(result.length!=UsersList.length)
            {
                // console.log("All Email Addresses are not valid");
                const qry="Delete from `Groups` where GroupId in (?)";
                db.query(qry,[GrpId],(err,result)=>{
                    // console.log(result);
                    // console.log("group deleted");
                })
                return res.render("groupForm",{user:req.user,errors:"Emails Invalid or duplicate"})
            }        
            else 
            {
                const qry="Insert into UserGroups (UsrId,GrpId) values ?;"
                const ary=[];
                for(let i=0;i<result.length;i++)
                {
                    ary.push([result[i].UserId,GrpId]);
                }
                db.query(qry,[ary],(err,result)=>{
                    if(err)
                    throw err;
                    res.redirect("/groups");
                });  
            }
        })

    })
})

function getUserInGroup(grpId,UsrId){
    const qry="SELECT UsrId from UserGroups where grpId = (?) and UsrId != (?)"
    db.query(qry,[grpId,UsrId],(err,result)=>{
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
}

router.get("/view/:grpId",auth,(req,res)=>{
    const gid=req.params.grpId;
    const uid=req.user.UserId;
    const result = getUserInGroup(gid,uid);
})

router.post("/view/:grpId/AddUser",auth,(req,res)=>{
    const qry="Select UserId from Users where UserEmail = ?";
    const Gid=req.params.grpId;
    const UEmail=req.body.UEmail;
    db.query(qry,[UEmail,Gid],(err,result)=>{
        if(err)
        {
            throw err;
        }
        const Uid =result[0].UserId;
        const qry1="Select UsrId from UserGroups where UsrId=(?) and GrpId=(?)";
        db.query(qry1,[Uid,Gid],(err,result)=>{
            if(err)
            throw err;
            if(result.length>0)
            {
                console.log("User already in Group");
                return;
            }
        })
        const qry="Insert into UserGroups (UsrId,GrpId) values (?,?)";
        db.query(qry,[Uid,Gid],(err,result)=>{
            if(err)
            throw err;
            console.log(result);
        })

    })
})

//delete group
router.delete("/:grpId/delete",auth,(req,res)=>{
    const Gid=parseInt(req.params.grpId);
    const qry="Delete from `Groups` where GroupId = ?";
        db.query(qry,[Gid],(err,result)=>{
            if(err)
            throw err;
            console.log(result);
        })
})


// Add expenses in groups
router.get("/:grpId/AddExpense",auth,(req,res)=>{
    const id=req.params.grpId;
    const result = getUserInGroup(id);
    res.send(result);

})

router.post("/:grpId/AddExpense",auth,(req,res)=>{

    const grpId=req.params.id;
    const {paidBy,Amount,shareType,shareCategory}=req.body;
    if(shareType=='equally')
    {
        const result= getUserInGroup(grpId);
        const totUsers=result.length;
    }    
    // else 
})


module.exports = router;