var mongoose = require('mongoose'),
	usr = require('../models/User'),
	fs = require("fs"),
	uuid = require('node-uuid'),
	promoInfo = require('../models/PromotionInfo'),
	promoCtrl = require('./beltinformation'),
	controller = {};

function getWeeksBetweenTips(promoList, colour) {
	for(var i = 0; i < promoList.length; i++) {
		if(promoList[i].belt === colour){
			return promoList[i].weeksBetweenTips;
		}
	}
	return -1;
}

function getLatestDate(aList) {
	//console.log('--------  ATTENDANCE DATES  -----------');
	//console.log(aList);
	var latestDate = new Date();
	if(aList.length == 0){
		//console.log('ZERO!')
		return 0;
	} else{
		for(var i = 0; i < aList.length; i++) {
			if(i == 0) {
				latestDate = aList[i].date;
			}else if(aList[i].date > latestDate) {
				latestDate = aList[i].date;
			}
		}
		//console.log('Latest Date is: ');
		//console.log(latestDate);
		return latestDate;
	}
}

function getClassesThisWeek(aList) {
	var classCount = 0;

	var newdate = new Date();
	newdate.setDate(newdate.getDate() - 7); // minus the date
	var nd = new Date(newdate);

	//console.log('----  SEVEN DAYS AGO: ' + nd);
	for(var i = 0; i < aList.length; i++) {
		if(aList[i].date >= nd) {
			classCount++;
		}
	}
	//console.log('returning: ' + classCount);
	return classCount;
}

controller.getStudents = [
    function(req,res,next) {
		students = [];
        //find all usr, render the index.ejs view
        usr.find({},function(err,results) {
          if(err) return next(err);

		  results.forEach(function(s){
			//we will return only specific fields from the student object
			students.push({
				firstName: s.firstName,
				lastName: s.lastName,
				studentNumber: s.userID,
				homePhone: s.personalInfo.phoneNumbers.homePhone,
				email: s.personalInfo.email,
				currentBelt: s.membershipInfo.belt,
				latestDate: getLatestDate(s.membershipInfo.attendanceDates),
				classesThisWeek: getClassesThisWeek(s.membershipInfo.attendanceDates),
				role: s.permission,
                birthDate: s.dateOfBirth,
                expiryDate: s.expiryDate
			});

		  });
          res.json({results: students});
        });
    }
];
controller.deleteStudents = [
    function(req, res, next) {
		req.body.sList.forEach(function(studentName) {
			usr.findOneAndRemove({userID : studentName}, function (err, status) {
				if(err){
					res.json({"status": "Error: Couldn't delete users"});
				}
				else {
					console.log('Deleted : %s',  studentName);
				}
			});
		});
		res.json({status: "Finished deleting."});
	}
];

controller.getCurrentStudent = [
    function(req, res, next) {
		usr.find({username: req.user.username}, function(err, doc){
			if(err) return next(err);
			temp = doc[0].toObject();
			delete temp.salt;
			delete temp.hash;
			res.json({studentObj: doc[0]});
		});
	}
];

controller.getNextBelt = [
	function(req, res, next) {
		promoInfo.find({}, function(err, doc) {
			if(err) return next(err);
			var currentRank = promoCtrl.getCurrentRank(doc, req.query.currentBelt);
			var nextBelt = promoCtrl.getNextRankColours(doc, currentRank);
			res.json({nextBelt: nextBelt});
		});
	}
];

controller.getStudent = [
    function(req, res, next) {
		console.log('random number');
		console.log(getNumber());
		console.log(req.query);
		if(req.query.studentNumber !== ""){
			next();
		} else {
			res.json({status: "No student number found passed."});
		}
	},
    function(req, res, next) {
		usr.find({userID: req.query.studentNumber}, function(err, doc){
			if(err) return next(err);
			res.json(doc);
		});
	}
];

//update student
controller.updateStudent = [
    function(req, res, next) {
		var sObj = req.body.studentObj;
        console.log('---UPDATIN!!!!!');
		console.log(sObj);
		usr.update({userID: sObj.userID}, {$set: sObj}, function(err, result) {
			if (err) return next(err);
			res.json({status: "Updated successfully!"});
		});
	}
];

//update student
controller.updateCurrentStudent = [
    function(req, res, next) {
		var sObj = req.body.studentObj;
        if(req.user.userID === sObj.userID){
          usr.update({userID: sObj.userID}, {$set: sObj}, function(err, result) {
              if (err) return next(err);
              res.json({status: "Updated successfully!"});
          });
        }
	}
];

//random number used for unique student ids -- not using anymore
function getNumber() {
    var minNumber = 111111; // The minimum number you want
    var maxNumber = 9999999999; // The maximum number you want
    return "" + Math.floor(Math.random() * (maxNumber + 1) + minNumber); // Generates random number
}

controller.createNewStudent = [
	function(req, res, next) {
		usr.find({username: req.body.studentObj.personalInfo.email}, function(err, doc){
			if(err) return next(err);
			if(doc.length > 0) {
				res.json({error: "Email address exists"});
			} else {
				next();
			}
		});
	},
	function(req, res, next) {
		promoInfo.find({}, function(err, doc) {
			if(err) return next(err);
			req.weeksBeforeTip = getWeeksBetweenTips(doc, req.body.studentObj.membershipInfo.belt);
			next();
		});
	},
	function(req, res, next) {
		promoInfo.find({}, function(err, doc){
			if(err) return next(err);
			req.promoList = doc;
			next();
		});
	},
	//set init tipdate
	function(req, res, next){
		var tDate = new Date(req.body.studentObj.membershipDate);
		tDate.setDate(tDate.getDate() + (7 * req.weeksBeforeTip));
		
		req.body.studentObj.membershipInfo.tip = {};
		
		req.body.studentObj.membershipInfo.tip.tipDate = new Date(tDate);
		req.body.studentObj.membershipInfo.tip.firstTip = new Date(tDate);
		req.body.studentObj.membershipInfo.tip.secondTip = new Date();
		req.body.studentObj.membershipInfo.tip.thirdTip = new Date();
		req.body.studentObj.membershipInfo.tip.examDate = new Date();
		req.body.studentObj.membershipInfo.beltDate = req.body.studentObj.membershipDate;
		
		next();
	},
	//init forcast for next dates
	function(req, res, next) {
		req.body.studentObj.membershipInfo.tip.secondTip.setDate(
			req.body.studentObj.membershipInfo.tip.secondTip.getDate() + (7 * (req.weeksBeforeTip * 2)));

		req.body.studentObj.membershipInfo.tip.thirdTip.setDate(
			req.body.studentObj.membershipInfo.tip.thirdTip.getDate() + (7 * (req.weeksBeforeTip * 3)));
		
		req.body.studentObj.membershipInfo.tip.examDate.setDate(
			req.body.studentObj.membershipInfo.tip.examDate.getDate() + (7 * (req.weeksBeforeTip * 4)));
		
		next();
	},
    function(req, res, next) {
		req.body.studentObj.username = req.body.studentObj.personalInfo.email;
		var tempPassword = req.body.studentObj.personalInfo.password;
		delete req.body.studentObj.personalInfo.password;
		req.body.studentObj.permission = req.body.studentObj.permission;
		usr.register(new usr(req.body.studentObj), tempPassword, function(err) {
			if (err) { console.log('error while user register!', err); return next(err); }
			console.log('New user registered!');
			res.json({added: true});
		});
	}
];

controller.uploadImage = [
	//remove existing photo for this profile, if any but default one
	function(req, res, next){
		if(req.body.currentPhoto !== "noimage.jpg"){
			fs.unlinkSync('./public/img/' + req.body.currentPhoto);
			console.log('successfully deleted old photo');
		}
		next();
	},
	//upload new photo
	function(req, res, next){
		//console.log(req.files.file);
		//console.log('BODY: ' + req.body);

		var tmp_path = req.files.file.path;
		var extension = tmp_path.slice(tmp_path.indexOf("."));
		var filename = 'user_' + uuid.v4() + extension;
		target_path = './public/img/' + filename;
		fs.renameSync(tmp_path, target_path, function(err) {
			if(err) console.error(err.stack);
		});
		//return name of new photo
		res.json({fileName: filename});
	}
];

controller.getBeltsAvailible = [
	function(req, res, next) {
		temp = [];
		promoInfo.find({}, function(err, doc) {
			if(err) return next(err);
			doc.forEach( function(d){
				temp.push(d.belt);
			});
			//console.log(temp);
			res.json({bList: temp});
		});
	}
];

module.exports = controller;