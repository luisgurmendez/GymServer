var UserActivity = require('./models').UserActivity;

add_user_to_activity_permanently = function(user_id, activity_id, credit_to_be_paid){
	var instance = new UserActivity({'userId':user_id, 'activityId':activity_id, 'creditToBePaid': credit_to_be_paid});
	instance.save(function(err){
		if (err) return cb(err);
	})
}

add_user_to_activity_once = function(user_id, activity_id, timestampIn, timestampOut, credit_to_be_paid){
	var instance = new UserActivity({'userId':user_id, 'activityId':activity_id, 'timestampIn':timestampIn, 'timestampOut':timestampOut, 'creditToBePaid': credit_to_be_paid});
	instance.save(function(err){
		if (err) throw err;
	})
}

remove_permanent_user_from_activity = function(user_id, activity_id){
	UserActivity.remove({'userId':user_id, 'activityId':activity_id}, function(err){
		if (err) throw err;
	});
}

remove_one_time_user_from_activity = function(user_id, activity_id, timestampIn, timestampOut){
	UserActivity.remove({'userId':user_id, 'activityId':activity_id, 'timestampIn':timestampIn, 'timestampOut':timestampOut}, function(err){
		if (err) throw err;
	});
}

remove_activity_by_id = function(user_activity_id){
	UserActivity.remove({'_id':user_activity_id}, function(err){
		if (err) throw err;
	});
}

get_user_permanent_activities = function(user_id, callback_function){
	UserActivity.find({'userId': user_id, 'timestampIn': {$exists: false}}, function(err, activities){
		if (err) throw err;
		callback_function(activities);
	});
}

get_user_one_time_activities = function(user_id, callback_function){
	UserActivity.find({'userId': user_id, 'timestampIn': {$exists: true}}, function(err, activities){
		if (err) throw err;
		callback_function(activities);
	});
}

get_all_activities_by_user = function(user_id, callback_function){
	UserActivity.find({'userId': user_id}, function(err, activities){
		if (err) return cb(err);
		callback_function(null,activities);
	});
}

check_if_user_is_doing_permanent_activity = function(user_id, activity_id, callback_function){
	UserActivity.find({'userId': user_id, 'activityId': activity_id, 'timestampIn': {$exists: false}}, function(err, user_activity){
		if (err) throw err;
		if (user_activity.length == 0){
			callback_function(false);
		}else{
			callback_function(true);
		}
	});
}

check_if_user_is_doing_specific_one_time_activity = function(user_id, activity_id, timestampIn, timestampOut, callback_function){
	UserActivity.find({'userId': user_id, 'activityId': activity_id, 'timestampIn': timestampIn, 'timestampOut': timestampOut}, function(err, user_activity){
		if (err) throw err;
		if (user_activity.length == 0){
			callback_function(false);
		}else{
			callback_function(true);
		}
	});
}

get_all_permanent_activities = function(callback_function){
		UserActivity.find({'timestampIn': {$exists: false}}, function(err, user_activity){
		if (err) throw err;
		callback_function(user_activity);
	});
}

get_all_one_time_activities = function(callback_function){
	UserActivity.find({'timestampIn': {$exists: true}}, function(err, user_activity){
		if (err) throw err;
		callback_function(user_activity);
	});
}

get_all_activities_in_timeframe = function(timestampIn, timestampOut, callback_function){
	UserActivity.find({$or: [{'timestampIn': {$exists: false}}, {'timestampIn': {$gt: timestampIn}, 'timestampOut': {$lt: timestampOut}}]}, null, {'sort': {'userId': 1}}, function(err, user_activity){
		if (err) throw err;
		callback_function(user_activity);
	});
}

get_all_one_time_activities_in_timeframe = function(timestampIn, timestampOut, callback_function){
	UserActivity.find({'timestampIn': {$gt: timestampIn}, 'timestampOut': {$lt: timestampOut}}, null, {'sort': {'userId': 1}}, function(err, user_activity){
		if (err) throw err;
		callback_function(user_activity);
	});
}

var exports = module.exports = {};
exports.add_user_to_activity_permanently = add_user_to_activity_permanently;
exports.add_user_to_activity_once = add_user_to_activity_once;
exports.remove_permanent_user_from_activity = remove_permanent_user_from_activity;
exports.remove_one_time_user_from_activity = remove_one_time_user_from_activity;
exports.remove_activity_by_id = remove_activity_by_id;
exports.get_user_permanent_activities = get_user_permanent_activities;
exports.get_user_one_time_activities = get_user_one_time_activities;
exports.get_all_activities_by_user = get_all_activities_by_user;
exports.check_if_user_is_doing_permanent_activity = check_if_user_is_doing_permanent_activity;
exports.check_if_user_is_doing_specific_one_time_activity = check_if_user_is_doing_specific_one_time_activity;
exports.get_all_permanent_activities = get_all_permanent_activities;
exports.get_all_one_time_activities = get_all_one_time_activities;
exports.get_all_activities_in_timeframe = get_all_activities_in_timeframe;
exports.get_all_one_time_activities_in_timeframe = get_all_one_time_activities_in_timeframe;