/* 
Created by Joseph Edradan
Github: https://github.com/josephedradan

Date created: 

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
const router = express.Router();

// Debug printer
const debugPrinter = require('../helpers/debug/debug_printer');

// middlewareRouteProtectors
const middlewareRouteProtectors = require('../middleware/middleware_route_protectors');

// middlewareGetRecentPosts
const middlewareGetRecentPosts = require('../middleware/middleware_get_recent_posts');

// Asynchronous Function Middleware Handler
const middlewareAsyncFunctionHandler = require("../middleware/middleware_async_function_handler");

/* GET home page. */
router.get("/", middlewareAsyncFunctionHandler(middlewareGetRecentPosts.getRecentPosts), getPageHome)
router.get("/home", middlewareAsyncFunctionHandler(middlewareGetRecentPosts.getRecentPosts), getPageHome);

// GET Login page 
router.get("/login", getPageLogin);

function getPageLogin(req, res, next) {
    // debugPrinter.routerPrint("/login");

    // Throw an error...
    // next(new Error('test'));

    res.render("login", { title: "Login" });

};

router.get("/registration", getPageRegistration);

function getPageRegistration(req, res, next) {
    // debugPrinter.routerPrint("/registration");

    res.render("registration", {
        title: "Registration",
        js_files: [
            "js/registration.js"
        ]
    });
};

router.get("/image-post", getPageImagePost);

function getPageImagePost(req, res, next) {
    res.render("image-post", { title: "Image post" });
};


// Route Protection (Prevents user from accessing a page, specifically post-image)
router.use("/post-image", middlewareAsyncFunctionHandler(middlewareRouteProtectors.checkIfLoggedIn));

router.get("/post-image", getPagePostImage);

function getPagePostImage(req, res, next) {
    res.render("post-image",
        {
            title: "Post Image",
            js_files: [
                "https://unpkg.com/axios/dist/axios.min.js",
                "js/postimage.js",
            ]
        });
};

function getPageHome(req, res, next) {
    res.render("home", {
        // Order of js files matter
        title: "Home",
        js_files: [
            "https://unpkg.com/axios/dist/axios.min.js",
            "js/home.js",
        ]
    });
}

// router.get("/post/:id(\\d+)", getPagePost);

// async function getPagePost(req, res, next) {

//     var baseSQL =
//         "SELECT u.id, u.username, p.title, p.description, p.thumbnail, p.created FROM users u JOIN posts p ON u.id=fk_userid WHERE p.id=?;";

//     let [r, fields] = await db.query(baseSQL, [req.params.id]);

//     if (r && r.length) {
//         let baseSQL1 =
//             "SELECT u.username, p.id, c.description, c.created FROM posts p JOIN comments c JOIN users u ON u.id=fk_userid_c ON p.id=fk_postid_c WHERE p.id=? ORDER BY created DESC";
//         let [r1, fields2] = await db.query(baseSQL1, [req.params.id]);
//         console.log(r[0]);
//         res.render("image", {
//             post: r[0],
//             comment: yeet.convert(r1),
//             unique: "Post",
//         });
//         req.session.viewing = req.params.id;
//     } else {
//         req.flash("error", "This is not the post you are looking for!");
//         res.redirect("/");
//     }

// };

module.exports = router;
