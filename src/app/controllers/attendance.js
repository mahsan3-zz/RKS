var mongoose = require('mongoose'),
	usr = require('../models/User'),
	passport = require('passport'),
	controller = {};

// post new attendance
controller.createAttendance = [
    function(req, res, next) {
		usr.update({userID: req.body.userID}, 
			{
				$push:{
					"membershipInfo.attendanceDates":{
						date: req.body.date,
	    				time: req.body.time,
						type: req.body.type
					}
				} 
			}, function(err, result) {
			if (err) return next(err);
			console.log("Attendance added to user!!!");
			res.json({status: result});
		});
	}
];

// update Attendance
controller.updateAttendance = [
	function (req, res, next){
	  usr.find({userID:req.body.userID}, function (err, user){
	  	user = user[0];
	  	user.membershipInfo.attendanceDates.forEach(function(item){
	  		if(req.body.attendanceID == item._id.toString()) {
	  			item.date = req.body.date;
	  			item.time = req.body.time;
	  			item.type = req.body.type;
	    		usr.update({userID: req.body.userID}, 
	    			{$set: {"membershipInfo.attendanceDates": user.membershipInfo.attendanceDates}}, 
	    			function(err, result) {
						if (err) return next(err);
						res.json({status: "Updated successfully!"});
				});
			}
	  	});
	  });
	}
];

controller.getAttendance = [
    function(req, res, next) {
		usr.find({userID: req.query.studentNumber}, function(err, doc) {
			if(err) return next(err);
			res.json({attendanceList: doc[0].membershipInfo.attendanceDates, totalClasses: 		doc[0].membershipInfo.attendanceDates.length, fullName: doc[0].firstName + ' ' + doc[0].lastName});
		});
	}
];

controller.deleteDatesList = [
    function(req, res, next) {
		console.log('---------- Deleting ------------');
		console.log(req.body.dList);
		req.body.dList.forEach(function(d) {
			usr.update({'userID': req.body.userID}, 
				{ $pull: { "membershipInfo.attendanceDates" : { _id: d } } },
				function(err, result) {
					if (err) return next(err);
				});
		});
		res.json({status: "Finished deleting."});
	}
];

module.exports = controller;
