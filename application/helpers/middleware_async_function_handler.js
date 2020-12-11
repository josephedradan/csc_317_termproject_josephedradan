/* 
Created by Joseph Edradan
Github: https://github.com/josephedradan

Date created: 

Purpose:
    Async wrapper, similar style to pythons

    idk if will ok but ok
Details:

Description:

Notes:
    Handles Function and Async Functions

IMPORTANT NOTES:

Explanation:

Reference:
    Authentication in Node.js - #5 Error Handling
        https://www.youtube.com/watch?v=5Hpv6fLf93Q
            Uses typeScript
            Advanced with ambiguous calls  

    Javascript - Create a Wrapper Class
        https://www.youtube.com/watch?v=1bmRVC7eiik

    async / await in JavaScript - What, Why and How - Fun Fun Function
        https://www.youtube.com/watch?v=568g8hxJJp4

    Async JS Crash Course - Callbacks, Promises, Async Await
        https://www.youtube.com/watch?v=PoRJizFvM7s
    
    Asynchronous Vs Synchronous Programming
        https://www.youtube.com/watch?v=Kpn2ajSa92c

    JavaScript Async Await
        https://www.youtube.com/watch?v=V_Kr9OSfDeU

*/
// Custom user error class
const UserError = require('./error/user_error');

// Custom debug printer
const debugPrinter = require('./debug/debug_printer');
const PostError = require('./error/post_error');

// import RequestHandler from "express";

// Asynchronous function Error Handling Wrapper
function middlewareAsyncFunctionHandler(functionGiven) {
    /* 
    Anonymous wrapper function (Almost similar style to my python decorators) 
    
    Handle errors of a async function

    Notes:
        Not anonymous anymore...
        Does it matter if the function is async here or not?

    Important Notes:
        Ya... don't make wrapperAsyncErrorHandler async 
            Because result = await functionGiven(...args).catch((err) => {
            will make things run out of sync so you will get a page redirect but you will error
        
    Alternative:
        return (...args) => {
    */
    async function wrapper(...args) {
        /* 
        
        This try catch is to catch an error if the error fails because it's async now...
        ya idk why I did this...

        */
        try {
            
            // Printer 
            debugPrinter.middlewarePrint(functionGiven.name);

            /* 
            Call original function and catch error

            Notes:
                return
                    is unnecessary (maybe)
                
                result 
                    should be the global == this and is something related to node

            Important Notes:
                DO NOT PUT result = await functionGiven(...args).catch((err) => {
            
            Alternative:
                return (...args).catch((err) => {
            */
            let result = functionGiven(...args).catch((err) => {
                req = args[0];
                res = args[1];
                next = args[2];

                // debugPrinter.successPrint(typeof err); // Yep, it's an object 
                // debugPrinter.successPrint(err instanceof Error); // Yep, it's an Error type

                // Handle UserError
                if (err instanceof UserError) {

                    // Alert the user error
                    // req.flash('alert_user_error', err.getMessage());

                    debugPrinter.errorPrint(err);
                    res.status(err.getStatus());
                    res.redirect(err.getRedirectURL());

                } else if (err instanceof PostError) {

                    // Alert the user error
                    // req.flash('alert_user_error', err.getMessage());

                    debugPrinter.errorPrint(err);
                    res.status(err.getStatus());
                    res.redirect(err.getRedirectURL());
                }
                // Handle all other errors by passing it over the the Error handling middleware
                else {
                    debugPrinter.errorPrint("An Asynchronous Error other than a User defined Error has been caught!")
                    next(err);
                }
            });
            // debugPrinter.routerPrint(this);
            // debugPrinter.middlewarePrint(global);
            // debugPrinter.errorPrint(result);

            // return result;

        } catch (err) {
            debugPrinter.errorPrint("An Error has occurred while handling Asynchronous Errors!");
            next(err);
        }
    }
    return wrapper;
};


// Export asyncHandler function
module.exports = middlewareAsyncFunctionHandler;