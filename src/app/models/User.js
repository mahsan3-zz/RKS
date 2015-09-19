
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	autoIncrement = require('mongoose-auto-increment'),
	db = require('../../config/db'),
	passportLocalMongoose = require('passport-local-mongoose');

autoIncrement.initialize(mongoose.createConnection(db.url));

var PaymentSchema = new Schema({
        paymentDate: Date,
        paymentAmount: Number,
        paymentOverDue: Boolean
    });

var AttendanceDatesSchema = new Schema({
        date: Date,
        time: String,
        type: String
    });

var ParentGuardiansSchema = new Schema({
        contactOrder: String,
        firstName: String,
        lastName: String,
        relation: String,
        email: String,
        phoneNumbers: {
            homePhone: String,
            cellPhone: String,
            other: String
        },
        address: {
            street: String,
            city: String,
            postalCode: String,
            province: String
        }
    });

var UserSchema = new Schema({
    userID: Number,
	permission: String,
    firstName: String,
    lastName: String,
    dateOfBirth: Date,
    gender: String,
    accountType: String,
    membershipType: String,
    membershipDate: Date,
    blackBeltClubMember: Boolean,
    status: String,
    expiryDate: Date,
    inactiveDate: Date,
    photo: String,
    personalInfo: {
        address: {
            street: String,
            city: String,
            postalCode: String,
            province: String
        },
        email: String,
        phoneNumbers: {
            homePhone: String,
            cellPhone: String,
            other: String
        },
        healthCard: {
            cardNumber: String,
            expiryDate: Date
        },
        emergencyContact: {
            name: String,
            phone: String,
            relation: String
        },
        medicalNotes: String,
        parentsGuardians: {
			parent1: {
				contactOrder: String,
				firstName: String,
				lastName: String,
				relation: String,
				email: String,
				phoneNumbers: {
					homePhone: String,
					cellPhone: String,
					other: String
				},
				address: {
					street: String,
					city: String,
					postalCode: String,
					province: String
				}
			},
			parent2: {
				contactOrder: String,
				firstName: String,
				lastName: String,
				relation: String,
				email: String,
				phoneNumbers: {
					homePhone: String,
					cellPhone: String,
					other: String
				},
				address: {
					street: String,
					city: String,
					postalCode: String,
					province: String
				}
			}
		}
	},
    membershipInfo: {
        belt: String,
		beltDate: Date,
        tip: {
			firstTip: Date,
			secondTip: Date,
			thirdTip: Date,
			tipDate: Date,
			examDate: Date,
			tipCount: { type: Number, default: 0 }
    	},
        attendanceDates: [AttendanceDatesSchema]
    },
    paymentInfo: [PaymentSchema]
});

UserSchema.plugin(autoIncrement.plugin, {
    model: 'User',
    field: 'userID',
    startAt: 10000000,
    incrementBy: 1
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);

