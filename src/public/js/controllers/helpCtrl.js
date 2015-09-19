(function() {
	var help = function($scope, studentFactory, $location) {
		$scope.test = "Help Page!";
	};
  
	//safe guard against minification scripts
	help.$inject = ['$scope', 'studentFactory', '$location'];
	
	//register module
	angular.module('help', []).controller('help', help);
  
}());