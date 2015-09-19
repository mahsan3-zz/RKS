(function() {
    // Return $http and $resource objects to Controller
    var eventFactory = function($http, $resource) {
        var factory = {};

        factory.getEvents = function() {
             return $http.get('/getEvents/');
        };
        // ngResource was necessary and is advised for use with RESTful APIs
        factory.removeEvent = function(pId) {
            return $resource('/removeEvent/:id', {id: '@id'});
        };

        factory.updateEvent = function(newEvent){
            return $http.post('/updateEvent/', newEvent);
        };
        factory.createEvent = function(newEvent){
            return $http.post('/createEvent', newEvent);
        };

        return factory;
    };

    //safe guard against minification scripts
    eventFactory.$inject = ['$http', '$resource'];

    //register factory
    angular.module('eventFactory', []).factory('eventFactory', eventFactory);

}());