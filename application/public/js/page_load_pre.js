/* 
Created by Joseph Edradan
Github: https://github.com/josephedradan

Date created: 12/9/2020

Purpose:
    Handles js related to the page being initially loaded

Details:

Description:

Notes:

IMPORTANT NOTES:

Explanation:

Reference:


*/
// Uncomment this if you want the hinting for axios (This should be uncommented for the developer)
// const axios = require('axios');

function fadeThenDeleteElementByID(elementId, delay = 2000, speed = 100, step = 0.1) {
    /* 
    Fade an element given the element id.
    This was originally made to handle flash js messages but I disabled flash js...


    */
    let element = document.getElementById(elementId);

    let fadeElement = () => {
        if (!element.style.opacity) {
            element.style.opacity = 1;
        }
        if (element.style.opacity > 0) {
            element.style.opacity -= step;
        } else {
            clearInterval(element);
            element.remove();
        };
    };

    let fader = () => {
        setInterval(fadeElement, speed);
    }

    setTimeout(fader, delay);
}

function fadeThenHideElementByID(elementId, delay = 2000, speed = 100, step = 0.1) {
    /* 
    Fade an element given the element id.
    This was originally made to handle flash js messages but I disabled flash js...

    Reference:
        https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_toggle_hide_show
    */
    let element = document.getElementById(elementId);

    if (element.style.display ==="none"){
        element.style.display = "block";
    }

    let fadeElement = () => {
        if (!element.style.opacity) {
            element.style.opacity = 1;
        }
        if (element.style.opacity > 0) {
            element.style.opacity -= step;
        } else {
            clearInterval(element);
            element.style.display ="none";
        };
    };

    let fader = () => {
        setInterval(fadeElement, speed);
    }

    setTimeout(fader, delay);
}



function runPageLoadPre() {
    /*
    There is nothing here...
    */
}

runPageLoadPre();