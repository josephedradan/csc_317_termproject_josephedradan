/* 
Created by Joseph Edradan
Github: https://github.com/josephedradan

Date created: 

Purpose:
  Handle urls relevant to the user
Details:

Description:

Notes:

IMPORTANT NOTES:

Explanation:

Reference:

*/
const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");

// Data base connecter
const databaseConnector = require('../config/database_connecter');

// Debugging printer
const debugPrinter = require('../helpers/debug/debug_printer');

// Custom user error class
const UserError = require('../helpers/error/user_error');


/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});


// Handle registration posting
router.post('/register', async (req, res, next) => {
  // req Comes with a bunch of garbage
  // Body of the POST
  debugPrinter.debugPrint(req.body);


  let username = req.body["username"];
  let email = req.body["email"];
  let password1 = req.body["password-1"];
  let password2 = req.body["password-1"];
  let checkAge = req.body["checkbox-age"];
  let checkTOS = req.body["checkbox-tos"];

  // console.log(password);

  /* 
    // Check if username exists in database
    database.execute(
      "SELECT * FROM users WHERE users_username=?",
      [username]
    ).then(([resultsUsername, fields]) => {
  
  
      console.log(typeof(resultsUsername));
      console.log(Array.isArray(resultsUsername))
      console.log(resultsUsername);
      console.log(!Array.isArray(resultsUsername));
      console.log(!resultsUsername.length);
  
      // If username exists and data does exist
      if ( resultsUsername && resultsUsername.length) {
        console.log(`Username ${username} already exists`);  // TODO: USE THE COLOR PRINTER
        res.status(500).redirect("/registration");
        throw new UserError(
          "Registration Failed: Username already exists",
          "/registration",
          200
        );
      }
      // HANGING 
      return
    });
  
    // Check if email exists in database
    database.execute(
      "SELECT * FROM users WHERE users_email=?",
      [email]
    ).then(([resultsEmail, fields]) => {
  
      console.log(resultsEmail);
  
      // If username exists and data does exist
      if (resultsEmail.length) {
        console.log(`Email ${Email} is already in use!`); // TODO: USE THE COLOR PRINTER
        res.status(500).redirect("/registration");
        throw new UserError(
          "Registration Failed: Email is already in use!",
          "/registration",
          200
        );
      }
      return
    });
   */


  // let active = 1;

  // Query insert
  let baseSQlQueryInsert = "INSERT INTO users (`users_username`, `users_email`, `users_password`, `users_created`) VALUES (?, ?, ?, now());";

  try {

    // Check if the Username already exists
    let [resultsUsername, fields] = await databaseConnector.execute(
      "SELECT * FROM users WHERE users_username=?",
      [username]
    );

    // Check if the Email already exists
    let [resultsEmail, fields2] = await databaseConnector.execute(
      "SELECT * FROM users WHERE users_email=?",
      [email]
    );

    // Check username exists in database then it's length
    if (resultsUsername && resultsUsername.length) {
      debugPrinter.errorPrint(`Username: ${username} already exists!`);
      res.status(500).redirect("/registration");
      throw new UserError(
        "Registration Failed: Username already exists",
        "/registration",
        200
      );

    };

    // Check Email exist in database then it's length
    if (resultsEmail && resultsEmail.length) {
      debugPrinter.errorPrint(`Email: ${email} already exists!`);
      res.status(500).redirect("/registration");
      throw new UserError(
        "Registration Failed: Email is already in use!",
        "/registration",
        200
      );
    };

    // Hash password
    passwordHashed = await bcrypt.hash(password1, 10);

    // TODO: MAKE A WRAPPER/FUNCTION TYPE FOR HANDLING QUERIES
    debugPrinter.successPrint("Executing Registration Query");
    databaseConnector.execute(baseSQlQueryInsert, [username, email, passwordHashed]);
    debugPrinter.successPrint(`Query Successful`);

    // Redirect user to the login page
    res.redirect("/login");


  }
  // Catch errors
  catch (err) {
    // Print error caught in /registration
    debugPrinter.errorPrint("Error caught in router.post(\"/registration\", ...");

    // Catch UserError
    if (err instanceof UserError) {
      debugPrinter.errorPrint(err.getMessage());
      res.status(err.getStatus());
      res.redirect(err.getRedirectURL());
      
    } 
    // Catch all other errors
    else {
      debugPrinter.errorPrint(`${err}`);

      // Call middleware error handler 
      next(err);
    }
  }
});

// Handle /login
router.post("/login", async (req, res, next) => {


  // Get both username and passowrd
  let username = req.body["username"];
  let password = req.body["password"];

  // Base SQL query to get the username
  let baseSQLQuery = "SELECT users_id, users_username, users_password FROM users WHERE users_username=?;";

  try {

    // Get data from database via username
    let [resultUserData, fields] = await databaseConnector.execute(baseSQLQuery, [username]);

    // resultUserData Exists and resultUserData.length Exists 
    if (resultUserData && resultUserData.length) {

      // Get the first instance of the user (there should only be 1)
      let resultUserDataFirst = resultUserData[0];


      if (length(resultUserData) > 1){
        throw new Error(`There is more than 1 user with the same Username as: ${username}`);
      }

      // Debug print resultUserDataFirst 
      debugPrinter.debugPrint(resultUserDataFirst);

      let db_id = resultUserDataFirst["users_id"];
      let db_username = resultUserDataFirst["users_username"];
      let db_password_hashed = resultUserDataFirst["users_password"];

      // Hash password here because it's costly to do a hash when you need to know the username first
      let check = await bcrypt.compare(password, db_password_hashed);

      if (check) {
        // res.cookie("logged", username, { domain });

        console.log(typeof (resultUserDataFirst))

        for (const [key, value] of Object.entries(resultUserDataFirst)) {
          debugPrinter.debugPrint(`${key}: ${value}`);
        }


        // Old style
        // res.cookie("logged", db_username, {
        //   expires: new Date(Date.now() + 900000),
        //   // httpOnly: true,
        // });

        // Old won't work with redirect (Didn't work to begin with)
        // res.locals.logged = true;

        // Set user as logged in

        req.session.session_username = db_username;
        req.session.session_user_id = db_id;

        debugPrinter.successPrint(`User ${db_username} has logged in`);

        // Redirect to home
        res.redirect("/");

        debugPrinter.debugPrint("Stuff happens after?");

      } else {

        // Redirect to login When invalid user entry
        throw new UserError("Invalid username and/or password", "/login", 200);
        // res.redirect("/login");

      }
    }


    // Account does not exist
    else {

      // Redirect to login When invalid user entry
      throw new UserError("Invalid username and/or password", "/login", 200);
      // res.redirect("/login");

    }
  } catch (err) {
    debugPrinter.errorPrint("Error caught in router.post(\"/login\", ...");

    // Catch UserError
    if (err instanceof UserError) {
      debugPrinter.errorPrint(err.getMessage());
      res.status(err.getStatus());
      res.redirect(err.getRedirectURL());

    } else {
      debugPrinter.errorPrint(`${err}`);
      next(err);
    }
  }
  // res.send(req.body);
});




// router.post('/register', (req, res, next) => {
//   res.send('respond with a resource');
// })

module.exports = router;
