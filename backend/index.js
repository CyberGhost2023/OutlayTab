const express=require("express")
const app=express()
const db=require("./db/db")
const path=require("path")
const {SECRETKEY}=require("./config/config")
const cookieParser=require("cookie-parser")

if(!SECRETKEY)
{
    console.log("Fatal Error:JWT private Key Not Defined");
    process.exit(1);
}

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//setting static path
app.use(express.static("public"));
const static_path = path.join(__dirname, "./public");
app.use(express.static(static_path));

//setting view engine
app.set("view engine", "ejs");

//connect to mysql

db.connect((err)=>{
    if(err)
    {
        throw err;
    }
    console.log("MySql Connected...");
})


//Routes
// app.use("/Users",require("./routes/UsersRoute"));
app.use("/Groups",require("./routes/GroupsRoute"));
app.use("/",require("./routes/Login"));
app.use("/SignUp",require("./routes/SignUp"));
app.use("/User",require("./routes/UserRoute"));



//Listen to  server
const Port= process.env.PORT || 3000;

app.listen(Port,()=>{
    console.log("Server Started");
})