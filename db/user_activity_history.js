var UserActivityHistory = require('./models').UserActivityHistory;

add_user_activity_one_time_record = function(user_id, activity_id, timestampIn, timestampOut){
	var instance = new UserActivityHistory({'userId':user_id, 'activityId':activity_id, 'timestampIn':timestampIn, 'timestampOut':timestampOut});
	instance.save(function(err){
		if (err) throw err;
	})
}

add_user_activity_one_time_record_json = function(user_activity_json, callback_function){
	var instance = new UserActivityHistory(user_activity_json);
	instance.save(function(err){
		if (err) throw err;
		callback_function(true);
	})
}

add_user_activity_monthly_record = function(user_id, activity_id, year, month){
	var instance = new UserActivityHistory({'userId':user_id, 'activityId':activity_id, 'year':year, 'month':month});
	instance.save(function(err){
		if (err) throw err;
	})
}

add_user_activity_monthly_record_json = function(user_activity_json, callback_function){
	var instance = new UserActivityHistory(user_activity_json);
	instance.save(function(err){
		if (err) throw err;
		callback_function(true);
	})
}

get_all_activities_by_user_in_timeframe = function(user_id, timestampIn, timestampOut, callback_function){
	UserActivityHistory.find({'userId': user_id, $or: [{'timestampIn': {$exists: false}}, {'timestampIn': {$gt: timestampIn}, 'timestampOut': {$lt: timestampOut}}]}, null, {'sort': {'userId': 1}}, function(err, user_activity_record){
		if (err) throw err;
		callback_function(user_activity_record);
	});
}

var exports = module.exports = {};
exports.add_user_activity_one_time_record = add_user_activity_one_time_record;
exports.add_user_activity_monthly_record = add_user_activity_monthly_record;
exports.get_all_activities_by_user_in_timeframe = get_all_activities_by_user_in_timeframe;

exports.add_user_activity_one_time_record_json = add_user_activity_one_time_record_json;
exports.add_user_activity_monthly_record_json = add_user_activity_monthly_record_json;