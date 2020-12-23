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
// const asyncFunctionHandler = require("../decorators/async_function_handler");

// Debugging printer
const debugPrinter = require("../helpers/debug/debug_printer");

// Make routeProtectors an empty object
const middlewareRouteProtectors = {};

// Router protector to prevent User from accessing pages if they are not logged in
// routeProtectors.checkIfLoggedIn = asyncFunctionHandler(checkIfLoggedIn);
middlewareRouteProtectors.checkIfLoggedIn = checkIfLoggedIn;

async function checkIfLoggedIn (req, res, next) {
    /* 
    Checks if user is logged in the site and prevents unwanted access to other parts of hte website if not logged in
    
    Notes:
        If this function is not asynchronous then it will crash asyncFunctionHandler
    */
    let username = req.session.session_username;

    if (username) {
        debugPrinter.printSuccess(`User ${username} is logged in and is able to post`);
        next();
    } else {
        debugPrinter.printError(`User is not logged in and is not able to post`);
        res.redirect("/");
    }
};

module.exports = middlewareRouteProtectors;
