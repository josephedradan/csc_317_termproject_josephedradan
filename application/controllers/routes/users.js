/* 
Created by Joseph Edradan
Github: https://github.com/josephedradan

Date created: 12/9/2020

Purpose:
  Handle urls relevant to the user
Details:

Description:

Notes:

IMPORTANT NOTES:

Explanation:

Reference:
    Sessions won't save in Node.js without req.session.save()
        https://stackoverflow.com/questions/26531143/sessions-wont-save-in-node-js-without-req-session-save
*/

/* 
Node modules 

*/
const express = require("express");
const routerUsers = express.Router();
const bcrypt = require("bcrypt");

// Database connecter
// const databaseConnector = require("../config/database_connecter");

// Database Handler
const usersModel = require('../../models/model_users')

// Debugging printer
const debugPrinter = require("../helpers/debug/debug_printer");

// Custom user error class
const UserError = require("../helpers/error/user_error");

// Asynchronous Function Middleware Handler
const asyncFunctionHandler = require("../decorators/async_function_handler");

// middlewareValidateRegistration
const middlewareValidateRegistration = require(`../middleware/middleware_registration_validation`)

const { body, validationResult } = require('express-validator');

// Handle registration posting
routerUsers.post("/register", [body("email").isEmail()], asyncFunctionHandler(middlewareValidateRegistration), asyncFunctionHandler(middlewareRegister));

async function middlewareRegister(req, res, next) {
    /* 
    
    Notes:
        This function is handled Server side so we have to 
            res.locals.locals_redirect_last
    
    */
    // req Comes with a bunch of garbage
    // Body of the POST
    debugPrinter.printDebug(req.body);

    const errors = validationResult(req);

    // If Errors exist
    if (!errors.isEmpty()) { 
        
        throw new UserError(
            400,
            errors,
            "/registration",
        );
    } 
    
    // If no errors exist
    else {

        // Get useful data from the post request using meaningful names
        let username = req.body["username"];
        let email = req.body["email"];
        let password1 = req.body["password-1"];
        let password2 = req.body["password-1"];
        let checkAge = req.body["checkbox-age"];
        let checkTOS = req.body["checkbox-tos"];

        // If online i guess
        // let active = 1;

        // Check if the Username already exists
        const promiseUsername = usersModel.getUserDataAllFromUsername(username);

        // Check if the Email already exists
        const promiseEmail = usersModel.getUserEmailDataAllFromEmail(email);

        // Call promises concurrently
        [resultSQLQueryUsername, resultSQLQueryEmail] = await Promise.all([promiseUsername, promiseEmail])

        // Result contains the rows from SQL query and the fields object
        rowsResultUsername = resultSQLQueryUsername[0];
        rowsResultEmail = resultSQLQueryEmail[0];

        // Success in finding a user name and Email in the database (If you find something in the database then either one already exists)
        // debugPrinter.printSuccess(rowsResultUsername);
        // debugPrinter.printSuccess(rowsResultEmail);

        // Check username exists in database then check its length
        if (rowsResultUsername && rowsResultUsername.length) {
            let stringFailure = `Username: ${username} is taken!`;
            debugPrinter.printError(stringFailure);
            throw new UserError(
                400,
                stringFailure,
                "/registration",
            );
        }

        // Check Email exist in database then check its length
        if (rowsResultEmail && rowsResultEmail.length) {
            let stringFailure = `Email: ${email} is in use!`;
            debugPrinter.printError(stringFailure);
            throw new UserError(
                400,
                stringFailure,
                "/registration",
            );
        }

        // Hash password
        passwordHashed = await bcrypt.hash(password1, 10);

        // TODO: MAKE A WRAPPER/FUNCTION TYPE FOR HANDLING QUERIES LIKE IN PYTHON

        let stringSuccess1 = "Executing Registration Query";
        debugPrinter.printSuccess(stringSuccess1);
        // databaseConnector.execute(baseSQLQueryInsert, [
        //     username,
        //     email,
        //     passwordHashed,
        // ]);
        usersModel.insertUserToDatabase(username, email, passwordHashed);

        let stringSuccess2 = `Query Successful`;
        debugPrinter.printSuccess(stringSuccess2);

        // Flash (USE THIS IF flash DOES NOT BREAK express-sessions)
        // req.flash('alert_account_creation', "Your can now log in");

        // Set last redirect URL (This is form the normal way of handling Post requests with standard form html)
        res.locals.locals_redirect_last = "/login";

        /* 
        Stuff to return to the user who did a post request (Basically, if the post was handled by frontend JS)
        Modify the res.json for the user
    
        VERY IMPORTANT NOTE:
            THIS SHOULD ONLY BE UNCOMMENTED IF THIS GET/POST REQUEST IS HANDLED BY FRONTEND JS
        */
        // res.json({ status: 200, message: "User Creation was Successful!", "redirect": res.locals.locals_redirect_last })

        // Call next middleware (Will probably call saveSessionThenRedirect();)
        next();
    }
}

// Handle /login
routerUsers.post("/login", asyncFunctionHandler(middlewareLogin));

async function middlewareLogin(req, res, next) {
    /* 
    Handle User login
    
    */

    // Get both username and password
    let username = req.body["username"];
    let password = req.body["password"];

    // Get data from database via username (THIS AWAIT IS LITERALLY USELESS BECAUSE IT'S SEQUENTIAL)
    const [rowsResultUserData, fields] = await usersModel.getUserDataSimpleFromUsername(username);

    // resultUserData Exists and resultUserData.length Exists
    if (rowsResultUserData && rowsResultUserData.length) {
        // Get the first instance of the user (there should only be 1)
        let resultUserDataFirst = rowsResultUserData[0];

        // Handle if there is more than 1 usr with the same name (should not exist)
        if (rowsResultUserData.length > 1) {

            // TODO: MAKE THIS A CUSTOM USER ERROR
            throw new Error(
                `There is more than 1 user with the same Username as: ${username}`
            );
        }

        // Debug print resultUserDataFirst
        // debugPrinter.printDebug(`Object from DB: ${resultUserDataFirst}`);

        // Assign local vars for easy use
        let db_id = resultUserDataFirst["users_id"];
        let db_username = resultUserDataFirst["users_username"];
        let db_password_hashed = resultUserDataFirst["users_password"];

        // Hash password here because it's costly to do a hash when you need to know the username first
        let check = await bcrypt.compare(password, db_password_hashed);

        if (check) {
            // debugPrinter.printDebug(typeof (resultUserDataFirst)); // Type is object

            for (const [key, value] of Object.entries(resultUserDataFirst)) {
                debugPrinter.printDebug(`${key}: ${value}`);
            }

            // Set user as logged in in Sessions
            req.session.session_username = db_username; // await does nothing here
            req.session.session_user_id = db_id; // await does nothing here

            // Assign res locals immediately (Doesn't matter since we are going to redirect to home anyways)
            // res.locals.locals_session_logged = true;
            // res.locals.locals_session_username = req.session.session_username;

            // Debug print successful login
            let stringSuccess = `User ${db_username} has logged in`;
            debugPrinter.printSuccess(stringSuccess);

            // Add to flash before redirect
            // req.flash('alert_username', `${db_username}`) // await does nothing here

            // Debug print the req.session
            debugPrinter.printDebug(req.session);

            // Set last redirect URL (This is form the normal way of handling Post requests with standard form html)
            res.locals.locals_redirect_last = "/";

            /* 
            Stuff to return to the user who did a post request (Basically, if the post was handled by frontend JS)
            Modify the res.json for the user
    
            VERY IMPORTANT NOTE:
            THIS SHOULD ONLY BE UNCOMMENTED IF THIS GET/POST REQUEST ARE HANDLED BY FRONTEND JS
            */
            // res.json({status:200, message:"User Login was Successful!", "redirect": res.locals.locals_redirect_last})

            // Call next middleware (Will probably call saveSessionThenRedirect();)
            next();

            // Debug print (After the next call)
            // debugPrinter.printDebug("Stuff happens after?");
            // debugPrinter.printSuccess(global); // this == global

            // CHECK IF YOU WROTE TO THE DATABASE
            // mySQLPrinter.printSessions();
        }
        // Credentials don't match
        else {
            // Redirect to login When invalid user entry
            throw new UserError(401, "Invalid username and/or password", "/login");
        }
    }
    // Account does not exist
    else {
        // Redirect to login When invalid user entry
        throw new UserError(401, "Invalid username and/or password", "/login");
    }
}


routerUsers.post("/logout", asyncFunctionHandler(middlewareLogout));

async function middlewareLogout(req, res, next) {
    /* 
    Handle /logout 

    TODO: MAKE THIS ASYNCHRONOUS USING AWAIT 
    TODO: IF YOU MAKE MAKE IT WITH AWAIT, HOW WOULD THAT LOOK LIKE BECAUSE YOU WON'T
    TODO: GET THAT ERROR SINCE THE ERROR WILL BE CAUGHT BY asyncFunctionHandler
    TODO: DO I CONTINUE TO USE A PROMISE?

    IMPORTANT NOTES:
        Logout button is handled by frontend js.
        There is no logout page, only a button

    Reference:
        Authentication in Node.js - #7 Login & Logout
            https://www.youtube.com/watch?v=BIxJEdMsCJs&t=9s
            Notes:
                A lot cleaner here and more advanced
    */

    req.session.destroy((err) => {
        // Handle errors
        if (err) {
            // Debug print error
            debugPrinter.printError("Session could not be destroyed.");
            next(err);
        }
        // Handle when session is destroyed
        else {
            // Debug print success
            debugPrinter.printSuccess("Session was destroyed");

            // Clear cookies
            res.clearCookie("csid");

            /* 
            Send json status and message back to the user

            VERY IMPORTANT NOTES:
                You need res.json or the fetch on the frontend js WILL HANG!
            
            */
            res.json(
                {
                    status: "OK",
                    message: "use has logged out."
                });
        }
    });
}

module.exports = routerUsers;
