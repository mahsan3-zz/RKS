var mongoose = require('mongoose'),
	shiftReportModel = require('../models/ShiftReport'),
	passport = require('passport'),
	controller = {};

// get list of all reports
controller.getShiftReports = [
	function(req,res,next) {
		shiftreports = [];
		shiftReportModel.find({},function(err,results) {
			if(err) return next(err);
		    results.forEach(function(s){
					shiftreports.push(s);
				});
			res.status(200).json({results: shiftreports});
		});
	}
];

// post new report
controller.createShiftReport = [
	function(req, res, next) {
		console.log('adding shift report');
		shiftReportModel.create(new shiftReportModel( { 
			reportTitle: req.body.reportTitle,
    		reportAuthor: req.body.reportAuthor,
    		reportDate: { type: Date, default: Date.now },
    		reportTime: { type: Date, default: Date.now },
    		reportDescription: req.body.reportDescription
		}), function(err) {
			if (err) { console.log('error while creating shift report!', err); return next(err); }
			console.log('shift report added');
			res.status(200).send("OK");
		});
	}
];

// update report
controller.updateShiftReport = [
	function (req, res){
	  shiftReportModel.findById(req.body._id, function (err, report){
	  	if(err) return next(err);
	  	report.reportTitle = req.body.reportTitle,
    	report.reportAuthor = req.body.reportAuthor,
    	report.reportDate = req.body.reportDate,
    	report.reportTime = req.body.reportTime,
    	report.reportDescription = req.body.reportDescription,
	    report.save( function ( err, report, count ){
	      res.redirect( '/' );
	    });
	  });
	}
];

// remove report
controller.removeShiftReport = [
	function(req, res, next){
		shiftReportModel.findOneAndRemove({'_id' : req.params.id}, function (err, reportModel){
			if(err) return next(err);
  			console.log('deleting collection: ' + req.params.id);
        	res.status(200).send("OK");
  		});
	}
];


module.exports = controller;
