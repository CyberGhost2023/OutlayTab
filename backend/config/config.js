const dotenv=require("dotenv")
dotenv.config();

const {DBHOST,DBDATABASE,DBPASSWORD,DBUSER,SECRET_KEY}= process.env;
module.exports={
    DBHOST:DBHOST,
    DBPASSWORD:DBPASSWORD,
    DBUSER:DBUSER,
    DBDATABASE:DBDATABASE,
    SECRETKEY:SECRET_KEY
}