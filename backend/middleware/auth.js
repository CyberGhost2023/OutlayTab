const jwt=require("jsonwebtoken")
const {SECRETKEY} =require("../config/config")

module.exports= function auth(req,res,next){

    const token=req.cookies.access_token;
    // console.log(req.cookies);
    if(!token)
    { 
        console.log(token)
        // res.render("GroupList");
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

// module.exports = auth;