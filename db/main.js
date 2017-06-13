const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;
const conf = require('./../configuration');
const models = require('./models');
const utils = require('./utils');
const user_functions = require('./user');
const activity_functions = require('./activity');
const user_activity_functions = require('./user_activity');
const user_activity_history_functions = require('./user_activity_history');
//const scheduler = require('./scheduler');

// Connects to database
mongoose.connect(conf.database_url);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
// On open the function gets executed 
db.once('open', function(){

	//utils.insert_instance(create_user_instance('lui','lui','sagfsa','sdgsd','asfos','asgfs',100));
	//utils.insert_instance(create_user_instance('CHE','sgsd','sagfsa','sdgsd','asfos','asgfs',130));
	//utils.insert_instance(create_activity_instance('aisognj',200, 30, 'sagfsa',3523,2235,['asgfs'],'sagfsa'));
/*	user_activity_functions.add_user_to_activity_permanently(new ObjectId("593dbb1aa06aeb2ba0d7a061"), new ObjectId("593dbb1aa06aeb2ba0d7a063"), 200);
	user_activity_functions.add_user_to_activity_once(new ObjectId("593dbb1aa06aeb2ba0d7a061"), new ObjectId("593dbb1aa06aeb2ba0d7a063"), new Date(), new Date(), 30);
//	user_activity_functions.add_user_to_activity_once(new ObjectId("593dbb1aa06aeb2ba0d7a062"), new ObjectId("593dbb1aa06aeb2ba0d7a063"), new Date(), new Date(), 30);
//	one_time_executions.update_money_for_one_time_activities(current_timestamp, end_of_the_day_timestamp);	
/*	user_activity_history_functions.get_all_activities_by_user_in_timeframe(new ObjectId("593d9308bec1e506a425e94b"), current_timestamp, end_of_the_day_timestamp, function(users){
		console.log(users);
	});*/

//	scheduler.update_money_for_one_time_activities(0, + new Date());
	
});