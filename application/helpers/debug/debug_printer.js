/* 
Created by Joseph Edradan
Github: https://github.com/josephedradan

Date created: 

Purpose:
    Custom printer for console logging

Details:

Description:

Notes:
    Dumb note:
        Must use 
            typeof message === "string"
        Rather than
            message instanceof String

        because javascript is dumb

        Reference:
            https://stackoverflow.com/questions/203739/why-does-instanceof-return-false-for-some-literals

IMPORTANT NOTES:

Explanation:

Reference:

*/

/* 
Requires the colors module

Reference:
    https://www.npmjs.com/package/colors

*/
const colors = require('colors');
const e = require('express');

// Getting the time
const moment = require('moment');

// Color objects
colors.setTheme({
    error: ['white', 'bgRed'],
    success: ['white', 'bgGreen'],
    request: ['white', 'bgBlack'],
    debug: ['white', 'bgBlue'],
    middleware: ['white', 'bgMagenta', 'bold'],
    routerPrint: ["white", "bgBrightBlue"]
})

// A Debug printer for the Debug printers
function wrapperPrinter(functionGiven) {

    return (...args) => {

        args.forEach((item) => {
            // console.log(typeof item);
            // console.log(item);

        });

        return functionGiven(...args);
    }
}


// Custom printer for errors
const debugPrinter = {
    errorPrint: wrapperPrinter((message) => {

        if (typeof message === "string") {
            // Console log message with custom color
            console.log(colors.error(`${moment().format()} ${message}`));
        } else {
            console.log(colors.error(`${moment().format()}`));
            console.log(colors.error(message));
        }
    }),
    successPrint: wrapperPrinter((message) => {

        if (typeof message === "string") {
            // Console log message with custom color
            console.log(colors.success(`${moment().format()} ${message}`));
        } else {
            console.log(colors.success(`${moment().format()}`));
            console.log(colors.success(message));
        }

    }),
    requestPrint: wrapperPrinter((message) => {

        if (typeof message === "string") {
            // Console log message with custom color
            console.log(colors.request(`${moment().format()} ${message}`));
        } else {
            console.log(colors.request(`${moment().format()}`));
            console.log(colors.request(message));
        }

    }),
    debugPrint: wrapperPrinter((message) => {

        if (typeof message === "string") {
            // Console log message with custom color
            console.log(colors.debug(`${moment().format()} ${message}`));
        } else {
            console.log(colors.debug(`${moment().format()}`));
            console.log(colors.debug(message));
        }

    }),
    middlewarePrint: wrapperPrinter((message) => {

        if (typeof message === "string") {
            // Console log message with custom color
            console.log(colors.middleware(`${moment().format()} Middleware: ${message}`));
        } else {
            console.log(colors.middleware(`${moment().format()}`));
            console.log(colors.middleware(message));
        }

    }),
    routerPrint: wrapperPrinter((message) => {

        if (typeof message === "string") {
            // Console log message with custom color
            console.log(colors.routerPrint(`${moment().format()} Route Function: ${message}`));
        } else {
            console.log(colors.routerPrint(`${moment().format()}`));
            console.log(colors.routerPrint(message));
        }

    })
}

// Export const printers
module.exports = debugPrinter;