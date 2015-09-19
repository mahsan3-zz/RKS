 // app/routes.js
var passport = require('passport'),
	express = require('express');

// controllers
var	loginController = require('./controllers/login'),
	commController = require('./controllers/communication'),
	eventController = require('./controllers/event'),
	shiftReportController = require('./controllers/shiftreport'),
	testController = require('./controllers/testModels'),
	studentsController = require('./controllers/studentCRUD'),
	userController = require('./controllers/attendance');
	promotionInfo = require('./controllers/beltpromotions');
    nodemailer = require('./controllers/nodemailer')
	promote = require('./controllers/beltinformation');

module.exports = function(app) {
	//==========================  SERVER ROUTES  =================================

	//Check if user is logged in - could be any permission level
	//apply to all student routes
	var isAuthenticated = function (req, res, next) {
	  if (req.isAuthenticated())
		return next();
	  res.redirect('/');
	};

	//check to make sure logged in user is admin or instructor
	//apply to all admin & instructor routes
	var isAdminInstructor = function (req, res, next) {
	  if (req.isAuthenticated()){
		  if(req.user.permission.toLowerCase() === 'admin' || req.user.permission.toLowerCase() === 'instructor') {
		  	return next();
		  }
	  }
	  res.json({Error: "401: Unathorized User"});
	};

	//Routes to handle user login/logout/authenticaiton/managment
	// route to test if the user is logged in or not
	app.get('/loggedin', function(req, res) {
		res.json(req.isAuthenticated() ? {role: req.user.permission.toLowerCase()} : {role: 'None'});
	});

	app.get('/createnewuser', loginController.testuser);

	app.get('/', loginController.defaultMainPage);
    //app.get('*', loginController.defaultMainPage);
	app.post('/loginC', loginController.createUser);

	app.post('/loginA', passport.authenticate('local', {
		failureRedirect: '/',
		failureFlash: 'Invalid user name or password!'
	}), loginController.defaultMainPage);


	//set angular main view here
	app.get('/studentsMain', isAuthenticated,loginController.routeMain);
	app.get('/adminMain', isAuthenticated, loginController.routeMain);
	app.get('/instructorMain', isAuthenticated, loginController.routeMain);

	app.get('/logout', loginController.logout);


	//end user login/logout/authenticaiton/managment

	// communication handlers
	app.post('/createCommunication', isAdminInstructor, commController.createComm);
	app.get('/getCommunications', isAdminInstructor, commController.getComms);
  app.get('/getCommunications',  commController.getCommsStudent);
	app.post('/updateCommunication/', isAdminInstructor, commController.updateComm);
	app.delete('/removeCommunication/:id', isAdminInstructor, commController.removeComm);

	//test models
	//Comment out in production

	//event handlers
	app.post('/createEvent', eventController.createEvent);
	app.get('/getEvents', eventController.getEvents);
	app.post('/updateEvent/', eventController.updateEvent);
	app.delete('/removeEvent/:id', eventController.removeEvent);

	// shift report handlers
	app.post('/createShiftReport', shiftReportController.createShiftReport);
	app.get('/getShiftReports', shiftReportController.getShiftReports);
	app.post('/updateShiftReport/', shiftReportController.updateShiftReport);
	app.delete('/removeShiftReport/:id', shiftReportController.removeShiftReport);

	//test models
	app.get('/createshiftTest', testController.addShiftReport);
	app.get('/createeventTest', testController.addEvent);

	app.post('/createCommunication', isAdminInstructor, commController.createComm);
	app.get('/getCommunications', isAdminInstructor, commController.getComms);
  app.get('/getStudentCommunications', isAuthenticated, commController.getCommsStudent);
	app.post('/updateCommunication/', isAdminInstructor, commController.updateComm);
	app.delete('/removeCommunication/:id', isAdminInstructor, commController.removeComm);

	app.post('/createAttendance', userController.createAttendance);
	app.post('/updateAttendance', userController.updateAttendance);

	//test models

	app.get('/createcommTest', testController.addCommunication);
	app.get('/createproTest', testController.addPromotionInfo);
	app.get('/createclassTest', testController.addClasses);
	app.get('/createuserTest', testController.addUser);

   	// student CRUD
    app.get('/studentsList', isAdminInstructor, studentsController.getStudents);
	app.post('/deleteStudents', isAdminInstructor, studentsController.deleteStudents);
	app.get('/getStudent', isAdminInstructor, studentsController.getStudent);
  	app.get('/getCurrentStudent', isAuthenticated, studentsController.getCurrentStudent);
	app.post('/updateStudent', isAdminInstructor, studentsController.updateStudent);
    app.post('/updateCurrentStudent', isAuthenticated, studentsController.updateCurrentStudent);
	app.post('/createNewStudent', isAdminInstructor, studentsController.createNewStudent);
	app.get('/getNextBelt', isAuthenticated, studentsController.getNextBelt);
	app.get('/getAllBelts', isAdminInstructor, studentsController.getBeltsAvailible);

	//attendance
	app.get('/getAttendanceList', isAdminInstructor, userController.getAttendance);
	app.post('/removeDatesList', isAdminInstructor, userController.deleteDatesList);

	//promotionInfo
	app.get('/getPromotionsInfo', isAuthenticated, promotionInfo.getPromotionsInfo);
	app.post('/updatePromotionInfo', isAdminInstructor, promotionInfo.updatePromotionInfo);
	app.post('/removePromotionInfo', isAdminInstructor, promotionInfo.removePromotionInfo);
	app.post('/newPromotionsInfoItem', isAdminInstructor, promotionInfo.newPromotionsInfoItem);

	//Promotions Operations
	app.get('/getUsersToPromote', isAdminInstructor, promote.getPromoEligibleUsers);
	app.post('/updateUserBeltTips', isAdminInstructor, promote.updateUser);

	app.post('/postTweet', isAdminInstructor, commController.postTwitter);
	//image upload
	app.post('/upload', isAuthenticated, studentsController.uploadImage);

    // Nodemailer
    app.post('/sendMail', isAuthenticated, nodemailer.sendMail);

	//all routes handler
	app.get('/*', isAuthenticated, loginController.routeMain);
};
