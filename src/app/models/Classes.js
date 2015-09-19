var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var DaySchema = new Schema({
	dayOfWeek: String,
	startTime: String,
	endTime: String,
	typeOfClass: String,
	description: String
});

var ClassesSchema = new Schema({
	name: String,
	beltLevel: String,
	schedule: [DaySchema]
});

module.exports = mongoose.model('Classes', ClassesSchema);