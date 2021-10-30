const express=require("express")
const app=express()
const db=require("./db/db")

app.use(express.json());
app.use(express.urlencoded({extended:false}));

//connect to mysql

db.connect((err)=>{
    if(err)
    {
        throw err;
    }
    console.log("MySql Connected...");
})

//Routes
app.use("/Users",require("./routes/UsersRoute"));
app.use("/Groups",require("./routes/GroupsRoute"));



//Listen to  server
const Port= process.env.PORT || 3000;

app.listen(Port,()=>{
    console.log("Server Started");
})