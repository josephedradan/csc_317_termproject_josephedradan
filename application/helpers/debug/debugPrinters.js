// Requires the colors module
const colors = require('colors');

// Color objects
colors.setTheme({
    error: ['white', 'bgRed'],
    success: ['white', 'bgGreen'],
    request: ['white', 'bgWhite'],
})

// Custom printer for errors
const printers = {
    errorPrint: (message) => {
        
        // Console log message with custom color
        console.log(colors.error(message));
    },
    successPrint: (message) => {
        // Console log message with custom color
        console.log(colors.success(message));
    },
    requestPrint: (message) => {
        // Console log message with custom color
        console.log(colors.request(message));
    }
}

// Export const printers
module.exports = printers;