(function() {
    var BeltController = function($scope, $routeParams, $location, beltPromotionFactory){

        $scope.promotionRuleAdd = {};
        $scope.beltPromotionRulesList = [
        ];

        ($scope.getBeltPromotionRules = function (){
            beltPromotionFactory.getPromotionsInfo()
                .success(function(results) {
                    $scope.beltPromotionRulesList = results.results;
                    console.log(results);
                })
                .error(function(data, status, headers, config){
                    $log.log(data.error + ' ' + status);
                });
        })();


        // Create post with ngModel object in data context.
        $scope.createRule = function(){
            console.log($scope.promotionRuleAdd)
            if($scope.promotionRuleAdd.bootCampClass && ($scope.promotionRuleAdd.bootCampRequired == null || $scope.promotionRuleAdd.classesRequired == null )){
              bootbox.alert("Please enter fill in number of classes and/or bootcamps.");
            }
            else if( $scope.promotionRuleAdd.weeksBetweenTips == null){
              bootbox.alert("Please enter fill in number of weeks.");
            }
            else{
              if ($scope.update) {
                  delete $scope.promotionRuleAdd.__v;

                  beltPromotionFactory.updatePromotionInfo($scope.promotionRuleAdd)
                  .success(function(){
                      $scope.getBeltPromotionRules();
                      $scope.promotionRuleAdd = {};

                  })
                  .error(function(data, status, headers, config){
                      console.log(data.error + ' ' + status);
                  });
                  $scope.clearRule();
              }
              else{
                  beltPromotionFactory.newPromotionsInfoItem($scope.promotionRuleAdd)
                  .success(function(){
                      $scope.getBeltPromotionRules();
                      $scope.promotionRuleAdd = {};

                  })
                  .error(function(data, status, headers, config){
                      console.log(data.error + ' ' + status);
                  });
              }

            }
        }

        $scope.editRule = function(item) {
            $scope.update = true;
            $scope.promotionRuleAdd = item;
        };

        $scope.deleteRule = function(pId) {
            if(pId != null){
                beltPromotionFactory.removePromotionInfo(pId)
                .success(function(){
                    $scope.getBeltPromotionRules();
                    $scope.clearRule();
                })
                .error(function(data, status, headers, config){
                    console.log(data.error + ' ' + status);
                });
            }
        }

        $scope.clearRule = function() {
            $scope.update = false;
            $scope.promotionRuleAdd = {};
        };

        $scope.beltRuleType = function(item) {
            var rule = "";
            if (item.bootCampClass) {
                rule = item.classesRequired + ' classes and ' + item.bootCampRequired + ' boot camps.';
            }
            else{
                rule = item.weeksBetweenTips + ' weeks of classes.';
            }

            return rule;
        };

    };


    //safe guard against minification scripts
    BeltController.$inject = ['$scope', '$routeParams', '$location', 'beltPromotionFactory'];

    //register module
    angular.module('BeltCtrl', []).controller('BeltController', BeltController);

}());