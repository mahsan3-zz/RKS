(function() {
	var ReportController = function($scope, studentFactory, $location){
		$scope.studentsList = [];
		$scope.sortBy = 'lastName';
        $scope.reverse = false;
		$scope.selectedStudents = [];
      
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

	};
  
	//safe guard against minification scripts
	ReportController.$inject = ['$scope', 'studentFactory', '$location'];
	
	//register module
	angular.module('ReportCtrl', []).controller('ReportController', ReportController);
  
}());