/* 
Created by Joseph Edradan
Github: https://github.com/josephedradan

Date created: 

Purpose:

Details:

Description:

Notes:

    let baseSQLQueryInsert = `
    INSERT INTO posts (posts_title, posts_description, posts_path_file, posts_path_thumbnail, posts_created, posts_fk_users_id) 
    VALUES (?, ?, ?, ?, now(), ?);
    `;

IMPORTANT NOTES:

Explanation:

Reference:


*/


// Database connecter
const databaseConnector = require("../config/database_connecter");
const databaseHandler = require("../database/database_handler");

// Debugging printer
const debugPrinter = require('../helpers/debug/debug_printer');

// Asynchronous Function Middleware Handler
const middlewareAsyncFunctionHandler = require("./middleware_async_function_handler");

const postMiddleware = {};

// postMiddleware.getRecentPosts = middlewareAsyncFunctionHandler(getRecentPosts);
postMiddleware.getRecentPosts = getRecentPosts;

async function getRecentPosts(req, res, next) {


    // Query the Database for the posts
    let [rowsResultGetRecentPostsPosts, fields] = await databaseHandler.getRecentPostThumbnailsByAmount(10);

    if (rowsResultGetRecentPostsPosts && rowsResultGetRecentPostsPosts.length == 0) {

        // Don't use flash because it's buggy
        // req.flash("error", "there are no posts created yet");

        // Print that there are no posts made
        debugPrinter.warningPrinter("Query to get Recent Posts Failed!")
    } else {

        // Print the results of the database query
        debugPrinter.successPrint("Query to get Recent Posts was Successful!");
        debugPrinter.debugPrint(rowsResultGetRecentPostsPosts);

        // Add the results of the database call to the res.locals
        res.locals.rows_result_get_recent_posts_posts = rowsResultGetRecentPostsPosts;

    }
    next();

};
module.exports = postMiddleware;