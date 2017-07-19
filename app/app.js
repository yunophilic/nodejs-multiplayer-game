//obtain tools
var express = require('express');
var expressLayouts = require('express-ejs-layouts');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var csrf = require('csurf');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');

//db setup
var dbConfig = require('./config/db');
mongoose.connect(dbConfig.url);

//passport setup
var passportConfig = require('./config/passport');
passportConfig(passport); // pass passport for configuration

//routes
var home = require('./routes/home')(passport);
var chat = require('./routes/chat');

//models
var user = require('./models/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
app.use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));



//authentation setup
app.use(morgan('dev')); // log every request to the console
app.use(session({ secret: 'secret' })); // session secret - need to modify it later
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
/*require('./app/auth.js')(app, passport);*/ // load our routes and pass in our app and fully configured passport


// csrf setup
app.use(csrf({ cookie: true }));
app.use(function(req, res, next) {
	res.locals.csrfToken = req.csrfToken();
	res.locals.loggedIn = req.isAuthenticated();
	next();
});

app.use('/', home);
/*app.use('/users', users);*/
app.use('/chat', chat);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
