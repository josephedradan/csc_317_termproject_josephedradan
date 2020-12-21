/* 
Created by Joseph Edradan
Github: https://github.com/josephedradan

Date created: 12/9/2020

Purpose:
  Handle basic pages

Details:

Description:

Notes:

IMPORTANT NOTES:

Explanation:

Reference:

*/
const express = require('express');
const routerIndex = express.Router();

// Database connecter
// const databaseConnector = require('../config/database_connecter');

// Database Handler
const databaseHandler = require('../database/database_handler')

// Debug printer
const debugPrinter = require('../helpers/debug/debug_printer');

// middlewareRouteProtectors
const middlewareRouteProtectors = require('../middleware/middleware_route_protectors');

// middlewareGetRecentPosts
const middlewareGetRecentPosts = require('../middleware/middleware_get_recent_posts');

// Asynchronous Function Middleware Handler
const asyncFunctionHandler = require("../decorators/async_function_handler");

/* GET home page. */
routerIndex.get("/", asyncFunctionHandler(middlewareGetRecentPosts.getRecentPosts), middlewarePageHome)
routerIndex.get("/home", asyncFunctionHandler(middlewareGetRecentPosts.getRecentPosts), middlewarePageHome);

// GET Login page 
routerIndex.get("/login", asyncFunctionHandler(middlewarePageLogin));

async function middlewarePageLogin(req, res, next) {
    // debugPrinter.printRouter("/login");

    // TODO Throw an error...
    // next(new Error('test'));

    res.render(
        "login",
        {
            page_title: "Login"
        });

};

routerIndex.get("/registration", middlewarePageRegistration);

function middlewarePageRegistration(req, res, next) {
    // debugPrinter.printRouter("/registration");

    res.render(
        "registration",
        {
            page_title: "Registration",
            js_files:
                [
                    "/js/registration.js"
                ]
        });
};


// Route for image-post (Old post)
routerIndex.get("/image-post", getPageImagePost);

function getPageImagePost(req, res, next) {
    res.render(
        "image-post",
        {
            page_title: "Image post"
        });
};


// Route Protection (Prevents user from accessing a page, specifically post-image)
routerIndex.use("/post-image", asyncFunctionHandler(middlewareRouteProtectors.checkIfLoggedIn));

routerIndex.get("/post-image", middlewarePagePostImage);

function middlewarePagePostImage(req, res, next) {
    res.render(
        "post-image",
        {
            page_title: "Post Image",
            js_files:
                [
                    "https://unpkg.com/axios/dist/axios.min.js",
                    "/js/post_image.js",
                ]
        });
};

function middlewarePageHome(req, res, next) {
    res.render(
        "home",
        {
            // Order of js files matter
            page_title: "Home",
            js_files:
                [
                    "https://unpkg.com/axios/dist/axios.min.js",
                    // "/js/home_OLD.js",
                ],
        });
}

routerIndex.get("/post/:post_id(\\d+)", middlewarePagePost);

async function middlewarePagePost(req, res, next) {
    /*  
    Handles post pages

    Notes:
        :id(\\d+)   Means that the id must be a number

    Reference:
        CSC 317 Term Project Show an Individual Post
            https://www.youtube.com/watch?v=GC07FdbVozc&feature=youtu.be
                Notes:
                    Using :id will prevent any following URL such as /posts/help, it will treat the id as help instead,
                    but i guess that happens if the order is wrong.
                    Also there is regex in :id(\\d+)
    */

    // Get post ID from url
    let post_id = req.params.post_id;
    
    // Get Post from post_id
    let [resultsSQLPostID, fields] = await databaseHandler.getPostFromPostID(post_id);

    // Post object
    let postObject = resultsSQLPostID[0];
        
    if (resultsSQLPostID && resultsSQLPostID.length) {

        // Get Post from post_id
        let [rowsResultPostIDComments, fields2] = await databaseHandler.getCommentsFromPostID(post_id);

        res.render(
            "post",
            {
                title: postObject["posts_title"],
                postCurrent: postObject,
                // comment: yeet.convert(rowsResultPostIDComments),
                // unique: "Post",
            });
        req.session.viewing = req.params.id;
    } else {

        req.flash("alert_user_error", "This is not the post you are looking for!");
        res.redirect("/");
    }
};

module.exports = routerIndex;
