/* 
Created by Joseph Edradan
Github: https://github.com/josephedradan

Date created: 

Purpose:

Details:

Description:

Notes:

IMPORTANT NOTES:

Explanation:

Reference:



*/
const express = require("express");
const routerComments = express.Router();

// Debugging printer
const debugPrinter = require('../helpers/debug/debug_printer');

// Database Handler
const commentsModel = require('../../models/model_comments');
const usersModel = require('../../models/model_users')

// Custom user error class
const UserError = require("../helpers/error/user_error");

// Asynchronous Function Middleware Handler
const asyncFunctionHandler = require("../decorators/async_function_handler");


routerComments.post('/create', asyncFunctionHandler(middlewareCreateComment))

async function middlewareCreateComment(req, res, next) {
    /* 
    Create comment only when logged in


    Notes:
        userID, postID, comment
    
    */

    if (req.session.session_username) {

        let commentUsername = req.session.session_username;

        // Needs to be sequential
        let rowsResultUserID = await usersModel.getUserIDFromUserName(commentUsername);

        debugPrinter.debugPrinter(rowsResultUsername);

        // If username does not exist
        if (!rowsResultUsername && !rowsResultUsername.length) {
            throw new Error(
                `Username does not exist in the database: ${commentUsername}`
            );
        }

        let commentUserID = rowsResultUserID["users_id"];

        let commentPostID = req.body["comment_post_id"];

        let commentComment = req.body["comment_comment"]

        let rowsResultInsertComment = await commentsModel.insertCommentToDatabase(commentUserID, commentPostID, commentComment);

        // Debug if the comment the response after the comment was added to the database
        debugPrinter.printDebug(rowsResultInsertComment);


        // Check if query insert comment was successful
        if (rowsResultInsertComment && rowsResultInsertComment.affectedRows) {
            let stringSuccess = `Comment by ${commentUsername} on post ID ${commentPostID} was successful!`
            debugPrinter.printSuccess(stringSuccess);
        } else {

            throw new PostError(400, `File uploaded by ${req.session.session_username} was not Successful!`, '/postImage');
        };

        // Get the url of the post
        res.locals.locals_redirect_last = "/post/" + commentPostID;

        // Redirect the user back to the post via client side
        res.json({
            status: 200,
            message: `${req.session.session_username} your comment was successfully!`,
            "redirect": res.locals.locals_redirect_last,
            "comment_comment": commentComment,
            "user_username": commentUsername,
            "post_post_id": commentPostID
        })


        /* 
        If post request was not Client side then use Server side handling with the next() call
        
        */
        // next();

    } else {
        debugPrinter.printWarning("User not logged in tried to comment. Will redirect")
        res.locals.locals_redirect_last = "/login"

        res.json({
            status: 401,
            message: `You are not logged in`,
            "redirect": res.locals.locals_redirect_last
        })

    }
}


module.exports = routerComments;