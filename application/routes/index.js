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

const routeProtectors = require('../middleware/route_protectors');

/* GET home page. */
router.get("/", getHome)
router.get("/home", getHome);

// GET Login page 
router.get("/login", (req, res, next) => {
    // debugPrinter.routerPrint("/login");

    // Throw an error...
    // next(new Error('test'));

    res.render("login", { title: "Login" });

});

router.get("/registration", (req, res, next) => {
    // debugPrinter.routerPrint("/registration");

    res.render("registration", {
        title: "Registration",
        js_files: [
            "js/registration.js"]
    });
});

router.get("/imagepost", (req, res, next) => {
    res.render("imagepost", { title: "Image post" });
});


// Route Protection for Logged in Users
router.use("/postimage", routeProtectors.checkIfLoggedIn);
router.get("/postimage", (req, res, next) => {
    res.render("postimage", { title: "Post Image" });
});

async function getHome(req, res, next) {
    res.render("home", {
        // Order of js files matter
        title: "Home", js_files: [
            "https://unpkg.com/axios/dist/axios.min.js",
            "js/home.js",
        ]
    });
}

module.exports = router;
