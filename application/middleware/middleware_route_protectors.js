/* 
Created by Joseph Edradan
Github: https://github.com/josephedradan

Date created: 12/9/2020

Purpose:

Details:

Description:

Notes:

IMPORTANT NOTES:

Explanation:

Reference:


*/
// Asynchronous Function Middleware Handler
const middlewareAsyncFunctionHandler = require("../middleware/middleware_async_function_handler");

// Debugging printer
const debugPrinter = require("../helpers/debug/debug_printer");

// Make routeProtectors an empty object
const routeProtectors = {};

// Router protector to prevent User from accessing pages if they are not logged in
// routeProtectors.checkIfLoggedIn = middlewareAsyncFunctionHandler(checkIfLoggedIn);
routeProtectors.checkIfLoggedIn = checkIfLoggedIn;

async function checkIfLoggedIn (req, res, next) {
    /* 
    Checks if user is logged in the site and prevents unwanted access to other parts of hte website if not logged in
    
    Notes:
        If this function is not asynchronous then it will crash middlewareAsyncFunctionHandler
    */
    let username = req.session.session_username;

    if (username) {
        debugPrinter.successPrint(`User ${username} is logged in`);
        next();
    } else {
        debugPrinter.errorPrint(`User is not logged in`);
        res.redirect("/");
    }
};

module.exports = routeProtectors;
