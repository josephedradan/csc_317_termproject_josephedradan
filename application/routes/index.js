var express = require('express');
var router = express.Router();

/* GET home page. */
router.get("/", (req, res) => {
  // console.log(res.locals.photodata);
  res.render("home");
});

// router.get("/home", (req, res) => {
//   // console.log(res.locals.photodata);
//   res.render("home");
// });

router.get("/login", (req, res) => {
  // console.log(res.locals.photodata);
  res.render("login");

});
router.get("/registration", (req, res) => {
  // console.log(res.locals.photodata);
  res.render("registration");

});
router.get("/imagepost", (req, res) => {
  // console.log(res.locals.photodata);
  res.render("imagepost");

});

router.get("/postimage", (req, res) => {
  // console.log(res.locals.photodata);
  res.render("postimage");

});


module.exports = router;
