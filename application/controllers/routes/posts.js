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
const routerPosts = express.Router();
const sharp = require('sharp');
const multer = require('multer');
const crypto = require('crypto');

// Database connecter
// const databaseConnector = require('../config/database_connecter');

// Database Handler
const postModel = require('../database/model_posts')

// Custom user error class
const PostError = require('../helpers/error/post_error');

// Debugging printer
const debugPrinter = require('../helpers/debug/debug_printer');

// Asynchronous Function Middleware Handler
const asyncFunctionHandler = require("../decorators/async_function_handler");


// Rename and Upload image to storage
const multerStorage = multer.diskStorage({

    // Add an new key called destination
    destination: (req, file, cb) => {

        // Image upload location
        let pathImageFileUploadLocation = "public/images/uploads"

        cb(null, pathImageFileUploadLocation)
    },

    // Add a new key called filename
    filename: (req, file, cb) => {

        // Get file ext
        let fileExt = file.mimetype.split("/")[1];

        // Generate file name 
        let randomName = crypto.randomBytes(22).toString("hex");
        cb(null, `${randomName}.${fileExt}`);
    }
})

const uploader = multer({ storage: multerStorage });

routerPosts.post('/createPost', uploader.single("post_file"), asyncFunctionHandler(createPost));

async function createPost(req, res, next) {
    debugPrinter.printDebug(req.file);

    // Get the file path
    let postPathFileTemp = req.file.path;

    // Replace \ with /
    postPathFileTemp = postPathFileTemp.replace(/\\/g, "/");

    /* 
    Path for file to be 

    Notes: 
        Must replace "public" with ".."

    */
    let postPathFileRelative = postPathFileTemp.replace("public", "");

    // Acutal file path on server
    let postPathFile = postPathFileTemp;

    // Get the filename for the thumbnail
    let postThumbnailName = `thumbnail-${req.file.filename}`


    // Get the path of the thumbnail
    let postPathThumbnailTemp = req.file.destination;

    /* 
    File path for image based on the uploads folder being inside images

    Notes: 
        Must replace "public" with ".."
    */
    let postPathThumbnailRelative = postPathThumbnailTemp.replace("public", "") + "/" + postThumbnailName;

    // Acutal file path on server
    let postPathThumbnail = postPathThumbnailTemp + "/" + postThumbnailName;

    // Get the post title
    let postTitle = req.body["post_title"];

    // Get the description of the post
    let postDescription = req.body["post_description"];

    // Get the user ID based on the current session
    let postFKUserID = req.session.session_user_id;

    // TODO: SERVER VALIDATION EXPRESS-VALIDATION
    // TODO: VALIDATE  [postTitle, postDescription, postPathFile, postPathThumbnail, fk_user_id]

    // Make a thumbnail of postPathFile (Needs to be sequential)
    await sharp(postPathFile).resize(200).toFile(postPathThumbnail);

    // debugPrinter.printSuccess(postPathThumbnail);
    // debugPrinter.printSuccess(postPathFile);
    // debugPrinter.printSuccess([postTitle, postDescription, postPathFile, postPathThumbnail, fk_user_id]);
    // debugPrinter.printSuccess(postPathFileRelative);
    // debugPrinter.printSuccess(postPathThumbnailRelative);

    // Make database Insert Query (Needs to be sequential)
    const [rowsResultInsertPost, fields] = await postModel.addPostNewToDatabase(
        postTitle,
        postDescription,
        postPathFileRelative,
        postPathThumbnailRelative,
        postFKUserID)

    // debugPrinter.printRouter(rowsResultInsertPost);

    // Check if Insert query was successful in being uploaded to the database
    if (rowsResultInsertPost && rowsResultInsertPost.affectedRows) {
        debugPrinter.printSuccess(`File uploaded by ${req.session.session_username} was successful!`);
    } else {

        // The below should be handled by asyncFunctionHandler buy 
        // res.json({status:"OK", message:"Post was not Successful!", redirect: res.redirect.redirect_last})

        throw new PostError(400, `File uploaded by ${req.session.session_username} was not Successful!`, '/postImage');
    };

    debugPrinter.printDebug("File posted data");
    debugPrinter.printDebug(rowsResultInsertPost);

    // Last added post's ID
    let postIDLast = rowsResultInsertPost["insertId"];

    // Set last redirect URL (This is form the normal way of handling Post requests with standard form html)
    res.locals.redirect_last = "/post/" + postIDLast;

    /* 
    Stuff to return to the user who did a post request (Basically, if the post was handled by frontend JS)
    Modify the res.json for the user

    VERY IMPORTANT NOTE:
        THIS SHOULD ONLY BE UNCOMMENTED IF THIS GET/POST REQUEST ARE HANDLED BY FRONTEND JS
    */
    // Stuff to return to the user who did a post request (Basically, if the post was handled by frontend JS)
    res.json({
        status: 200,
        message: `${req.session.session_username} your upload successful!`,
        "redirect": res.locals.redirect_last
    })

    // Call next middleware (Will probably call saveSessionThenRedirect();)
    // next();
};


routerPosts.get('/search', asyncFunctionHandler(middlewareSearch))

async function middlewareSearch(req, res, next) {
    /* 
    Allow searching on website
    
    Notes:
        This middleware is not hooked up because this way of sending back and letting the uer handle the posts sucks since you can't
        search while you are on a post because this middleware REQUIRES you to be on the home page!

    Reference:
        Node.js: how to get the URL to the page which called a POST from the request body?
            https://stackoverflow.com/questions/53663004/node-js-how-to-get-the-url-to-the-page-which-called-a-post-from-the-request-bod

        Use dynamic (variable) string as regex pattern in JavaScript
            https://stackoverflow.com/questions/17885855/use-dynamic-variable-string-as-regex-pattern-in-javascript
    */

    /* 
    Check if req.headers.referer has more stuff in its string than req.headers.host
    If req.headers.referer has more stuff in its url then redirect the user to the home page then search

    */

    let textTermSearched = req.query.search;

    debugPrinter.printSuccess(`Search Term: ${textTermSearched}`);

    // let regexPatternBaseURL = new RegExp(req.headers.host + "\/(.+)"); // do ", g" for global, but it's not needed here

    // Url of the referer
    // let URLReferer = req.headers.referer;

    // debugPrinter.printWarning(req.headers.referer);
    // debugPrinter.printWarning(req.headers.host);
    // debugPrinter.printWarning(req.hostname);

    /*
    Check if the host and the referer are the same
    If both urls are different (a match has occurred) then redirect and search

    Notes:
        Redirects/Renders won't work if this get request is handled by the user
    */
    /*
     if (URLReferer.match(regexPatternBaseURL)){
         // debugPrinter.printWarning(URLReferer.match(regexPatternBaseURL));
         debugPrinter.printWarning("Current page is not the home page!")
 
         // Put what the user searched into the session
         req.session.session_text_term_search = textTermSearched;
         
         // Save Session
         req.session.save((err) => {
             // Handle errors when saving
             if (err) {
                 next(err);
             } 
 
             // If successful after saving
             else {
                 debugPrinter.printDebug(`Redirecting User to: /`);
     
                 // Redirect home
                 res.redirect("/");
             }
             
         });
         return;
 
     }
    */

    if (!textTermSearched) {
        // If nothing is given then return an empty results_search
        res.send({
            results_status: "info",
            message: "No search term given.",
            results_search: []
        });
    } else {

        // Query Database given search term
        let [rowsResultGePostsFromSearch, fields] = await postModel.getPostsByTextTermSearch(textTermSearched);

        // Search results found
        if (rowsResultGePostsFromSearch.length) {
            res.send({
                message: `${rowsResultGePostsFromSearch.length} results found`,
                results_search: rowsResultGePostsFromSearch
            });
        }

        // No search results found so give recent posts instead
        else {
            let [rowsResultGetRecentPostsPosts, fields] = await postModel.getPostThumbnailsRecentByAmount(10);
            res.send({
                message: "No results where found for your search but here are the 10 most recent posts",
                results_search: rowsResultGetRecentPostsPosts
            });
        }
    }
}

module.exports = routerPosts;
