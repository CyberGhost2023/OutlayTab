const jwt=require("jsonwebtoken")
const {SECRETKEY} =require("../config/config")

const auth = function (req,res,next){

    const token=req.cookies.access_token;
    if(!token)
    { 
        console.log(token)
        res.redirect("/login");
    }
    try{
        const decoded = jwt.verify(token,SECRETKEY);
        req.user=decoded;
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
        next();
    }
    else 
    res.redirect("/user");
}

module.exports={
    "auth":auth,
    "auth2":auth2

}