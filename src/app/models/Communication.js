var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var CommunicationSchema = new Schema({
	type: String,
    postedDate: { type: Date, default: Date.now },
    scheduledDate: { type: Date, default: Date.now },
    author: String,
    subject: String,
    content: String,
	socialMedia: {
		twitter: {type: Boolean, default: false} ,
		facebook: {type: Boolean, default: false},
		email: {type: Boolean, default: false},
		announcement: {type: Boolean, default: false},
    postId: {
      facebook: String,
      twitter: String,
      announcement: String,
      email: String
    }
	},
	location: String
	//testing purposes
	//externalRefToEmp: {type: Schema.Types.ObjectId, ref: "Employees"}
});

module.exports = mongoose.model('Communication', CommunicationSchema);