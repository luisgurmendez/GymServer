var Activity = require('./models').Activity;

create_activity_instance = function(name, credit, oneTimeCredit, dayOfTheWeek, hourIn, hourOut, coaches, description){
	return new Activity({'name':name, 'credit':credit, 'oneTimeCredit':oneTimeCredit, 'dayOfTheWeek':dayOfTheWeek, 'hourIn':hourIn, 
						 'hourOut':hourOut, 'coaches':coaches, 'description':description, 'regularStudents':[]});
}

get_activity_by_id = function(activity_id, callback_function){
	Activity.findById(activity_id, function(err, activity){
		if (err) return callback_function(err);
		callback_function(null,activity);
	});
}

get_all_activities = function(callback_function){
	Activity.find(function (err, activities){
		if (err) callback_function(err);
		callback_function(null,activities);
	});
}

update_activity = function(activity_id, activity,cb){
	// Get user by username first
	get_activity_by_id(activity_id, function(actual_activity){
		for (var field in Activity.schema.paths) {
           if ((field !== '_id') && (field !== '__v')) {
              if (activity[field] !== undefined) {
                 actual_activity[field] = activity[field];
              }
           }  
        }
        actual_activity.save(function(err){
        	if (err) return cb(err,actual_activity);
        });
	});
}

remove_activity = function(activity_id,cb){
	Activity.remove({'_id':activity_id}, function(err){
		if (err) return cb(err);

	});
}

var exports = module.exports = {};
exports.create_activity_instance = create_activity_instance;
exports.get_activity_by_id = get_activity_by_id;
exports.get_all_activities = get_all_activities;
exports.update_activity = update_activity;
exports.remove_activity = remove_activity;