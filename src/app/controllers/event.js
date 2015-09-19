var mongoose = require('mongoose'),
	eventModel = require('../models/Event'),
	passport = require('passport'),
	controller = {};

// get list of all event
controller.getEvents = [
	function(req,res,next) {
		events = [];
		eventModel.find({},function(err,results) {
			if(err) return next(err);
		    results.forEach(function(c){
					events.push(c);
				});
			res.status(200).json({results: events});
		});
	}
];

// post new event
controller.createEvent = [
	function(req, res, next) {
		console.log('adding event');
		eventModel.create(new eventModel( {
			name: req.body.name,
    		starts_at: req.body.starts_at,
    		ends_at: req.body.ends_at,
    		description: req.body.description,
			location: req.body.location
		}), function(err) {
			if (err) { console.log('error while creating event!', err); return next(err); }
			console.log('event added');
			res.status(200).send("OK");
		});
	}
];

// update event
controller.updateEvent = [
	function (req, res){
	  eventModel.findById(req.body._id, function (err, evnt){
	  	evnt.name = req.body.name,
    	evnt.starts_at = req.body.starts_at,
    	evnt.ends_at = req.body.ends_at,
    	evnt.description = req.body.description,
    	evnt.location = req.body.location,
	    evnt.save( function ( err, evnt, count ){
	      res.redirect( '/' );
	    });
	  });
	}
];

// remove event
controller.removeEvent = [
	function(req, res, next){
		eventModel.findOneAndRemove({'_id' : req.params.id}, function (err, eventModel){
			if(err) return next(err);
  			console.log('deleting collection: ' + req.params.id);
        	res.status(200).send("OK");
  		});
	}
];


module.exports = controller;
