/* 
Created by Joseph Edradan
Github: https://github.com/josephedradan

Date created: 

Purpose:
    Custom printer for console logging

Details:

Description:

Notes:

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

// Getting the time
const moment = require('moment');

// Color objects
colors.setTheme({
    error: ['white', 'bgRed'],
    success: ['white', 'bgGreen'],
    request: ['white', 'bgBlack'],
    debug: ['white', 'bgBlue'],
    middleware:['white','bgMagenta','bold'],
    // routerPrint:["white", "bgBrightBlue"]
})

// Custom printer for errors
const printers = {
    errorPrint: (message) => {

        // Console log message with custom color
        console.log(colors.error(`${moment().format()} ` + message));
    },
    successPrint: (message) => {

        // Console log message with custom color
        console.log(colors.success(`${moment().format()} ` + message));
    },
    requestPrint: (message) => {

        // Console log message with custom color
        console.log(colors.request(`${moment().format()} ` + message));
    },
    debugPrint: (message) => {

        // Console log message with custom color
        console.log(colors.debug(`${moment().format()} ` + message));
    },
    middlewarePrint: (message) => {

        // Console log message with custom color
        console.log(colors.middleware(`${moment().format()} Middleware: ` + message));
    },
    // routerPrint: (message) => {

    //     // Console log message with custom color
    //     console.log(colors.middleware(`${moment().format()} ` + message));
    // }
}

// Export const printers
module.exports = printers;