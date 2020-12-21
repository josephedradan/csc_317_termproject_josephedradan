/* 
Created by Joseph Edradan
Github: https://github.com/josephedradan

Date created: 12/20/20

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

async function getUserDataSimpleFromUsername(username) {

    // Base SQL query to get the username
    let baseSQLQueryGetUserDataSimpleFromUsername =
        `
        SELECT users_id, users_username, users_password 
        FROM users 
        WHERE users_username=?;
        `;

    // Get data from database via username (THIS AWAIT IS LITERALLY USELESS BECAUSE IT'S SEQUENTIAL)
    let [
        rowsResultUserData,
        fields,
    ] = await databaseConnector.execute(baseSQLQueryGetUserDataSimpleFromUsername, [username]);

    return [rowsResultUserData, fields]

}

async function getUserDataAllFromUsername(username) {

    let baseSQLQueryGetUserDataAllFromUsername = "SELECT * FROM users WHERE users_username=?"

    // Check if the Username already exists
    let [rowsResultUserData, fields] = await databaseConnector.execute(
        baseSQLQueryGetUserDataAllFromUsername,
        [username]
    );

    return [rowsResultUserData, fields]

}

async function getEmailDataAllFromEmail(email) {

    let baseSQLQueryGetEmailDataAllFromEmail = "SELECT * FROM users WHERE users_email=?"

    // Check if the Email already exists
    let [rowsResultEmailData, fields] = await databaseConnector.execute(
        baseSQLQueryGetEmailDataAllFromEmail,
        [email]
    );

    return [rowsResultEmailData, fields]
}

async function addUserNewToDatabase(username, email, passwordHashed) {

    // Query insert
    let baseSQLQueryInsert =
        "INSERT INTO users (`users_username`, `users_email`, `users_password`, `users_created`) VALUES (?, ?, ?, now());";

    let [rowsResultInsertUser, fields] = await databaseConnector.execute(baseSQLQueryInsert, [
        username,
        email,
        passwordHashed,
    ]);

    return [rowsResultInsertUser, fields]
}

async function getRecentPostThumbnailsByAmount(limit) {
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

async function addPostNewToDatabase(postTitle, postDescription, postPathFileRelative, postPathThumbnailRelative, fk_user_id) {
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


async function search(termSearch, limit=10) {
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

// V3
const databaseHandler = {
    getPostFromPostID: asyncFunctionHandler(getPostFromPostID, "printFunction"),
    getCommentsFromPostID: asyncFunctionHandler(getCommentsFromPostID, "printFunction"),
    getUserDataSimpleFromUsername: asyncFunctionHandler(getUserDataSimpleFromUsername, "printFunction"),
    getUserDataAllFromUsername: asyncFunctionHandler(getUserDataAllFromUsername, "printFunction"),
    getEmailDataAllFromEmail: asyncFunctionHandler(getEmailDataAllFromEmail, "printFunction"),
    getRecentPostThumbnailsByAmount: asyncFunctionHandler(getRecentPostThumbnailsByAmount, "printFunction"),
    addUserNewToDatabase: asyncFunctionHandler(addUserNewToDatabase, "printFunction"),
    addPostNewToDatabase: asyncFunctionHandler(addPostNewToDatabase, "printFunction"),
    search: asyncFunctionHandler(search, "printFunction"),
}

// V2
// const databaseHandler = {
//     getPostFromPostID: asyncFunctionHandler(getPostFromPostID),
//     getCommentsFromPostID: asyncFunctionHandler(getCommentsFromPostID),
//     getUserDataSimpleFromUsername: asyncFunctionHandler(getUserDataSimpleFromUsername),
//     getUserDataAllFromUsername: asyncFunctionHandler(getUserDataAllFromUsername),
//     getEmailDataAllFromEmail: asyncFunctionHandler(getEmailDataAllFromEmail),
//     getRecentPostThumbnailsByAmount: asyncFunctionHandler(getRecentPostThumbnailsByAmount),
//     addUserNewToDatabase: asyncFunctionHandler(addUserNewToDatabase),
//     addPostNewToDatabase: asyncFunctionHandler(addPostNewToDatabase),
//     search: search,
// }

// V1
// const databaseHandler = {
//     getPostFromPostID: getPostFromPostID,
//     getCommentsFromPostID: getCommentsFromPostID,
//     getUserDataSimpleFromUsername: getUserDataSimpleFromUsername,
//     getUserDataAllFromUsername: getUserDataAllFromUsername,
//     getEmailDataAllFromEmail: getEmailDataAllFromEmail,
//     getRecentPostThumbnailsByAmount: getRecentPostThumbnailsByAmount,
//     addUserNewToDatabase: addUserNewToDatabase,
//     addPostNewToDatabase: addPostNewToDatabase,
//     search: search,
// }
module.exports = databaseHandler;