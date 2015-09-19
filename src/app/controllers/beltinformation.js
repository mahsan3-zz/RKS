var mongoose = require('mongoose'),
	promoInfo = require('../models/PromotionInfo'),
	usr = require('../models/User'),
	controller = {};

controller.getWeeksBetweenTips = function(promoList, colour) {
	for(var i = 0; i < promoList.length; i++) {
		if(promoList[i].belt === colour){
			return promoList[i].weeksBetweenTips;
		}
	}
	return -1;
};

controller.getCurrentRank = function(promoList, colour) {
	for(var i = 0; i < promoList.length; i++) {
		if(promoList[i].belt === colour){
			return promoList[i].beltOrder;
		}
	}
	return -1;
};

controller.getNextRankColours = function(promoList, currentNum) {
	for(var i = 0; i < promoList.length; i++) {
		if(promoList[i].beltOrder === (currentNum+1)) {
			return {
				belt: promoList[i].belt,
				weeks: promoList[i].weeksBetweenTips
			}
		}
	}
	return -1;
};

controller.getLastWednesday = function() {
	var dateFrom = moment(Today).endOf('month');
	while(dateFrom.day() !== 3) {
		dateFrom.subtract(1, 'day');
	}
	return dateFrom;
};

controller.test = function() {
	console.log('Function called!');
};

controller.getPromoEligibleUsers = [
	//get all users
	function(req, res, next) {
		usr.find({permission: "Student"}, function(err, doc) {
			if(err) return next(err);
			req.studentList = doc;
			next();
		});
	},
	//get beltInfo
	function(req, res, next) {
		promoInfo.find({}, function(err, doc) {
			if(err) return next(err);
			req.promoList = doc;
			next();
		});
	},
	//sort through users, last tip date + beltInfo.classesNeeded(weeks) === today
	function(req, res, next) {
		var newEligibleList = [];
		var Today = new Date();
		  req.studentList.forEach(function(s) {

			 var tipDay = (s.membershipInfo.tip.tipDate.getFullYear() === Today.getFullYear()
			   	&& s.membershipInfo.tip.tipDate.getDate() === Today.getDate()
			   	&& s.membershipInfo.tip.tipDate.getMonth() === Today.getMonth());
			 var examDay = (s.membershipInfo.tip.examDate.getFullYear() === Today.getFullYear()
			 	&& s.membershipInfo.tip.examDate.getDate() === Today.getDate()
			 	&& s.membershipInfo.tip.examDate.getMonth() === Today.getMonth());
			  console.log('---------------------------------------------');
			  console.log('---------------------------------------------');
			  console.log(tipDay);
			  console.log(examDay);
			 if(tipDay || examDay) {
				newEligibleList.push({
          _id: s._id,
          userID: s.userID,
					firstName: s.firstName,
					lastName: s.lastName,
					studentNumber: s.userID,
					homePhone: s.personalInfo.phoneNumbers.homePhone,
					email: s.personalInfo.email,
					currentBelt: s.membershipInfo.belt,
					tips: s.membershipInfo.tip,
					role: s.permission,
          photo: s.photo,
					birthDate: s.dateOfBirth,
					expiryDate: s.expiryDate,
					promoAble: (examDay ? true: false)
          //promoAble: true
				});
			}
		  });
		res.json({studentsList: newEligibleList});
	}
	//return sorted users
];

controller.updateUser = [
	//get beltInfo
	function(req, res, next) {
		promoInfo.find({}, function(err, doc){
			if(err) return next(err);
			req.promoList = doc;
			next();
		});
	},
	//get student being updated
	function(req, res, next) {
		usr.find({userID: req.body.userID}, function(err, results) {
			if(err) return next(err);
			req.currentRank = controller.getCurrentRank(req.promoList, results[0].membershipInfo.belt);
			req.studentObj = results[0];
			next();
		});
	},
	//update tips
	function(req, res, next) {
		console.log('=============================');
		console.log(req.body.grantedTip);
		console.log('=============================');
		if(req.body.grantedTip === "Half Tip") {
			console.log("Using Half Tip");
			req.studentObj.membershipInfo.tip.tipDate.setDate(
				req.studentObj.membershipInfo.tip.tipDate.getDate() + 7);

			req.studentObj.membershipInfo.tip.firstTip.setDate(
				req.studentObj.membershipInfo.tip.firstTip.getDate() + 7);

			req.studentObj.membershipInfo.tip.secondTip.setDate(
				req.studentObj.membershipInfo.tip.secondTip.getDate() + 7);

			req.studentObj.membershipInfo.tip.thirdTip.setDate(
				req.studentObj.membershipInfo.tip.thirdTip.getDate() + 7);

		} else if(req.body.grantedTip === "Full Tip") {
			console.log("Using Full Tip");
			req.studentObj.membershipInfo.tip.tipCount += 1;
			if(req.studentObj.membershipInfo.tipCount === 3) {
				req.studentObj.membershipInfo.tipCount = 0;
				//get last wednesday of month
				req.studentObj.membershipInfo.examDate = controller.getLastWednesday();
			} else if(req.studentObj.membershipInfo.tipCount === 2){
				req.studentObj.membershipInfo.tip.tipDate = req.studentObj.membershipInfo.tip.secondTip;
			}
		} else if(req.body.grantedTip === "Promote") {
			var nextLevel = controller.getNextRankColours(req.promoList, req.currentRank);
			req.studentObj.membershipInfo.belt = nextLevel.belt;
			req.studentObj.membershipInfo.tipCount = 0;
			req.studentObj.membershipInfo.beltDate = new Date();
			req.studentObj.membershipInfo.examDate = new Date(20000, 0, 01);

			req.studentObj.membershipInfo.tip.tipDate.setDate(
				req.studentObj.membershipInfo.tip.tipDate.getDate() + (7 * nextLevel.weeks));

			req.studentObj.membershipInfo.tip.firstTip.setDate(
				req.studentObj.membershipInfo.tip.firstTip.getDate() + (7 * nextLevel.weeks));

			req.studentObj.membershipInfo.tip.secondTip.setDate(
				req.studentObj.membershipInfo.tip.secondTip.getDate() + (7 * (nextLevel.weeks * 2)));

			req.studentObj.membershipInfo.tip.thirdTip.setDate(
				req.studentObj.membershipInfo.tip.thirdTip.getDate() + (7 * (nextLevel.weeks * 3)));
		}
		next();
	},
	function(req, res, next) {
		console.log(req.studentObj);
		usr.update({userID: req.studentObj.userID}, {$set: req.studentObj.toObject()}, function(err, result) {
			if (err) return next(err);
			res.json({status: "Updated successfully!"});
		});
	}
];

module.exports = controller;