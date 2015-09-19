var mongoose = require('mongoose'),
	com = require('../models/Communication'),
	pro = require('../models/PromotionInfo'),
	cls = require('../models/Classes'),
	usr = require('../models/User'),
	evt = require('../models/Event'),
	shr = require('../models/ShiftReport'),
	controller = {};

controller.addShiftReport = [
	function(req, res, next) {
		console.log('adding shift report');
		var obj = {
			reportTitle: "some title",
    		reportAuthor: "Hemmingway",
    		reportDate: { type: Date, default: Date.now },
    		reportTime: { type: Date, default: Date.now },
    		reportDescription: "some description"
		}
		shr.create(obj, function(err, shft) {
			if(err){
				console.log("ERRRORRR");
				return next(err);
			}else{
				console.log('Created shift report item');
			}
		});
	}
];

controller.addEvent = [
	function(req, res, next) {
		console.log('adding event');
		var obj = {
			name: "BruceLee masterclass",
    		eventDate: { type: Date, default: Date.now },
    		description: "BruceLee knows kungfu",
    		location: "Holywood"
		}
		evt.create(obj, function(err, evnt) {
			if(err){
				console.log("ERRRORRR");
				return next(err);
			}else{
				console.log('Created event item');
			}
		});
	}
];

controller.addCommunication = [
	function(req, res, next) {
		console.log('adding communication');
		var obj = {
			type: "A",
			postedDate: { type: Date, default: Date.now },
			scheduledDate: { type: Date, default: Date.now },
			author: "author",
			subject: "subject",
			content: "content",
			socialMedia: {
				twitter: true,
				facebook: true,
				email: true,
				announcement: true
			},
			location: "location"
		}
		com.create(obj, function(err, comm) {
			if(err){
				console.log("ERRRORRR");
				return next(err);
			}else{
				console.log('Created comm item');
			}
		});
	}
];

controller.addPromotionInfo = [
	function(req, res, next) {
		console.log('adding promotioninfo');
		var obj = {
			beltOrder: "YELLOW",
			belt: "YELLOWER",
			classesRequired: 6,
			bootCampRequired: true,
			weeksBetweenTips: 666
		}
		pro.create(obj, function(err, comm){
			if(err){
				console.log("ERRRORRR");
				return next(err);
			}else{
				console.log('Created promotion item');
			}
		});
	}
];

controller.addClasses = [
	function(req, res, next) {
		console.log('adding class');
		var subObj = {
			dayOfWeek: "Monday",
			startTime: "6PM",
			endTime: "9PM",
			typeOfClass: "Blackbelt",
			description: "some description"
		}
		var obj = {
			name: "Muhammad",
			beltLevel: "Black",
			schedule: [subObj]
		}

		cls.create(obj, function(err, comm){
			if(err){
				console.log("ERRRORRR");
				return next(err);
			}else{
				console.log('Created class item');
			}
		});
	}
];


//random number used for unique student ids
function getNumber() {
    var minNumber = 111111; // The minimum number you want
    var maxNumber = 9999999999; // The maximum number you want
    return "" + Math.floor(Math.random() * (maxNumber + 1) + minNumber); // Generates random number
}

controller.addUser = [
	function(req, res, next) {
		console.log('adding user');

		var payment = {
			paymentDate: { type: Date, default: Date.now },
        	paymentAmount: 55.55,
        	paymentOverDue: false
		}

		var attendance = {
			date: { type: Date, default: Date.now },
        	time: { type: Date, default: Date.now },
        	type: "something"
		}

		var tips = {
			halfTipOneDate: { type: Date, default: Date.now },
        	tipOneDate: { type: Date, default: Date.now },
        	halfTipTwoDate:{ type: Date, default: Date.now },
        	tipTwoDate: { type: Date, default: Date.now },
        	halfTipThreeDate: { type: Date, default: Date.now },
        	tipThreeDate: { type: Date, default: Date.now },
        	examDate: { type: Date, default: Date.now }
		}

/*
		var pg = {
			contactOrder: "0",
        	firstName: "Hareld",
        	lastName: "Green",
        	relation: "Relative",
            email: "theEmail@email.com",
        	phoneNumbers: {
            	homePhone: "4161111111",
            	cellPhone: "18001133434",
            	other: "344223345"
        	},
        	address: {
            	street: "90 pond road",
            	city: "markham",
            	postalCode: "k2b6a2",
            	province: "ON"
        	}
		}

        var pg2 = {
			contactOrder: "1",
        	firstName: "Hareld2",
        	lastName: "Green2",
        	relation: "Relative2",
            email: "theEmail2@email.com",
        	phoneNumbers: {
            	homePhone: "4161112222",
            	cellPhone: "18001132222",
            	other: "344222222"
        	},
        	address: {
            	street: "22 pond road",
            	city: "2markham",
            	postalCode: "k2b2a2",
            	province: "ON"
        	}
		}

		var pi = {
			address: {
            	street: "90 pond",
            	city: "torotno",
            	postalCode: "k3d4f5",
            	province: "ON"
        	},
        	email: "something@something.ca",
        	phoneNumbers: {
            	homePhone: "34522333",
            	cellPhone: "1111111111",
            	other: "3343444333"
        	},
        	healthCard: {
            	cardNumber: "3434343434343aass",
            	expiryDate: { type: Date, default: Date.now }
        	},
        	emergencyContact: {
            	name: "mr.smith",
            	phone: "34343434343",
            	relation: "other"
        	},
        	medicalNotes: "some notes",
        	parentGuardians: [pg, pg2]
		}
*/
		var user = {
             // userID: "", 
            firstName: "Bruce", 
            lastName: "Wayne",
            //dateOfBirth: "", 
            gender: "Male", 
            
            personalInfo: {
                address: {
                    street: "1007 Mountain Drive",
                    city: "Gotham",
                    postalCode: "N4N4N4",
                    province: "Ontario"
                },
                email: "admin@rks.com",
                phoneNumbers: {
                    homePhone: "9054249249",
                    cellPhone: "9054229222"
                },
                emergencyContact: {
                    name: "Alfred Pennyworth", 
                    phone: "9054343333", 
                    relation: "Legal Guardian"
                },
                medicalNotes: "None",
                    //blackBeltClubMember: false,
                    photo: "noimage.jpg",
            }, 
          
		    //blackBeltClubMember: false,
		    photo: "noimage.jpg",
		}

        user.username = "admin@rks.com";
        //user.permission = "Admin"; // Can we make this cap first letter?
		user.permission = "admin";    
		console.log(user);
		usr.register(new usr(user), "P@ssw0rd", function(err) {
			if (err) { console.log('error while user register!', err); return next(err); }

			console.log('New student registered!');
            res.status(200).redirect("/");
		});


	}
];


module.exports = controller;