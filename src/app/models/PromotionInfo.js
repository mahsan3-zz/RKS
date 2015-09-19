var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var PromotionInfoSchema = new Schema({
    beltOrder: Number,
    belt: String,
    classesRequired: Number,
    bootCampRequired: Number,
    bootCampClass: Boolean,
    weeksBetweenTips: Number
});

module.exports = mongoose.model('PromotionInfo', PromotionInfoSchema);