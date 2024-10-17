// importing mysql module
const mysql = require('mysql2');

// creating connection string
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'CPRG212',
    password: 'Cprg212user'

});

// exporting the connection for use in any js file
module.exports = con;