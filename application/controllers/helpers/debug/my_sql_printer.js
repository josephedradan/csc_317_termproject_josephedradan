/* 
Created by Joseph Edradan
Github: https://github.com/josephedradan

Date created: 12/9/2020

Purpose:
    Handle DB Calls for printing i guess

Details:

Description:

Notes:
    WHY DID I MAKE THIS A MIDDLEWARE???????
    WHAT IS THE POINT OF THIS FILE, FIXME 
    
IMPORTANT NOTES:

Explanation:

Reference:

*/
// Debugging printer
const debugPrinter = require('./debug_printer');

// Database connecter
const databaseConnector = require('../../config/database_connecter');

async function printSessions() {
    /* 
    Returning does not work for some reason...
    
    */

    let baseSQLQuery = "SELECT * FROM sessions;";

    let [dbData, fields] = await databaseConnector.execute(baseSQLQuery);

    dbData.forEach(element => {
        debugPrinter.printDebug(element);
    });
}


printSessions = printSessions;

module.exports = { printSessions }