/**
 * Module dependencies.
 */
const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const logger = require('morgan');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const path = require('path');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const sass = require('node-sass-middleware');
const browserify = require('browserify-middleware');

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({
    path: '.env'
});

/**
 * Connect to MongoDB.
 */
mongoose.connect(process.env.MONGOLAB_URI);
mongoose.connection.on('error', () => {
    console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');
    process.exit(1);
});

/**
 * Controllers (route handlers).
 */
const homeController = require('./controllers/home');

/**
 * Create Express server.
 */
const app = express();

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(compression());
app.use(sass({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public')
}));
app.get('/js/bundle.js', browserify(__dirname + '/public/js/main.js'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(expressValidator());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
        url: process.env.MONGOLAB_URI || process.env.MONGODB_URI,
        autoReconnect: true
    })
}));
app.use(flash());
app.use((req, res, next) => {
    lusca.csrf()(req, res, next);
});
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});
app.use(function(req, res, next) {
    // After successful login, redirect back to the intended page
    if (!req.user &&
        req.path !== '/login' &&
        req.path !== '/signup' &&
        !req.path.match(/^\/auth/) &&
        !req.path.match(/\./)) {
        req.session.returnTo = req.path;
    }
    next();
});
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: 31557600000
}));

/**
 * Primary app routes.
 */
app.get('/', homeController.getIndex);
app.get('/api', homeController.getApi);
app.post('/api', homeController.postApi);

/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
    console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
