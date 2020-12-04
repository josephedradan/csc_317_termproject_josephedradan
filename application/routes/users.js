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
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


// router.post('/register', (req, res, next) => {
//   res.send('respond with a resource');
// })

module.exports = router;
