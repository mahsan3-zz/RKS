(function() {
    // Return $http and $resource objects to Controller
    var attendanceFactory = function($http, $resource, moment) {
        var factory = {};

        factory.createAttendance = function(newAttendance, userID) {
			return $http({
				url: '/createAttendance',
				method: "POST",
				data: {
					date: newAttendance.date,
					time: newAttendance.time,
					type: newAttendance.type,
					userID: userID
				}
			});
        };

        factory.updateAttendance = function(newAttendance, userID){
			return $http({
				url: '/updateAttendance',
				method: "POST",
				data: {
					date: newAttendance.date,
					time: newAttendance.time,
					type: newAttendance.type,
					userID: userID,
					attendanceID: newAttendance.attID
				}
			});
        };

        factory.getEvents = function(sId) {
			return $http({
				url: '/getAttendanceList',
				method: "GET",
				params: {studentNumber: sId}
			});
        };

  		factory.deleteDatesList = function(dList, userID) {
  			return $http({
  				url: '/removeDatesList',
  				method: "POST",
  				data: {dList: dList, userID: userID}
  			});
      };

      factory.classType = function(){
        var weekday = moment().day(); // 0 - 6, 0 is Sunday and 6 is Saturday
        var classType;
        if ((weekday % 2) == 0 ) {
          classType = 'A';
        }
        else {
          classType = 'B';
        }
        return classType;
      };
      return factory;
    };



    //safe guard against minification scripts
    attendanceFactory.$inject = ['$http', '$resource', 'moment'];

    //register factory
    angular.module('attendanceFactory', []).factory('attendanceFactory', attendanceFactory);

}());