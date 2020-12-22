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
// const databaseConnector = require("../config/database_connecter");
const postsModel = require("../database/model_posts");

// Debugging printer
const debugPrinter = require('../helpers/debug/debug_printer');

// Asynchronous Function Middleware Handler
// const asyncFunctionHandler = require("../decorators/async_function_handler");

async function middlewarePageHomeGetPosts(req, res, next) {

    let rowsResultGetPosts = null;

    if(res.locals.session_text_term_search){
        /* 
        Get posts via search
        
        */
        debugPrinter.printSuccess(`Querying via Search`);

        // Query the Database for search term posts
        let [rowsResultGePostsFromSearch, fields] = await postsModel.getPostsByTextTermSearch(res.locals.session_text_term_search);
        rowsResultGetPosts = rowsResultGePostsFromSearch;

    } else{
        /* 
        Get posts via recent posts
        
        */
        debugPrinter.printSuccess(`Querying via Recent Posts`);

        // Query the Database for the posts
        let [rowsResultGetRecentPostsPosts, fields] = await postsModel.getPostThumbnailsRecentByAmount(10);
        
        rowsResultGetPosts = rowsResultGetRecentPostsPosts
    }

    if (rowsResultGetPosts && rowsResultGetPosts.length == 0) {

        // Don't use flash because it's buggy
        // req.flash("alert_user_error", "there are no posts created yet");

        // Print that there are no posts made
        debugPrinter.printWarning("Query to get Recent Posts Failed!")
    } else {

        // Print the results of the database query
        debugPrinter.printSuccess("Query to get Posts was Successful!");
        // debugPrinter.printDebug(rowsResultGetPosts);

        // rowsResultGetRecentPostsPosts IS AN ARRAY OF OBJECTS
        // rowsResultGetRecentPostsPosts.forEach((element, key, value) => {
        //     debugPrinter.printSuccess(key);
        //     debugPrinter.printSuccess(value);
        // });


        // Add the results of the database call to the res.locals
        res.locals.rows_result_get_recent_posts_posts = rowsResultGetPosts;

    }
    next();

};

const postMiddleware = {
    middlewarePageHomeGetPosts: middlewarePageHomeGetPosts

};

module.exports = postMiddleware;