/* 
Created by Joseph Edradan
Github: https://github.com/josephedradan

Date created: 

Purpose:

Details:

Description:

Notes:

IMPORTANT NOTES:

Explanation:

Reference:
*/
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const handlebars = require("express-handlebars");
const debugPrinter = require('./helpers/debug/debugPrinters');

// From routes/index.js 
const indexRouter = require('./routes/index');

// From users/users.js
const usersRouter = require('./routes/users');

// Express object
var app = express();

/* 
app.get()
app.post()
app.put()
app.delete()
*/

app.engine(
    "hbs",
    handlebars({
        // Dir for layout
        layoutsDir: path.join(__dirname, "views/layouts"),

        // Default layout hbs based on layoutsDir
        defaultLayout: "base",

        // Dir for layouts/partials
        partialsDir: path.join(__dirname, "views/layouts/partials"),

        // Extension for handlebars
        extname: ".hbs",

        // Helper functions for you
        helpers: {
            /**
             *
             *
             renderLink: () => {
             },
             *
             */
        },
    })
);

// Unmounted middleware 
app.set("view engine", "hbs");
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Unmounted middleware user defined
app.use((req, res, next) => {
    debugPrinter.requestPrint(req.url);
    next();
});

// Mounted middleware
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Error middleware
app.use((err, req, res, next) => {
    debugPrinter.errorPrint(err);
    res.render('error', { err_message: err })
});
// Export
module.exports = app;
