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
    console.log(req.url)
    //if(req.url === '/login' || req.url === '/signup' || req.url === '/users/update'){
    if(true){
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
    res.send(JSON.stringify({loggedout:true}))

})


app.post('/signup',function(req,res,next){

    user = User.create_user_instance(req.body.username,req.body.password,req.body.name,req.body.lastname, req.body.role, req.body.email)
    utils.insert_instance(user,function(user){
        res.send(JSON.stringify({user:user}))

    });

})

app.put('/users/update',function(req,res,next){

    if(req.body.actualUsername){
        var user = User.create_user_instance(req.body.username,req.body.password,req.body.name,req.body.lastname,req.body.role,req.body.email,req.body.money)
        User.update_user_information(req.body.actualUsername,user)
        res.send(JSON.stringify({user:user}))
    }else{
        res.send(JSON.stringify({user:{},error:"Provide username"}))
    }
})


app.delete('/users/delete',function(req,res,next){
    User.remove_user(req.body.username);
    res.send("");

})


app.put('/users/update/money',function(req,res,next){
    if(req.body.username){
        User.update_user_information(req.body.actualUsername,req.body.money)
        res.send(JSON.stringify({money:req.body.money}))
    }else{
        res.send(JSON.stringify({money:0,error:"Provide username"}))
    }
})


app.get('/users/all',function(req,res,next){
    User.get_all_users(function(users){
        res.send(JSON.stringify({users:users}))
    })

})

app.post('/login',function(req,res,next){

    User.authenticate_user(req.body.username, req.body.password, function(doc){
        if(doc.authentication){
            var token= randtoken.generate(32)
            req.session.token = token;
            sessionHash[token] = doc.user._id.toString();
            //res.statusCode="302";
            //console.log("redirecting..")
            res.send(JSON.stringify({authenticate:true}));
        }else{
            res.send(JSON.stringify({authenticate:false}))
        }
    })

});

app.post('/activities/create',function(req,res,next){

    var activity = Activity.create_activity_instance(req.body.name, req.body.credit, req.body.oneTimeCredit,req.body.dayOfTheWeek, req.body.hourIn,
        req.body.hourOut, req.body.coaches, req.body.description);
    utils.insert_instance(activity,function(){
        res.send(JSON.stringify({activity:activity}))

    })
})

app.get('/activities/all',function(req,res,next){
    Activity.get_all_activities(function(activities){
        res.send(JSON.stringify({activities:activities}))
    })
})

app.delete('/activities/delete',function(req,res,next){
    Activity.remove_activity(req.body.activityId);
    res.send("");

})

app.put('/activities/update',function(req,res,next){
    if(req.body.activityId){
        var activity = Activity.create_activity_instance(req.body.name, req.body.credit, req.body.oneTimeCredit,req.body.dayOfTheWeek, req.body.hourIn,
            req.body.hourOut, req.body.coaches, req.body.description);
        Activity.update_activity(req.body.activityId,activity)
        res.send(JSON.stringify({activity:activity}))
    }else{
        res.send(JSON.stringify({activity:{},error:"Provide id"}))
    }

})

app.get('/activity/:activityId',function(req,res,next){
    Activity.get_activity_by_id(req.body.activityId,function(activity){
        res.send(JSON.stringify({activity:activity}))
    })

})




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
    console.log(err)

    res.render('error');
});

module.exports = app;
