(function() {
	var InstructorMainCtrl = function($scope){
		$scope.test = "Intructor ctrl";
		console.log("Instructor controller active");
	};
	//safe guard against minification scripts
	InstructorMainCtrl.$inject = ['$scope'];

	//register module
	angular.module('InstructorMainCtrl', []).controller('InstructorMainCtrl', InstructorMainCtrl);
}());

