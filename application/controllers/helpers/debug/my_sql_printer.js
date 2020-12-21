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

// Asynchronous Function Middleware Handler
const middlewareAsyncFunctionHandler = require("../../middleware/middleware_async_function_handler");

// Database connecter
const databaseConnector = require('../../config/database_connecter');

async function printSessions() {
    /* 
    Returning does not work for some reason...
    
    */

    let baseSQLQuery = "SELECT * FROM sessions;";

    let [dbData, fields] = await databaseConnector.execute(baseSQLQuery);

    dbData.forEach(element => {
        debugPrinter.debugPrint(element);
    });
}


printSessions = middlewareAsyncFunctionHandler(printSessions);

module.exports = { printSessions }