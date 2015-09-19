(function() {
    // Return $http and $resource objects to Controller
    var beltInformationFactory = function($http, $resource) {
      var factory = {};

      factory.getUsersToPromote = function() {
          return $http({
              url: '/getUsersToPromote',
              method: "GET"
          });
      };

      factory.updateUserBeltTips = function(updatedItem) {
          return $http({
              url: '/updateUserBeltTips',
              method: "POST",
              data: {userID: updatedItem.userID, grantedTip: updatedItem.mark}
          });
      };

      return factory;
    };

    //safe guard against minification scripts
    beltInformationFactory.$inject = ['$http', '$resource'];

    //register factory
    angular.module('beltInformationFactory', []).factory('beltInformationFactory', beltInformationFactory);

}());