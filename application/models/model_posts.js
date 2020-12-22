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

async function getPostFromPostID(post_id) {
    // SQL Query to get post id
    let baseSQLQueryGetPostFromPostID =
        `
        SELECT users.users_id, users.users_username, posts.posts_title, posts.posts_description, 
        posts.posts_path_file, posts.posts_date_created 
        FROM users 
        JOIN posts ON users.users_id=posts.posts_fk_users_id WHERE posts.posts_id=?;
        `;

    // Get Post from post_id
    let [resultsSQLPostID, fields] = await databaseConnector.query(
        baseSQLQueryGetPostFromPostID,
        [post_id]);

    return [resultsSQLPostID, fields]

}

async function getPostThumbnailsRecentByAmount(limit) {
    // Query Database fore recent posts
    let baseSqlQueryGetRecentPosts =
        `
        SELECT users.users_username, posts.posts_id, posts.posts_title, posts.posts_description, posts.posts_path_thumbnail, posts.posts_date_created 
        FROM users 
        JOIN posts ON users.users_id=posts.posts_fk_users_id 
        ORDER BY posts.posts_date_created DESC LIMIT ?;
        `

    // Query the Database for the posts
    let [rowsResultGetRecentPostsPosts, fields] = await databaseConnector.execute(
        baseSqlQueryGetRecentPosts,
        [limit]);

    return [rowsResultGetRecentPostsPosts, fields];
}

async function insertPostToDatabase(postTitle, postDescription, postPathFileRelative, postPathThumbnailRelative, fk_user_id) {
    // SQl Query to insert image information
    let baseSQLQueryInsertPostNew =
        `
        INSERT INTO posts (posts_title, posts_description, posts_path_file, posts_path_thumbnail, posts_date_created, posts_fk_users_id) 
        VALUES (?, ?, ?, ?, now(), ?);
        `;

    // Make database Insert Query (Needs to be sequential)
    let [rowsResultInsertPost, fields] = await databaseConnector.execute(
        baseSQLQueryInsertPostNew,
        [postTitle, postDescription, postPathFileRelative, postPathThumbnailRelative, fk_user_id]
    )

    return [rowsResultInsertPost, fields];
}

async function getPostsByTextTermSearch(termSearch, limit=10) {
    /* 
    The SQl query should technically match getRecentPostThumbnailsByAmount()'s SQl query
        users.users_username, posts.posts_id, posts.posts_title, posts.posts_description, posts.posts_path_thumbnail, posts.posts_date_created 
    
    */

    let termSearchModified = "%" + termSearch + "%";

    // SQL Query to search
    let baseSQLQuerySearch =
        `
        SELECT users.users_username, posts.posts_id, posts.posts_title, posts.posts_description, posts.posts_path_thumbnail, posts.posts_date_created, concat_ws(' ', posts.posts_title, posts.posts_description) 
        AS haystack     
        FROM users
        JOIN posts ON users.users_id=posts.posts_fk_users_id 
        HAVING haystack like ?
        LIMIT ?;
        `

    // Make SQL Query to search
    let [rowsResultSearch, fields] = await databaseConnector.execute(
        baseSQLQuerySearch,
        [termSearchModified, limit]
    )

    return [rowsResultSearch, fields]

}

const postsModel = {
    getPostsByTextTermSearch: asyncFunctionHandler(getPostsByTextTermSearch, "printFunction"),
    getPostFromPostID: asyncFunctionHandler(getPostFromPostID, "printFunction"),
    getPostThumbnailsRecentByAmount: asyncFunctionHandler(getPostThumbnailsRecentByAmount, "printFunction"),
    insertPostToDatabase: asyncFunctionHandler(insertPostToDatabase, "printFunction"),
}

module.exports = postsModel;