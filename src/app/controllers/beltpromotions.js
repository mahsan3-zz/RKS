var mongoose = require('mongoose'),
	promoInfo = require('../models/PromotionInfo'),
	passport = require('passport'),
	controller = {};

controller.getPromotionsInfo = [
	function(req,res,next) {
		promoInfo.find(function(err, doc) {
			if(err) return next(err);
			res.json({results: doc});
		});
	}
];

controller.updatePromotionInfo = [
	function(req,res,next) {
		promoInfo.findOneAndUpdate({_id: req.body.newObj._id}, req.body.newObj, {upsert:true}, function(err, doc) {
			if (err) return next(err);
			return res.json({status: "Successfully updated"});
		});
	}
];

controller.removePromotionInfo = [
	function(req,res,next) {
		promoInfo.findOneAndRemove({_id : req.body.id}, function (err, doc) {
			if(err) return next(err);
        	res.status(200).send("OK");
  		});
	}
];

controller.newPromotionsInfoItem = [
	function(req,res,next) {
		var newPromoInfo = new promoInfo(req.body.promoObj);
		newPromoInfo.save(function (err) {
		  if (err) return handleError(err);
		  res.status(200).send("OK");
		});
	}
];

module.exports = controller;
