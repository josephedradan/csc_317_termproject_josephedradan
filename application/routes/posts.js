/* 
Created by Joseph Edradan
Github: https://github.com/josephedradan

Date created: 12/9/2020

Purpose:
    Handle DB Calls for printing i guess

Details:

Description:

Notes:
    cb
        CallBack
IMPORTANT NOTES:

Explanation:

Reference:

*/
const express = require('express');
const router = express.Router();
const sharp = require('sharp');
const multer = require('multer');
const crypto = require('crypto');

// Data base connecter
const databaseConnector = require('../config/database_connecter');

// Custom user error class
const PostError = require('../helpers/error/post_error');

// Debugging printer
const debugPrinter = require('../helpers/debug/debug_printer');

// Asynchronous Function Middleware Handler
const middlewareAsyncFunctionHandler = require("../helpers/middleware_async_function_handler");


// Rename and Upload image to storage
const multerStorage = multer.diskStorage({

    // Add an new key called destination
    destination: (req, file, cb) => {
        cb(null, "public/images/uploads")
    },

    // Add a new key called filename
    filename: (req, file, cb) => {

        // Get file ext
        let fileExt = file.mimetype.split("/")[1];

        // 
        let randomName = crypto.randomBytes(22).toString("hex");
        cb(null, `${randomName}.${fileExt}`);
    }
})

const uploader = multer({ storage: multerStorage });

router.post('/createPost', uploader.single("post_file"), middlewareAsyncFunctionHandler(createPost));

async function createPost(req, res, next) {
    debugPrinter.debugPrint(req.file);

    let sqlQueryInsert = `
    INSERT INTO posts (posts_title, posts_description, posts_path_file, posts_path_thumbnail, posts_created, posts_fk_users_id) 
    VALUES (?, ?, ?, ?, now(), ?);
    `;

    // Get the file path
    let postPathFile = req.file.path;

    // Get the filename for the thumbnail
    let postThumbnailName = `thumbnail-${req.file.filename}`

    // Get the path of the thumbnail
    let postPathThumbnail = req.file.destination + "/" + postThumbnailName;

    // Get the post title
    let postTitle = req.body["post_title"];

    // Get the description of the post
    let postDescription = req.body["post_description"];

    // Get the user ID based on the current session
    let fk_user_id = req.session.session_user_id;

    // TODO: SERVER VALIDATION EXPRESS-VALIDATION
    // TODO: VALIDATE  [postTitle, postDescription, postPathFile, postPathThumbnail, fk_user_id]

    // Make a thumbnail of postPathFile and post it to 
    await sharp(postPathFile).resize(200).toFile(postPathThumbnail);

    // debugPrinter.errorPrint(postPathThumbnail);
    // debugPrinter.errorPrint(postPathFile);
    // debugPrinter.middlewarePrint([postTitle, postDescription, postPathFile, postPathThumbnail, fk_user_id]);

    // Make database query
    const [rowsResultInsertPost, fields] = await databaseConnector.execute(
        sqlQueryInsert,
        [postTitle, postDescription, postPathFile, postPathThumbnail, fk_user_id]
    )

    // debugPrinter.debugPrint(rowsResultInsertPost);

    // Check if query was successful
    if (rowsResultInsertPost && rowsResultInsertPost.affectedRows) {
        debugPrinter.successPrint(`Image uploaded by ${req.session.session_username} was successful!`);
    } else {
        throw new PostError('Post could not be created!', '/postImage', 200);
    };

    res.redirect("/")
};

module.exports = router;
