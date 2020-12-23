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
const asyncFunctionHandler = require("../controllers/decorators/async_function_handler");

async function getCommentsFromPostID(postID) {
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
        ORDER BY comments.comments_date_created ASC    
        `;

    // Get Post from post_id
    let [rowsResultPostIDComments, fields] = await databaseConnector.query(
        baseSQLQueryGetCommentsFromPostID,
        [postID]);

    return [rowsResultPostIDComments, fields];
}

async function insertCommentToDatabase(userID, postID, comment){
    
    // Query to insert comment
    let baseSQLQueryInsertComment =
    `
    INSERT INTO comments (comments_fk_users_id, comments_fk_posts_id, comments_comment, comments_date_created)
    VALUES(?, ?, ?, now())
    `

    // Result of query
    let [rowsResultInsertComment, fields] = await databaseConnector.query(
        baseSQLQueryInsertComment,
        [userID, postID, comment]);

    return [rowsResultInsertComment, fields];
}

const commentsModel = {
    getCommentsFromPostID: asyncFunctionHandler(getCommentsFromPostID, "printFunction"),
    insertCommentToDatabase: asyncFunctionHandler(insertCommentToDatabase, "printFunction"),
}


module.exports = commentsModel;