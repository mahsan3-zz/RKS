(function() {
	var attendanceController = function($scope, studentFactory, $routeParams, attendanceFactory, $timeout){

		$scope.studentsList = [];
		$scope.sortBy = 'lastName';
        $scope.reverse = false;
		$scope.selectedStudents = [];
		//$scope.tagline = 'To the moon and back!!!!';

		//Get students list from database
		function getStudents() {
			studentFactory.getStudents()
				.success(function(results) {
					$scope.studentsList = results.results;
				})
				.error(function(data, status, headers, config){
					console.log(data.error + ' ' + status);
				});
		};
		//constructor, in a way
		getStudents();

        $scope.doSort = function(colName) {
           $scope.sortBy = colName;
           $scope.reverse = !$scope.reverse;
        };

		$scope.manageSelected = function(userID) {
			if ($scope.selectedStudents.indexOf(userID) === -1){
				$scope.selectedStudents.push(userID);
			} else{
				$scope.selectedStudents.splice($scope.selectedStudents.indexOf(userID), 1);
				console.log("removing");
			}
		};

		$scope.deleteStudents = function() {
			if($scope.selectedStudents.length > 0) {
				bootbox.confirm("Are you sure you want to delete these students?", function(result){
					if(result){
						studentFactory.deleteStudentsList($scope.selectedStudents)
							.success(function(data, status) {
								getStudents();
								$scope.selectedStudents = [];
								console.log(data);
							})
							.error(function(data, status, headers, config) {
								console.log(data.error + ' ' + status);
							});
					}
				});
			} else{
				bootbox.alert("No students selected!");
			}
		};

        $scope.addStudent = function() {
          $location.path( "/adminStudentsAdd" );
        };

    // ATTENDANCE SCANNER

    $scope.scanner = {};

    $scope.getStudent = function(id) {
      studentFactory.getStudent(id)
        .success(function(student){
          $scope.scannedStudent = student[0];
          $scope.addAttendance($scope.scannedStudent);
        })
        .error(function(error, status, headers, config) {
          console.log(error + ' ' + status);
        });
    }

    $scope.addAttendance = function(student){
      var newAttendance = {
        date: new Date(),
        time: new Date().getTime(),
        type: attendanceFactory.classType() // MUST CHANGE THIS
      }

      attendanceFactory.createAttendance(newAttendance, student.userID)
        .success(function(){
            console.log("rekkid created");
            $timeout(function(){
              $scope.scanner.userID = "";
              $scope.scannedStudent = null;
            }, 3000);

        })
         .error(function(data, status, headers, config){
            console.log(data.error + ' ' + status);
        });
    }

    $scope.$watch('scan.userID.$valid',function(newValue,oldvalue) {
        if(newValue) {
            $scope.getStudent($scope.scanner.userID);
            //Can do a ajax model submit.
        }

    });
	};

	//safe guard against minification scripts
	attendanceController.$inject = ['$scope', 'studentFactory', '$routeParams', 'attendanceFactory', '$timeout'];

	//register module
	angular.module('attendanceController', []).controller('attendanceController', attendanceController);

}());