const mysql = require("mysql")
const db=mysql.createConnection({
    "host":"Enter host ",
    "user":"Enter username",
    "password":"enter password",
    "database":"enter database"
})
module.exports =db
