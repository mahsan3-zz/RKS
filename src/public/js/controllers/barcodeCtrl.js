(function() {
    var barCodeController = function($scope, $routeParams, $location, beltPromotionFactory){
		$scope.barCodeValue = "";
    };
    //safe guard against minification scripts
    barCodeController.$inject = ['$scope', '$routeParams', '$location', 'beltPromotionFactory'];

    //register module
    angular.module('barCodeController', []).controller('barcodeController', barCodeController);

}());