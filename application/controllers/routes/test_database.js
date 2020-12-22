/* 
Created by Joseph Edradan
Github: https://github.com/josephedradan

Date created: 12/9/2020

Purpose:

Details:

Description:

Notes:

IMPORTANT NOTES:

Explanation:

Reference:


*/
const express = require('express');
const routerDatabaseTest = express.Router();
const database = require('../../config/database_connecter');


// // TODO: add async
// router.get('/getAllUsers',  (req, res) => {
//     // console.log("Getting all users")
//     // res.send('Getting all users');

//     // try{
//     //     let [r, fields] = await database.query("SELECT * FROM users;")
//     //     console.log(r)
//     //     res.send(r)
//     // }
//     // catch(err){
//     //     console.log(err)    
//     //     res.send(err)
//     // }

//     database.query("SELECT * FROM users;")
//     .then(([r,fields])=>{
//         console.log(r)
//         res.send(r)
//     })

// });

routerDatabaseTest.get('/getAllUsers', getAllUsers);

function getAllUsers(req, res) {
    database.query("SELECT * FROM users;")
        .then(([result, fields]) => {
            console.log(result)
            res.send(result)
        })
}
routerDatabaseTest.get('/getAllPosts', getAllPosts);

function getAllPosts(req, res) {
    database.query("SELECT * FROM posts;")
        .then(([result, fields]) => {
            console.log(result)
            res.send(result)
        })
}

routerDatabaseTest.get('/getAllComments', getAllComments);

function getAllComments(req, res) {
    database.query("SELECT * FROM comments;")
        .then(([result, fields]) => {
            console.log(result)
            res.send(result)
        })
}
module.exports = routerDatabaseTest;