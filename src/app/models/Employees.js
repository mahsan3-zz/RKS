
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	passportLocalMongoose = require('passport-local-mongoose');


var employee = new Schema({
	permission: String
});

employee.plugin(passportLocalMongoose);

module.exports = mongoose.model('Employees', employee);
