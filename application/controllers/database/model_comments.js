/* 
Created by Joseph Edradan
Github: https://github.com/josephedradan

Date created: 12/22/2020

Purpose:

Details:

Description:

Notes:

IMPORTANT NOTES:

Explanation:

Reference:

*/

// Database Connector
const databaseConnector = require('../config/database_connecter');

// Asynchronous Function Middleware Handler
const asyncFunctionHandler = require("../decorators/async_function_handler");

async function getCommentsFromPostID(post_id) {
    // SQL Query to get post ID
    let baseSQLQueryGetCommentsFromPostID =
        `
        SELECT users.users_username, posts.posts_id, comments.comments_comment, comments.comments_date_created 
        FROM posts
        JOIN comments
        JOIN users
        ON users.users_id=comments.comments_fk_users_id 
        ON posts.posts_id=comments.comments_fk_posts_id 
        WHERE posts.posts_id=?
        ORDER BY comments.comments_date_created DESC    
        `;

    // Get Post from post_id
    let [rowsResultPostIDComments, fields] = await databaseConnector.query(
        baseSQLQueryGetCommentsFromPostID,
        [post_id]);

    return [rowsResultPostIDComments, fields]
}

const commentsModel = {
    getCommentsFromPostID: asyncFunctionHandler(getCommentsFromPostID, "printFunction"),

}


module.exports = commentsModel;