(function() {
    // Return $http and $resource objects to Controller
    var shiftReportFactory = function($http, $resource) {
        var factory = {};

        factory.getReports = function() {
             return $http.get('/getShiftReports/');
        };
        // ngResource was necessary and is advised for use with RESTful APIs
        factory.removeReport = function(pId) {
            return $resource('/removeShiftReport/:id', {id: '@id'});
        };

        factory.updateReport = function(newEvent){
            return $http.post('/updateShiftReport/', newEvent);
        };
        factory.createReport = function(newReport){
            return $http.post('/createShiftReport/', newReport);
        };

        return factory;
    };

    //safe guard against minification scripts
    shiftReportFactory.$inject = ['$http', '$resource'];

    //register factory
    angular.module('shiftReportFactory', []).factory('shiftReportFactory', shiftReportFactory);

}());