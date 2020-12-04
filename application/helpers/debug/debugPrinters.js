// Requires the colors module
const colors = require('colors');

// Color objects
colors.setTheme({
    error: ['black', 'bgRed'],
    success: ['black', 'bgGreen'],
    request: ['black', 'bgWhite'],
})

// Custom printer for errors
const printers = {
    errorPrint: (message) => {
        console.log(colors.error(message));
    },
    successPrint: (message) => {
        console.log(colors.success(message));
    },
    requestPrint: (message) => {
        console.log(colors.request(message));
    }
}

module.exports = printers;