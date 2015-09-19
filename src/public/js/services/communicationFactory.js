(function() {
    // Return $http and $resource objects to Controller
    var communicationFactory = function($http, $resource) {
        var factory = {};

        factory.getCommunications = function() {
             return $http.get('/getCommunications/');
        };
        factory.getStudentCommunications = function() {
             return $http.get('/getStudentCommunications/');
        };
        // ngResource was necessary and is advised for use with RESTful APIs
        factory.removeCommunication = function(pId) {
            return $resource('/removeCommunication/:id', {id: '@id'});
        };

        factory.updateCommunication = function(post){
            return $http.post('/updateCommunication/', post);
        };
        factory.createCommunication = function(post){
            return $http.post('/createCommunication', post);
        };

        factory.sendMail = function(post){
            return $http.post('/sendMail', post);
        };

		factory.tweetTime = function(post) {
			return $http({
				url: '/postTweet',
				method: "POST",
				data: {post: post}
			});
        };

        return factory;
    };

    //safe guard against minification scripts
    communicationFactory.$inject = ['$http', '$resource'];

    //register factory
    angular.module('communicationFactory', []).factory('communicationFactory', communicationFactory);

}());