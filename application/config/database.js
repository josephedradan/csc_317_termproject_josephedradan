const mysql = require('mysql2');


const pool = mysql.createPool({
    connectionLimit: 50,
    host:'localhost',
    user: 'CSM_CIS_363_user',
    password: 'joseph',
    database:'SDSDF',
    debug: true,

});

const promisePool = pool.promise();


module.exports = promisePool;