/* 
Created by Joseph Edradan
Github: https://github.com/josephedradan

Date created: 

Purpose:

Details:

Description:

Notes:

IMPORTANT NOTES:

Explanation:

Reference:

*/
const express = require('express');
var router = express.Router();

/* GET home page. */
router.get("/", getHome)
router.get("/home", getHome);

// GET Login page 
router.get("/login", (req, res, next) => {

  // Throw an error...
  // next(new Error('test'));

  res.render("login", { title: "Login" });

});
router.get("/registration", (req, res, next) => {
  res.render("registration", {
    title: "Registration",
    js_files: [
      "js/registration.js"]
  });

});
router.get("/imagepost", (req, res, next) => {
  res.render("imagepost", { title: "Image post" });

});

router.get("/postimage", (req, res, next) => {
  res.render("postimage", { title: "Post Image" });

});

function getHome(req, res, next) {
  res.render("home", {
    // Order of js files matter
    title: "Home", js_files: [
      "https://unpkg.com/axios/dist/axios.min.js",
      "js/home.js",
    ]
  });
}

module.exports = router;
