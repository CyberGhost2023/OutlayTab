const jwt=require("jsonwebtoken")
const {SECRETKEY} =require("../config/config")

const auth = function (req,res,next){

    const token=req.cookies.access_token;
    if(!token)
    { 
        console.log(token)
        return res.redirect("/login");
    }
    try{
        const decoded = jwt.verify(token,SECRETKEY);
        req.user=decoded;
        req.user.UserId=parseInt(req.user.UserId)
        next();
    }
    catch(ex){
        res.status(400).send("Invalid token");
    }
}

const auth2 = function (req,res,next){
    const token=req.cookies.access_token;
    if(!token)
    { 
        // console.log("Not logged in");
        next();
    }
    else 
    res.send("Logged In");
}

module.exports={
    auth,
    auth2

}