var schedule = require('node-schedule');
var user_functions = require('./user');
var activity_functions = require('./activity');
var user_activity_functions = require('./user_activity');
var user_activity_history_functions = require('./user_activity_history');

/*

*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    |
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)

*/
// Scheduler for everyday but the first day of every month
var scheduler1 = schedule.scheduleJob('0 0 0 2-31 * *', function(){
	start_timestamp = + new Date();
	end_timestamp = + new Date() + 24 * 60 * 60 * 1000;
	update_history_collection_with_one_time_activites(start_timestamp, end_timestamp);
	update_money_for_one_time_activities(start_timestamp, end_timestamp);
});

// Scheduler for every first day of every month
var scheduler2 = schedule.scheduleJob('0 0 0 1 * *', function(){
	start_timestamp = + new Date();
	end_timestamp = + new Date() + 24 * 60 * 60 * 1000;
	console.log("UPDATE ONE TIME ACTIVITIES 1ST DAY!");
	update_history_collection_with_one_time_activites(start_timestamp, end_timestamp);
	console.log("UPDATE PERMANENT ACTIVITIES 1ST DAY!");
	update_history_collections_with_permanent_activities();
	console.log("UPDATE MONEY 1ST DAY!");
	update_money_for_all_activities(start_timestamp, end_timestamp);
});

update_history_collection_with_one_time_activites = function(start_timestamp, end_timestamp){
	user_activity_functions.get_all_one_time_activities_in_timeframe(start_timestamp, end_timestamp, function(user_activity){
		console.log(user_activity);
		for(let i=0; i<user_activity.length; i++){
			var new_instance = {};
			new_instance.userId = user_activity[i].userId;
			new_instance.activityId = user_activity[i].activityId;
			new_instance.creditToBePaid = user_activity[i].creditToBePaid;
			new_instance.timestampIn = user_activity[i].timestampIn;
			new_instance.timestampOut = user_activity[i].timestampOut;
			user_activity_history_functions.add_user_activity_one_time_record_json(new_instance, function(inserted_successfully){
				if (inserted_successfully){
					user_activity_functions.remove_activity_by_id(user_activity[i]._id);
				}
			});
		}
	});
}

update_history_collections_with_permanent_activities = function(){
	user_activity_functions.get_all_permanent_activities(function(user_activity){
		var date = new Date();
		var year = date.getFullYear();
		var month = date.getMonth();
		for(let i=0; i<user_activity.length; i++){
			var new_instance = {};
			new_instance.userId = user_activity[i].userId;
			new_instance.activityId = user_activity[i].activityId;
			new_instance.creditToBePaid = user_activity[i].creditToBePaid;
			new_instance['month'] = month; // Starts with 0 - January
			new_instance['year'] = year;
			console.log(new_instance);
			user_activity_history_functions.add_user_activity_monthly_record_json(new_instance, function(inserted_successfully){
				if (inserted_successfully){
					user_activity_functions.remove_activity_by_id(user_activity[i]._id);					
				}
			});
		}
	});
}

// This function updates the user
update_money_for_one_time_activities = function(start_timestamp, end_timestamp){
	user_activity_functions.get_all_one_time_activities_in_timeframe(start_timestamp, end_timestamp, function(user_activity){
		var temp_user_id = -1;
		var total_amount = 0;
		for(let i=0; i<user_activity.length; i++){
			if (temp_user_id == -1){
				temp_user_id = user_activity[i].userId;
				total_amount = user_activity[i].creditToBePaid;				
			}else if (user_activity[i].userId.equals(temp_user_id)){
				total_amount = total_amount + user_activity[i].creditToBePaid;
			}else{
				user_functions.update_user_money_by_id(temp_user_id, -total_amount);
				temp_user_id = user_activity[i].userId;
				total_amount = user_activity[i].creditToBePaid;
			}
			// Last loop
			if (i == user_activity.length -1){
				user_functions.update_user_money_by_id(temp_user_id, -total_amount);
			}
		}
	});
}

// This function gets executed the first day of every month
update_money_for_all_activities = function(start_timestamp, end_timestamp){
	user_activity_functions.get_all_activities_in_timeframe(start_timestamp, end_timestamp, function(user_activity){
		var temp_user_id = -1;
		var total_amount = 0;
		for(let i=0; i<user_activity.length; i++){
			if (temp_user_id == -1){
				temp_user_id = user_activity[i].userId;
				total_amount = user_activity[i].creditToBePaid;				
			}else if (user_activity[i].userId.equals(temp_user_id)){
				total_amount = total_amount + user_activity[i].creditToBePaid;
			}else{
				user_functions.update_user_money_by_id(temp_user_id, -total_amount);
				temp_user_id = user_activity[i].userId;
				total_amount = user_activity[i].creditToBePaid;
			}
			// Last loop
			if (i == user_activity.length -1){
				user_functions.update_user_money_by_id(temp_user_id, -total_amount);
			}
		}
	});
}


/*	var exports = module.exports = {};
	exports.update_money_for_one_time_activities = update_money_for_one_time_activities;
	exports.update_money_for_all_activities = update_money_for_all_activities;
	exports.update_history_collection_with_one_time_activites = update_history_collection_with_one_time_activites;
	exports.update_history_collections_with_permanent_activities = update_history_collections_with_permanent_activities;
*/