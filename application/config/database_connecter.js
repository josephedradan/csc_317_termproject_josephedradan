/* 
Created by Joseph Edradan
Github: https://github.com/josephedradan

Date created: 

Purpose:
    Connect to MySQL Database
    
Details:

Description:

Notes:

IMPORTANT NOTES:

Explanation:

Reference:

*/
const mysql = require('mysql2');


const pool = mysql.createPool({
    host:'localhost',
    user: 'SFSU_CIS_317_user',
    password: 'joseph',
    database:'csc_317_termproject',
    connectionLimit: 50,
    // waitForConnections: true,
    // debug: true,
});

const promisePool = pool.promise();


module.exports = promisePool;