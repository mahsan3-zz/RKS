var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var EventSchema = new Schema({
	name: String,
    starts_at: { type: Date, default: Date.now },
    ends_at: { type: Date, default: Date.now },
    type: String,
    description: String,
    location: String
});

module.exports = mongoose.model('Event', EventSchema);