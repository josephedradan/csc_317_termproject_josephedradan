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
const middlewareAsyncFunctionHandler = require("../helpers/middleware_async_function_handler");

// Debugging printer
const debugPrinter = require("../helpers/debug/debug_printer");

const routeProtectors = {};

routeProtectors.checkIfLoggedIn = function (req, res, next) {
    let username = req.session.session_username;

    if (username) {
        debugPrinter.successPrint(`User ${username} is logged in `);
        next();
    } else {
        debugPrinter.errorPrint(`User is not logged in `);
        res.redirect("/");
    }
};

module.exports = routeProtectors;
