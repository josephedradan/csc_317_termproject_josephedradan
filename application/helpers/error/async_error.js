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

IMPORTANT NOTES:

Explanation:

Reference:
    Authentication in Node.js - #5 Error Handling
        https://www.youtube.com/watch?v=5Hpv6fLf93Q
            Uses typeScript
            Advanced with ambiguous calls  

*/
// import RequestHandler from "express";
export const asyncHandler = (functionGiven) => {

    // Anonymous wrapper function
    (...args) => {

        // Call original function and catch error
        functionGiven(...args).catch((err)=>{
            req = args[0];
            res = args[1];
            next = args[2];

            next(err);
        })
    }
}
