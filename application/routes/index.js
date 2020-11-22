var express = require('express');
var router = express.Router();

/* GET home page. */
router.get("/", (req, res) => {
  res.render("home");
});

router.get("/home", (req, res) => {
  res.render("home");
});

router.get("/login", (req, res) => {
  res.render("login");

});
router.get("/registration", (req, res) => {
  res.render("registration");

});
router.get("/imagepost", (req, res) => {
  res.render("imagepost");

});

router.get("/postimage", (req, res) => {
  res.render("postimage");

});

module.exports = router;
