 /* 
Created by Joseph Edradan
Github: https://github.com/josephedradan

Date created: 

Purpose:
    Some helper to check if its keys are empty, i forgot what this file is used for
Details:

Description:

Notes:

IMPORTANT NOTES:

Explanation:

Reference:
    Getting Unexpected Token Export
        https://stackoverflow.com/questions/38296667/getting-unexpected-token-export

    Nodejs - how group and export multiple functions in a separate file?
        https://stackoverflow.com/questions/45781063/nodejs-how-group-and-export-multiple-functions-in-a-separate-file

*/

// Debugging printer
const debugPrinter = require('../debug/debug_printer');


function emptyObject(object){
    // debugPrinter.printDebug(object);
    // debugPrinter.printDebug(typeof object);
    return !(object.constructor === Object && Object.keys(object).length == 0);
};


module.exports = {emptyObject}