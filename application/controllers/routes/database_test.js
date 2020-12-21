const express = require('express');
const router = express.Router();
const database = require('../config/database_connecter');

/* 
// TODO: add async
router.get('/getAllUsers',  (req, res) => {
    // console.log("Getting all users")
    // res.send('Getting all users');
    
    // try{
    //     let [r, fields] = await database.query("SELECT * FROM users;")
    //     console.log(r)
    //     res.send(r)
    // }
    // catch(err){
    //     console.log(err)    
    //     res.send(err)
    // }
    
    database.query("SELECT * FROM users;")
    .then(([r,fields])=>{
        console.log(r)
        res.send(r)
    })

});
 */
router.get('/getAllUsers', getAllUsers);

router.get('/getAllPosts', getAllPosts);

function getAllUsers(req, res) {
    database.query("SELECT * FROM users;")
        .then(([result, fields]) => {
            console.log(result)
            res.send(result)
        })
}

function getAllPosts(req, res) {
    database.query("SELECT * FROM posts;")
        .then(([result, fields]) => {
            console.log(result)
            res.send(result)
        })
}

module.exports = router;