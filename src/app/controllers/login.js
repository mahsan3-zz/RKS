var mongoose = require('mongoose'),
	emp = require('../models/Employees'),
	passport = require('passport'),
	controller = {};


controller.createUser = [
	function(req, res, next) {
		console.log('registering user');
		emp.register(new emp({ username: req.body.username, permission: req.body.role}), req.body.password, function(err) {
			if (err) { console.log('error while user register!', err); return next(err); }

			console.log('user registered!');

			res.redirect('/');
		});
	}
];

//routs to default main page - relative to role
controller.defaultMainPage = [
	function(req, res, next) {
		if(req.user){
			switch(req.user.permission.toLowerCase()){
				case "admin":
					res.redirect('/adminMain');
					break;
				case "instructor":
					res.redirect('/instructorMain');
					break;
				case "student":
					res.redirect('/studentsMain');
					break;
				default:
					console.log('Not logged in!');
					res.render('../public/login', { message: req.flash('error')});
			}
		} else {
			res.render('../public/login', { message: req.flash('error')});
		}
	}
];

//render main index page
controller.routeMain = [
	function(req, res, next) {
		res.render('../public/index', { user: req.user, message: req.flash('error')});
	}
];

controller.logout = [
	function(req, res, next) {
		req.logout();
		res.redirect('/');
	}
];

//staging site - create init user
controller.testuser = [
	function(req, res, next) {
		console.log('registering user');
		emp.register(new emp({ username: "test@test.com", permission: "admin"}), "password", function(err) {
			if (err) { console.log('error while user register!', err); return next(err); }

			console.log('user registered!');
            res.status(200).redirect("/");
		});

	}
];

module.exports = controller;