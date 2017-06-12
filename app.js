var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session')
var mongoose = require('mongoose');
var configuration = require('./configuration.js')
var app = express();
var randtoken = require('rand-token');

var User = require('./db/user');
var Activity = require('./db/activity');
var UserActivity = require('./db/user_activity');
var UserActivityHistory = require('./db/user_activity_history');

var utils = require('./db/utils')

var sessionHash = {};


// Setup Mongoose and Schemas

mongoose.connect(configuration.database_url)
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;



// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret:"secret",
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge: 1000000},
}))


// status_code 304 --> 200.
app.disable('etag');



// Checks session. If not authenticated, redirect to /login
app.all('*',function(req,res,next){

    if(req.url === '/login' || req.url === '/signup' || req.url === '/email'){
        return next()
    }else{
        if(sessionHash[req.session.token]){
            next();
        }else{
            res.redirect('/login');
        }
    }
});


app.get('/login',function(req,res){
    //res.sendFile(path.join(__dirname+'/views/login.html'));
    if(sessionHash[req.session.token]){
        res.redirect('/');
    }else{
        res.render('login');
    }
})


app.post('/logout',function(req,res,next){
    sessionHash[req.session.token]=null;
    req.session.token=null;
    res.send(JSON.stringify({redirect:"http://localhost:3000/login"}))

})


app.post('/signup',function(req,res,next){

    user = User.create_user_instance(req.body.username,req.body.password,req.body.name,req.body.lastname, req.body.role, req.body.email)
    utils.insert_instance(user,function(){
        res.redirect('/login');
    });

})

app.post('/email',function(req,res,next){
    console.log("Send email verification to: " + req.body.email)
    res.send(JSON.stringify({redirect:"http://localhost:3000/login"}))

})


app.get('/', function(req, res, next) {
    res.render('index');
});


app.post('/login',function(req,res,next){

    User.authenticate_user(req.body.username, req.body.password, function(auth){
        if(auth){
            var token= randtoken.generate(32)
            req.session.token = token;
            sessionHash[token] = doc._id.toString();
            //res.statusCode="302";
            //console.log("redirecting..")
            res.send(JSON.stringify({authenticate:true}));
        }else{
            res.send(JSON.stringify({authenticate:false}))
        }
    })

});



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
