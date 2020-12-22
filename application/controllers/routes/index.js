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
const postsModel = require('../../models/model_posts')
const commentsModel = require('../../models/model_comments')

// Debug printer
const debugPrinter = require('../helpers/debug/debug_printer');

// middlewareRouteProtectors
const middlewareRouteProtectors = require('../middleware/middleware_route_protectors');

// middlewareGetRecentPosts
const middlewareGetPosts = require('../middleware/middleware_get_posts');

// Asynchronous Function Middleware Handler
const asyncFunctionHandler = require("../decorators/async_function_handler");

/* GET home page. */
routerIndex.get("/", asyncFunctionHandler(middlewareGetPosts.middlewarePageHomeGetPosts), middlewarePageHome)
// routerIndex.get("/home", asyncFunctionHandler(middlewareGetRecentPosts.getRecentPosts), middlewarePageHome);

function middlewarePageHome(req, res, next) {
    res.render(
        "home",
        {
            // Order of js files matter
            // render_page_title: "Home",
            // render_js_files:
            //     [
            //         // "https://unpkg.com/axios/dist/axios.min.js",
            //         // "/js/home_OLD.js",
            //     ],
        });
}

// GET Login page 
routerIndex.get("/login", asyncFunctionHandler(middlewarePageLogin));

async function middlewarePageLogin(req, res, next) {
    // debugPrinter.printRouter("/login");

    // TODO Throw an error...
    // next(new Error('test'));

    res.render(
        "login",
        {
            // render_page_title: "Login"
        });

};

routerIndex.get("/registration", middlewarePageRegistration);

function middlewarePageRegistration(req, res, next) {
    // debugPrinter.printRouter("/registration");

    res.render(
        "registration",
        {
            // render_page_title: "Registration",
            render_js_files:
                [
                    "/js/registration.js"
                ]
        });
};


// Route for image-post (Old post)
routerIndex.get("/image-post", middlewarePageImagePost);

function middlewarePageImagePost(req, res, next) {
    res.render(
        "image-post",
        {
            // render_page_title: "Image post"
        });
};


// Route Protection (Prevents user from accessing a page, specifically post-image)
routerIndex.use("/post-image", asyncFunctionHandler(middlewareRouteProtectors.checkIfLoggedIn));

routerIndex.get("/post-image", middlewarePagePostImage);

function middlewarePagePostImage(req, res, next) {
    res.render(
        "post-image",
        {
            // render_page_title: "Post Image",
            render_js_files:
                [
                    // "https://unpkg.com/axios/dist/axios.min.js",
                    "/js/post_image.js",
                ]
        });
};


routerIndex.get("/post/:post_id(\\d+)", asyncFunctionHandler(middlewarePagePost));

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
    let postIDGiven = req.params.post_id;
    
    // Get Post from post_id
    let [resultsSQLPostID, fields] = await postsModel.getPostFromPostID(postIDGiven);

    // Post object
    let postObject = resultsSQLPostID[0];
        
    if (resultsSQLPostID && resultsSQLPostID.length) {

        // Get Post from post_id
        let [rowsResultPostIDComments, fields2] = await commentsModel.getCommentsFromPostID(postIDGiven);

        res.render(
            "post",
            {
                render_page_title: postObject["posts_title"],
                render_post_current: postObject,
                // comments: yeet.convert(rowsResultPostIDComments),
                // unique: "Post",
            });

        // req.session.session_viewing = req.params.post_id;
    } else {

        // req.flash("alert_user_error", "This is not the post you are looking for!");
        res.redirect("/");
    }
};

routerIndex.get('/results', asyncFunctionHandler(middlewareSearch))

async function middlewareSearch(req, res, next) {
    /* 
    Allow searching on website
    
    Reference:
        Node.js: how to get the URL to the page which called a POST from the request body?
            https://stackoverflow.com/questions/53663004/node-js-how-to-get-the-url-to-the-page-which-called-a-post-from-the-request-bod

        Use dynamic (variable) string as regex pattern in JavaScript
            https://stackoverflow.com/questions/17885855/use-dynamic-variable-string-as-regex-pattern-in-javascript
    */

    // debugPrinter.printWarning(req.headers.referer);
    // debugPrinter.printWarning(req.headers.host);
    // debugPrinter.printWarning(req.hostname);

    let textTermSearched = req.query.search_query;

    debugPrinter.printSuccess(`Search Term: ${textTermSearched}`);

    // /*
    // Check if the host and the referer are the same
    // If both urls are different (a match has occurred) then redirect and search
    // */
    // if (URLReferer.match(regexPatternBaseURL)){
    //     // debugPrinter.printWarning(URLReferer.match(regexPatternBaseURL));
    //     debugPrinter.printWarning("Current page is not the home page!")
    //     return;

    // }

    if (!textTermSearched) {
        // If nothing is given then return an empty results_search
        // res.send({
        //     results_status: "info",
        //     message: "No search term given.",
        //     results_search: []
        // });

        res.redirect("/");

    } else {

        // Query Database given search term
        let [rowsResultGePostsFromSearch, fields] = await postsModel.getPostsByTextTermSearch(textTermSearched);

        // Search results found
        if (rowsResultGePostsFromSearch.length) {
            res.locals.locals_rows_result_get_recent_posts_posts = rowsResultGePostsFromSearch;

            // res.send({
            //     message: `${rowsResultSearch.length} results found`,
            //     results_search: rowsResultSearch
            // });

            res.render(
                "home",
                {
                    
                });

        }

        // No search results found so give recent posts instead
        else {
            let [rowsResultGetRecentPostsPosts, fields] = await postsModel.getPostThumbnailsRecentByAmount(10);
            res.locals.locals_rows_result_get_recent_posts_posts = rowsResultGetRecentPostsPosts;

            // res.send({
            //     message: "No results where found for your search but here are the 10 most recent posts",
            //     results_search: rowsResultGetRecentPostsPosts
            // });
            res.render(
                "home",
                {
                    
                });
        }
    }
}



module.exports = routerIndex;
