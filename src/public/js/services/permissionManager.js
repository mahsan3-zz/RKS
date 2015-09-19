//permissionManager.js
(function() {
    var securityFactory = function($http, $q) {
        var factory = {};
        
        factory.isAdmin = function() {
			var deferred = $q.defer();
			
			return $http.get('/loggedin').then(function(response) {
				return {role: response.data.role};
				// success handler
			}, function(error) {
				console.log("ERROR");
				deferred.reject(error);
				// error handler
			});
        };
		
        factory.isInstructor = function() {
			var deferred = $q.defer();
			
			return $http.get('/loggedin').then(function(response) {
				return {role: response.data.role};
				// success handler
			}, function(error) {
				console.log("ERROR");
				deferred.reject(error);
				// error handler
			});
        };
        
        return factory;
    };

    securityFactory.$inject = ['$http', '$q'];
    angular.module('securityFactory', []).factory('securityFactory', securityFactory);

}());