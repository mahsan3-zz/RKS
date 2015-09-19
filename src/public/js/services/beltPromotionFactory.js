(function() {
    // Return $http and $resource objects to Controller
    var beltPromotionFactory = function($http, $resource) {
        var factory = {};

        factory.getPromotionsInfo = function() {
            return $http({
                url: '/getPromotionsInfo',
                method: "GET"
            });
        };

        factory.updatePromotionInfo = function(editedItem) {
            return $http({
                url: '/updatePromotionInfo',
                method: "POST",
                data: {newObj: editedItem}
            });

        };

        factory.removePromotionInfo = function(pId) {
            return $http({
                url: '/removePromotionInfo',
                method: "POST",
                data: {id: pId}
            });
        };

        factory.newPromotionsInfoItem = function(newItem) {
            return $http({
                url: '/newPromotionsInfoItem',
                method: "POST",
                data: {promoObj: newItem}
            });
        };
        return factory;
    };

    //safe guard against minification scripts
    beltPromotionFactory.$inject = ['$http', '$resource'];

    //register factory
    angular.module('beltPromotionFactory', []).factory('beltPromotionFactory', beltPromotionFactory);

}());