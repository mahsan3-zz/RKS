(function() {
	var StudentsListController = function($scope, studentFactory, $location){
		$scope.studentsList = [];
		$scope.sortBy = 'lastName';
        $scope.reverse = false;
		$scope.selectedStudents = [];
		//$scope.tagline = 'To the moon and back!!!!';
		
		//Get students list from database
		function getStudents(){
			studentFactory.getStudents()
				.success(function(results) {
					$scope.studentsList = results.results;
				})
				.error(function(data, status, headers, config){
					$log.log(data.error + ' ' + status);
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

	};
  
	//safe guard against minification scripts
	StudentsListController.$inject = ['$scope', 'studentFactory', '$location'];
	
	//register module
	angular.module('StudentsListCtrl', []).controller('StudentsListController', StudentsListController);
  
}());