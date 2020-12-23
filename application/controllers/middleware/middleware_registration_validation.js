/* 
Created by Joseph Edradan
Github: https://github.com/josephedradan

Date created: 12/22/2020

Purpose:
  Validates registration on the server side

Details:

Description:

Notes:
    This is literally the stuff from registration.js

IMPORTANT NOTES:

Explanation:

Reference:

TODO:
    USE PROMISES!

*/

// Username Regex patterns
const REGEX_STARTS_WITH_LETTER = /^[a-zA-Z]/;
const REGEX_AT_LEAST_3_ALPHANUMERIC = /^[a-zA-Z0-9]{3,}/;

// Password Regex patterns
const REGEX_AT_LEAST_8_CHARACTERS = /^[a-zA-Z0-9\/*-+!@#$^&*]{8,}$/;
const REGEX_AT_LEAST_1_UPPER = /^(?=.*[A-Z]).+$/
// Alternatively you can use 0-9
const REGEX_AT_LEAST_1_NUMBER = /^(?=.*[\d]).+$/
const REGEX_AT_LEAST_1_SPECIAL_CHARACTER = /^(?=.*[\/*-+!@#$^&*]).+$/

// begin with Character (upper or lower), at least 3 alphanumeric
const REGEX_USERNAME = /^(?=[a-zA-Z])[a-zA-Z0-9]{3,}$/

// at least 8 Character, at least 1 Upper, at least 1 lower, at least 1 Number, 1 special char ( / * - + ! @ # $ ^ & * )
const REGEX_PASSWORD_EXPLICIT = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\/*-+!@#$^&*])[a-zA-Z0-9\/*-+!@#$^&*]{8,}$/

// at least 8 Character, at least 1 Upper, at least 1 Number, 1 special char ( / * - + ! @ # $ ^ & * )
const REGEX_PASSWORD = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[\/*-+!@#$^&*])[a-zA-Z0-9\/*-+!@#$^&*]{8,}$/


// Debugging printer
const debugPrinter = require("../helpers/debug/debug_printer");

// Custom user error class
const UserError = require("../helpers/error/user_error");


function validateUsername(usernameGiven) {
    let valid_username = true;

    // Begin with letter
    if (usernameGiven.match(REGEX_STARTS_WITH_LETTER)) {
    } else {
        valid_username = false;
    }

    // At least 3 alphanumeric
    if (usernameGiven.match(REGEX_AT_LEAST_3_ALPHANUMERIC)) {

    } else {
        valid_username = false;
    }

    return valid_username;
}

function validatePassword(passwordGiven) {
    let valid_password = true;


    // 8 ore more characters
    if (passwordGiven.match(REGEX_AT_LEAST_8_CHARACTERS)) {

    } else {

        valid_password = false;
    }
    // at least 1 upper
    if (passwordGiven.match(REGEX_AT_LEAST_1_UPPER)) {

    } else {

        valid_password = false;
    }

    // at least 1 number
    if (passwordGiven.match(REGEX_AT_LEAST_1_NUMBER)) {

    } else {

        valid_password = false;
    }

    // at least 1 special character
    if (passwordGiven.match(REGEX_AT_LEAST_1_SPECIAL_CHARACTER)) {

    } else {

        valid_password = false;
    }

    return valid_password;
}

function validatePasswordConfirmed(passwordGiven, passwordConfirmedGiven) {
    let valid_password = true;

    // Match passwords
    if (passwordGiven === passwordConfirmedGiven) {


    } else {

        valid_password = false;
    }

    return valid_password;
}

async function middlewareValidateRegistration (req, res, next) {

    // Get useful data from the post request using meaningful names
    let username = req.body["username"];
    let email = req.body["email"];
    let password1 = req.body["password-1"];
    let password2 = req.body["password-1"];
    let checkAge = req.body["checkbox-age"];
    let checkTOS = req.body["checkbox-tos"];

    if (validateUsername(username)){

    } else{
        throw new UserError(
            400,
            `Invalid username: ${username}`,
            "/registration",
        );
    }
    if (validatePassword(password1)){

    } else{
        throw new UserError(
            400,
            `Invalid password: ${password1}`,
            "/registration",
        );
    }
    if (validatePasswordConfirmed(password1, password2)){

    } else{
        throw new UserError(
            400,
            `Invalid passwords: ${password1} and ${password2}`,
            "/registration",
        );
    }

    if(checkAge != "13+"){
        throw new UserError(
            400,
            `User is not 13+`,
            "/registration",
        );
    }
    if(checkTOS != "tos"){
        throw new UserError(
            400,
            `User did not agree to tos`,
            "/registration",
        );
    }

    next();
}

module.exports = middlewareValidateRegistration;
