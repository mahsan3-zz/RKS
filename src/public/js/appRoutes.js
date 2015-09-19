// public/js/appRoutes.js
angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider, $httpProvider) {
	//Check to see if user accessing has admin credentials
	//Resolve to all admin routes
	function checkAdminRole(securityFactory, $location){
		var access = securityFactory.isAdmin();
		access.then(function(result){
			if(result.role === 'admin'){
				console.log('Access granted!!');
			}else {
				$location.path('/accessDenied');
			}
		});

	}
	//Check to see if user accessing has instructor credentials
	//Resolve to all instructor routes
	function checkInstructorRole(securityFactory,$location){
		var access = securityFactory.isInstructor();
		access.then(function(result){
			if(result.role.toLowerCase() === 'instructor') {
				console.log('Access granted!!');
			}else{
				$location.path('/accessDenied');
			}
		});

	}
	//SPA routes
    $routeProvider
        .when('/studentsMain', {
            templateUrl: 'views/studentMain.html',
            controller: 'StudentMembershipInfoController'
        })
        .when('/studentPersonal', {
            templateUrl: 'views/studentPersonal.html',
            controller: 'StudentsPersonalInfoController'
        })
        .when('/instructorMain', {
            templateUrl: 'views/instructorMain.html',
			controller: 'BeltInformationController',
			resolve:{authenticate: checkInstructorRole}
        })
        .when('/studentClasses', {
            templateUrl: 'views/studentClasses.html'
        })
        .when('/adminMain', {
            templateUrl: 'views/adminMain.html',
            controller: 'CommunicationController',
			resolve:{authenticate: checkAdminRole}
        })
        .when('/adminShiftReports', {
            templateUrl: 'views/adminShiftReports.html',
            controller: 'ShiftReportController',
            resolve:{authenticate: checkAdminRole}
        })
        .when('/instructorShiftReports', {
            templateUrl: 'views/adminShiftReports.html',
            controller: 'ShiftReportController',
            resolve:{authenticate: checkInstructorRole}
        })
        .when('/adminEvents', {
            templateUrl: 'views/adminEvents.html',
            controller: 'EventController'
        })
        .when('/instructorEvents', {
            templateUrl: 'views/studentInstructorEvents.html',
            resolve:{authenticate: checkInstructorRole},
            controller: 'EventControllerAlt'
        })
        .when('/studentEvents', {
            templateUrl: 'views/studentInstructorEvents.html',
            controller: 'EventControllerAlt'
        })
        .when('/adminStudentsList', {
            templateUrl: 'views/adminStudentsList.html',
            controller: 'StudentsListController',
			     resolve:{authenticate: checkAdminRole}
        })
        .when('/adminBeltInformation', {
            templateUrl: 'views/adminBeltInformation.html',
            controller: 'BeltInformationController',
            resolve:{authenticate: checkAdminRole}
        })
        .when('/adminBeltPromotion', {
            templateUrl: 'views/adminBeltPromotion.html',
            controller: 'BeltController',
            resolve:{authenticate: checkAdminRole}
        })
        .when('/adminStudentsDetails/:userID', {
            templateUrl: 'views/adminStudentsDetails.html',
            controller: 'StudentsDetailsController',
			resolve:{authenticate: checkAdminRole}
        })
        .when('/adminStudentsAdd', {
            templateUrl: 'views/adminStudentsAdd.html',
            controller: 'StudentsAddController',
			resolve:{authenticate: checkAdminRole}
        })
		.when('/adminAttendance', {
            templateUrl: 'views/adminAttendance.html',
            controller: 'attendanceController',
			resolve:{authenticate: checkAdminRole}
        })
        .when('/adminAttendanceScan', {
            templateUrl: 'views/adminAttendanceScan.html',
            controller: 'attendanceController',
      		resolve:{authenticate: checkAdminRole}
        })
		.when('/adminAttendanceDetail/:userID', {
            templateUrl: 'views/adminAttendanceDetail.html',
            controller: 'attendanceDetailController',
			resolve:{authenticate: checkAdminRole}
        })
        .when('/report', {
            templateUrl: 'views/report.html',
            controller: 'ReportController'
        })
		.when('/barcode', {
            templateUrl: 'views/barcode.html',
            controller: 'barcodeController',
			resolve:{authenticate: checkAdminRole}
        })
		.when('/help', {
            templateUrl: 'views/help.html',
            controller: 'help',
			resolve:{authenticate: checkAdminRole}
        })
		.when('/accessDenied', {
            templateUrl: 'views/401.html'
		}).otherwise({
        	templateUrl: 'views/404.html'
      	});


    $locationProvider.html5Mode(true);

}]);
