var userUsername = document.getElementById("registration-username");
var userUsernameValidation = document.getElementById("registration-username-validation");

var userEmail = document.getElementById("registration-email");
var userEmailValidation = document.getElementById("registration-email-validation");

var userPassword = document.getElementById("registration-password-1");
var userPasswordValidation = document.getElementById("registration-password-validation");

var userPasswordConfirmed = document.getElementById("registration-password-2");
var userPasswordConfirmedValidation = document.getElementById("registration-password-confirmed-validation");

var userForm = document.getElementById("userForm");

// TODO: make these upper case constant names
// Username Regex patterns
const regex_starts_with_letter = /^[a-zA-Z]/;
const regex_at_least_3_alphanumeric = /^[a-zA-Z0-9]{3,}/;

// Password Regex patterns
const regex_at_least_8_characters = /^[a-zA-Z0-9\/*-+!@#$^&*]{8,}$/;
const regex_at_least_1_upper = /^(?=.*[A-Z]).+$/
// Alternatively you can use 0-9
const regex_at_least_1_number = /^(?=.*[\d]).+$/
const regex_at_least_1_special_character = /^(?=.*[\/*-+!@#$^&*]).+$/

// begin with Character (upper or lower), at least 3 alphanumeric
const regex_username = /^(?=[a-zA-Z])[a-zA-Z0-9]{3,}$/

// at least 8 Character, at least 1 Upper, at least 1 lower, at least 1 Number, 1 special char ( / * - + ! @ # $ ^ & * )
const regex_password_explicit = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\/*-+!@#$^&*])[a-zA-Z0-9\/*-+!@#$^&*]{8,}$/

// at least 8 Character, at least 1 Upper, at least 1 Number, 1 special char ( / * - + ! @ # $ ^ & * )
const regex_password = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[\/*-+!@#$^&*])[a-zA-Z0-9\/*-+!@#$^&*]{8,}$/

function validateUsername(usernameGiven) {
    let valid_username = true;

    let begins_with_letter = document.getElementById("begins-with-character");
    let at_least_3_alphanumeric = document.getElementById("at-least-3-alphanumeric");

    // Begin with letter
    if (usernameGiven.match(regex_starts_with_letter)) {
        begins_with_letter.innerHTML = "✓ Username begins with a letter";
        begins_with_letter.style.color = "#03FE25";
    } else {
        begins_with_letter.innerHTML = "✕ Username begins with a letter";
        begins_with_letter.style.color = "red";
        valid_username = false;
    }

    // At least 3 alphanumeric
    if (usernameGiven.match(regex_at_least_3_alphanumeric)) {
        at_least_3_alphanumeric.innerHTML = "✓ Username has at least 3 alphanumeric characters";
        at_least_3_alphanumeric.style.color = "#03FE25";
    } else {
        at_least_3_alphanumeric.innerHTML = "✕ Username has at least 3 alphanumeric characters";
        at_least_3_alphanumeric.style.color = "red";
        valid_username = false;
    }

    // console.log("Username valid")
    // console.log(valid_username);
    return valid_username;
}

// On username change
userUsername.onchange = () => {
    validateUsername(userUsername.value);
}

function validatePassword(passwordGiven) {
    let valid_password = true;

    let at_least_8_or_more_characters = document.getElementById("at-least-8-or-more-characters");
    let at_least_1_upper = document.getElementById("at-least-1-upper");
    let at_least_1_number = document.getElementById("at-least-1-number");
    let at_least_1_special_character = document.getElementById("at-least-1-special-character");

    // 8 ore more characters
    if (passwordGiven.match(regex_at_least_8_characters)) {
        at_least_8_or_more_characters.innerHTML = "✓ Password has at least 8 characters";
        at_least_8_or_more_characters.style.color = "#03FE25";
    } else {
        at_least_8_or_more_characters.innerHTML = "✕ Password has at least 8 characters";
        at_least_8_or_more_characters.style.color = "red";
        valid_password = false;
    }
    // at least 1 upper
    if (passwordGiven.match(regex_at_least_1_upper)) {
        at_least_1_upper.innerHTML = "✓ Password has at least 1 upper letter";
        at_least_1_upper.style.color = "#03FE25";
    } else {
        at_least_1_upper.innerHTML = "✕ Password has at least 1 upper letter";
        at_least_1_upper.style.color = "red";
        valid_password = false;
    }

    // at least 1 number
    if (passwordGiven.match(regex_at_least_1_number)) {
        at_least_1_number.innerHTML = "✓ Password has at least 1 number";
        at_least_1_number.style.color = "#03FE25";
    } else {
        at_least_1_number.innerHTML = "✕ Password has at least 1 number";
        at_least_1_number.style.color = "red";
        valid_password = false;
    }

    // at least 1 special character
    if (passwordGiven.match(regex_at_least_1_special_character)) {
        at_least_1_special_character.innerHTML = "✓ Password has at least 1 special character";
        at_least_1_special_character.style.color = "#03FE25";
    } else {
        at_least_1_special_character.innerHTML = "✕ Password has at least 1 special character";
        at_least_1_special_character.style.color = "red";
        valid_password = false;
    }

    // console.log("Password valid")
    // console.log(valid_password);
    return valid_password;
}

// On password change
userPassword.onchange = () => {
    validatePassword(userPassword.value);
    validatePasswordConfirmed(userPassword.value, userPasswordConfirmed.value);
}

function validatePasswordConfirmed(passwordGiven, passwordConfirmedGiven) {
    let valid_password = true;

    let matching_password = document.getElementById("matching-password");

    // console.log(passwordGiven);
    // console.log(passwordConfirmedGiven);

    // Match passwords
    if (passwordGiven === passwordConfirmedGiven) {
        matching_password.innerHTML = "✓ Password matches";
        matching_password.style.color = "#03FE25";

    } else {
        matching_password.innerHTML = "✕ Password matches";
        matching_password.style.color = "red";
        valid_password = false;
    }

    // console.log("Password valid")
    // console.log(valid_password);
    return valid_password;
}

// On password confirmed
userPasswordConfirmed.onchange = () => {
    validatePasswordConfirmed(userPassword.value, userPasswordConfirmed.value);
}

userForm.addEventListener('submit', (event) => {

    if (validatePassword(userPassword.value) == true &&
        validatePasswordConfirmed(userPassword.value, userPasswordConfirmed.value) &&
        validateUsername(userUsername.value)
    ) {
        console.log("Valid Form")
    } else {
        event.preventDefault();
        console.log("Invalid Form")
    }  
});