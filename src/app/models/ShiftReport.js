var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ShiftReportSchema = new Schema({
	reportTitle: String,
    reportDescription: String,
    reportAuthor: String,
    reportDate: { type: Date, default: Date.now },
    reportTime: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ShiftReport', ShiftReportSchema);