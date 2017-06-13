var exports = module.exports = {};

exports.insert_instance = function(instance,cb){
	var element = instance;
	instance.save(function (err, element){
		if (err) return cb(err);
		cb(null,element)
	})
}