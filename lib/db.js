const mysql = require("mysql");
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'coornea',
    password: 'coor27nea',
    database: 'post_office'
});

connection.connect((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Connected ...');
    }
});

module.exports =connection;