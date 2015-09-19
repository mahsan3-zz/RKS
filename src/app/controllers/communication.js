var mongoose = require('mongoose'),
	emp = require('../models/Employees'),
	comm = require('../models/Communication'),
	passport = require('passport'),
	Twitter = require('twitter'),
	controller = {};

// get list of all communications
controller.getComms = [
	function(req,res,next) {
		communications = [];
		comm.find({},function(err,results) {
			if(err) return next(err);
		    results.forEach(function(c){
				communications.push(c);
				});
			res.status(200).json({results: communications});
		});
	}
];

// get list of all communications
controller.getCommsStudent = [
  function(req,res,next) {
    communications = [];
    comm.find({socialMedia: {announcement: true}},function(err,results) {
      if(err) return next(err);
        results.forEach(function(c){
        communications.push(c);
        });
      res.status(200).json({results: communications});
    });
  }
];
// post new communication
controller.createComm = [
	function(req, res, next) {
		console.log('adding communication');
		comm.create(new comm( {
			type: req.body.type,
		    author: req.body.author,
		    subject: req.body.subject,
		    content: req.body.content,
			socialMedia: {
				twitter: req.body.socialMedia.twitter,
				facebook: req.body.socialMedia.facebook,
				email: req.body.socialMedia.email,
				announcement: req.body.socialMedia.announcement
			},
			location: req.body.location
		}), function(err) {
			if (err) { console.log('error while creating communication!', err); return next(err); }

			console.log('communication added');

			res.status(200).send("OK");

		});
	}
];

// update communication
controller.updateComm = [
	function (req, res){
	  comm.findById(req.body._id, function (err, com){
	  	if(err) return next(err);
	  	com.type = req.body.type,
    	com.postedDate = req.body.postedDate,
    	com.scheduledDate = req.body.scheduledDate,
    	com.author = req.body.author,
   		com.subject = req.body.subject,
	    com.content = req.body.content,
	    com.socialMedia =  req.body.socialMedia
	    com.save( function ( err, com, count ){
	      res.redirect( '/' );
	    });
	  });
	}
];

// remove communication
controller.removeComm = [
	function(req, res, next){
		comm.findOneAndRemove({'_id' : req.params.id}, function (err,comm) {
			if(err) return next(err);
  			console.log('deleting collection: ' + req.params.id);
        	res.status(200).send("OK");
  		});
	}
];

// remove communication
controller.postTwitter = [
	function(req, res, next) {
		var client = new Twitter({
		  consumer_key: 's0bt1TpAIFO4qB7nQeFaZzfzN',
		  consumer_secret: 'SWwO2luZk87ihML10Hq1L6TLIMpNKlWtmsndzhQCvl43BH3bzO',
		  access_token_key: '3082746146-3VvwoJ3vkzNM4HFAKBLS7XVHmEEFdmzU2belEvc',
		  access_token_secret: 'P8lkNHrIoFfUPCjxJc8qzJ86ZoSnAJo2XZ3r8J1h1MHnl'
		});
		client.post('statuses/update', {status: req.body.post.content},  function(error, tweet, response) {
		  if(error) throw error;
		  res.json({status: "pushed to twitter"});
		});
	}
];

module.exports = controller;
