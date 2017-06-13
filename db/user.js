var User = require('./models').User;

create_user_instance = function(username, password, name, lastname, role, email, money){
	return new User({'username':username, 'password':password, 'name':name, 'lastname':lastname, 'role':role, 'email':email, 'money':money});
}

authenticate_user = function(username,password,cb){
	get_user_by_username(username,function(err, user){
		if(err) return cb(err)
		if(user){
            cb(null,{authentication:password === user.password,user:user})
		}else{
			cb(null,{authentication:false})
		}
	});
}

get_user_by_username = function(username, cb){
	User.findOne({'username':username}, function(err, user){
		if (err) return cb(err);
		cb(null,user);
	});
}

get_all_users = function(cb){
	User.find(function (err, users){
		if (err) return cb(err);
		cb(null,users);
	});
}

update_user_information = function(username, user,cb){
	// Get user by username first
	get_user_by_username(username, function(actual_user){
		if(actual_user){
            for (var field in User.schema.paths) {
                if ((field !== '_id') && (field !== '__v')) {
                    if (user[field] !== undefined) {
                        actual_user[field] = user[field];
                    }
                }
            }
            actual_user.save(function(err){
                if (err) return cb(err);
                cb(null,actual_user)
            });
		}

	});
}

remove_user = function(username,cb){
	User.remove({'username':username}, function(err){
		if(err) return cb(err);
	});
}

update_user_money = function(username, money, cb){
	// Get user by username first
	get_user_by_username(username, function(actual_user){
		if (actual_user.money != 'undefined'){
			actual_user.money = actual_user.money + money;
		}else{
			actual_user.money = money;
		}
        actual_user.save(function(err){
        	if (err) return cb(err);

		});
	});
}



get_user_by_id = function(user_id, cb){
	User.findOne({'_id':user_id}, function(err, user){
		if (err) return cb(err);
		cb(null,user);
	});
}

update_user_money_by_id = function(user_id, money,cb){
	// Get user by username first
	get_user_by_id(user_id, function(actual_user){
		if (actual_user.money != 'undefined'){
			actual_user.money = actual_user.money + money;
		}else{
			actual_user.money = money;
		}
        actual_user.save(function(err){
        	if (err) return cb(err);
		});
	});
}

var exports = module.exports = {};

// Export methods
exports.create_user_instance = create_user_instance
exports.get_user_by_username = get_user_by_username;
exports.authenticate_user = authenticate_user;
exports.get_all_users = get_all_users;
exports.update_user_information = update_user_information;
exports.remove_user = remove_user;
exports.update_user_money = update_user_money;

exports.get_user_by_id = get_user_by_id;
exports.update_user_money_by_id = update_user_money_by_id;