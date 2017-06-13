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
    utils.insert_instance(user,function(err,user){
        try{
            if(err) throw err
            res.send(JSON.stringify({user:user}))
        }catch(e){
            res.send(JSON.stringify({user:{},error:e.message}))
        }


    });

})

app.put('/users/update',function(req,res,next){

    if(req.body.actualUsername){
        var user = User.create_user_instance(req.body.username,req.body.password,req.body.name,req.body.lastname,req.body.role,req.body.email,req.body.money)
        User.update_user_information(req.body.actualUsername,user,function(err, user){
            try{
                if(err) throw err
                res.send(JSON.stringify({user:user}))
            }catch(e){
                res.send(JSON.stringify({user:{},error:e.message}))
            }
        })
    }else{
        res.send(JSON.stringify({user:{},error:"Provide username"}))
    }
})


app.delete('/users/delete',function(req,res,next){
    User.remove_user(req.body.username,function(err){
        try{
            if(err) throw err
            res.send(JSON.stringify({success:true}));

        }catch(e){
            res.send(JSON.stringify({error:e.message,success:false}))
        }
    });

})


app.put('/users/update/money',function(req,res,next){
    if(req.body.username){
        try{
            User.update_user_money(req.body.actualUsername,req.body.money,function(){
                if(err) throw err
                res.send(JSON.stringify({money:req.body.money}))
            })
        }catch(e){
            res.send(JSON.stringify({money:0,error:"Provide username"}))

        }
    }else{
        res.send(JSON.stringify({money:0,error:"Provide username"}))
    }
})


app.get('/users/all',function(req,res,next){

    User.get_all_users(function(err,users){
        try{
            if(err) throw err
            res.send(JSON.stringify({users:users}))
        }catch(e){
            res.send(JSON.stringify({users:[], error:e.message}))

        }
    })

})

app.post('/login',function(req,res,next){

    User.authenticate_user(req.body.username, req.body.password, function(err,doc){
        try{
            if(err) throw err
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

        }catch(e){
            res.send(JSON.stringify({authenticate:false,error:e.message}))

        }

    })

});

app.post('/activities/create',function(req,res,next){

    Activity.create_activity_instance(req.body.name, req.body.credit, req.body.oneTimeCredit,req.body.dayOfTheWeek, req.body.hourIn, req.body.hourOut, req.body.coaches, req.body.description);
    utils.insert_instance(activity,function(err,activity){
        try{
            if(err) throw err
            res.send(JSON.stringify({activity:activity}))
        }catch(e){
            res.send(JSON.stringify({activity:{},error:e.message}))

        }

    })
})

app.get('/activities/all',function(req,res,next){
    Activity.get_all_activities(function(err,activities){
        try{
            if(err) throw err
            res.send(JSON.stringify({activities:activities}))
        }catch(e){
            res.send(JSON.stringify({activities:[],error:e.message}))
        }
    })
})

app.delete('/activities/delete',function(req,res,next){
    Activity.remove_activity(req.body.activityId,function(err){
        try{
            if(err) throw err;
            res.send(JSON.stringify({success:true}))
        }catch(e){
            res.send(JSON.stringify({error:e.message}))
        }
    });
})

app.put('/activities/update',function(req,res,next){
    if(req.body.activityId){
        var activity = Activity.create_activity_instance(req.body.name, req.body.credit, req.body.oneTimeCredit,req.body.dayOfTheWeek, req.body.hourIn,
            req.body.hourOut, req.body.coaches, req.body.description);
        Activity.update_activity(req.body.activityId,activity,function(err,doc){
            try{
                if(err) throw err;
                res.send(JSON.stringify({activity:doc}))
            }catch(e){
                res.send(JSON.stringify({error:e.message}))
            }
        })
    }else{
        res.send(JSON.stringify({activity:{},error:"Provide id"}))
    }

})

app.get('/activity/:activityId',function(req,res,next){
    Activity.get_activity_by_id(req.body.activityId,function(err,activity){
        try{
            if(err) throw err
            res.send(JSON.stringify({activity:activity}))

        }catch(e){
            res.send(JSON.stringify({error:e.message}))

        }
    })
})


app.post('/user/actvity/add',function(req,res,next){
    var userId = sessionHash[req.session.token]
    UserActivity.add_user_to_activity_permanently(userId,req.body.activityid,req.body.credits,function(err){
        try{
            if(err) throw err
            res.send(JSON.stringify({success:true}))

        }catch(e){
            res.send(JSON.stringify({error:e.message}))
        }
    })
})



app.get('/user/activities',function(req,res,next){
    UserActivity.get_all_activities_by_user(sessionHash[req.session.token],function(err,activities){
        try{
            if(err) throw err
            res.send(JSON.stringify({activities:activities}))

        }catch(e){
            res.send(JSON.stringify({error:e.message}))
        }
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
