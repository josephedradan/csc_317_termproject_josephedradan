/* 
Created by Joseph Edradan
Github: https://github.com/josephedradan

Date created: 

Purpose:

Details:

Description:

Notes:
    res.locals 
        lasts whiles it's being generated and sent back
    
    app.locals
        last entirety of program

    res.send(data)
        send content back to use
    
    res.end()
        no type header
    
    res.sendFile("./path" err => function)
        send back file
    
    res.json(jsonData)
        send back json
    
    res.redirect(http code, ./path )
        redirect
    
    res.format(...)
        return different types of content

    res.links(data)
        add link tags for other urls, send it in the header not the html
    
    res.render("view", locals, callback )
        uses template and uses view engine and the folder for the views
    
    res.set(data)
        set header
    
    res.append(data)
        add additional headers

    res.cookie(data ...)
        send cookie
    
    res.status(status).end()
        sending status

    res.type()
        send back response type

    res.attachment(file)
        sets content disposition header, file that the user will see
    
    res.endFile(file, callback)
        send file?

    res.download(path,name, callback)
        ask user to download file

IMPORTANT NOTES:

Explanation:

Reference:
    Express JS - Sending Headers, Content, Attachments and Statuses
        https://www.youtube.com/watch?v=w02YRfpYnS0

    Express JS - Settings, Variables & Locals
        https://www.youtube.com/watch?v=G6pmkVI2EKM
*/
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const loggerMorgan = require('morgan');
const expressHandlebars = require("express-handlebars");
const expressSessions = require('express-session');
const MySQLSession = require('express-mysql-session')(expressSessions);


// Custom printer
const debugPrinter = require('./helpers/debug/debug_printer');

// From routes/index.js 
const indexRouter = require('./routes/index');

// From users/users.js
const usersRouter = require('./routes/users');

// Db testing
const databaseRouter = require('./routes/database_test');

// Express object
const app = express();

// const SESSION_MAX_TIME = 1000 * 60 * 60 * 2

/* 
app.get()
app.post()
app.put()
app.delete()
*/


/* 
Set engine and set static folder for handlebars directory

*/
app.engine(
    "hbs",
    expressHandlebars({
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


const mySQLSessionStore = new MySQLSession(
    {
        /* Using default options */
    },
    require("./config/database_connecter")
);



/* 
*** Unmounted middleware ***

Reference:
    Express JS - Settings, Variables & Locals
        https://www.youtube.com/watch?v=G6pmkVI2EKM

*/
app.set("view engine", "hbs"); // app.locals.settings["view engine"]
app.use(loggerMorgan('dev'));
app.use(express.json()); // Parse response
app.use(express.urlencoded({ extended: false })); // Parse response
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* 
Unmounted middleware user defined

Notes:

*/
// Print information about the request
app.use((req, res, next) => {
    debugPrinter.middlewarePrint("Request Information");

    // print request method
    // debugPrinter.requestPrint(req.method);

    // print request url
    // debugPrinter.requestPrint(req.url);

    // Debug print method and url
    debugPrinter.requestPrint(`${req.method}: ${req.url}`)

    // Call next middleware
    next();
});




/* 
Express-sessions

Reference:
    https://www.youtube.com/watch?v=OH6Z0dJ_Huk
*/
app.use(expressSessions(
    {
        // Key used in the from end
        key: "csid",

        // Sign the cookie
        secret: "nice secrete",

        // Select a session store
        store: mySQLSessionStore,

        // Don't save when nothing is changed
        resave: false,

        // Don't save an empty value in this session
        saveUninitialized: false,

        cookoie: {
            sameSite: true,
            secure: true,
        }
    }
))

// Must be below expressSessions
app.use((req, res, next) => {
    debugPrinter.middlewarePrint("Express Session");
    // debugPrinter.debugPrint(req.session);

    // If session.session_username exists
    if (req.session.session_username) {
        res.locals.session_logged = true;
        res.locals.session_username = req.session.session_username;

    }
    next();
})
/* 
*** Mounted middleware ***

Notes:
    Format (URL, Router module

*/
app.use('/', indexRouter); // app.locals.settings["/"]
// app.use('/databaseTest', databaseRouter); // app.locals.settings["/databaseTest"]
app.use('/users', usersRouter); // app.locals.settings["/users"]


/* 
*** Error Handling Middleware ***

Notes:
    If an error is caught, then this is called.

*/
app.use((err, req, res, next) => {
    debugPrinter.middlewarePrint("Error");

    // Use the debugPrinter's errorPrint function to print message to console
    debugPrinter.errorPrint(err);

    // Render error page with error message
    // TODO: error.hbs does not exist so you will get another error
    // res.render('error', { err_message: err })
});


// Export app
module.exports = app;
