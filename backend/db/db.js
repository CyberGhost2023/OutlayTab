const mysql = require("mysql")
const {DBHOST,DBDATABASE,DBUSER,DBPASSWORD}=require("../config/config")
const db=mysql.createConnection({
    "host":DBHOST,
    "user":DBUSER,
    "password":DBPASSWORD,
    "database":DBDATABASE
})
module.exports =db
