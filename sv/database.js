const mysql = require('mysql');
const {database} = require('./utilities');


const sql = mysql.createPool(database)

sql.getConnection( (connection) =>{
    if(connection) connection.release()
    console.log('DB is connected')
});

module.exports = sql;