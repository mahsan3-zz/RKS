(function() {
  var BeltInfoCtrl = function($scope, beltInfoFactory, moment) {
    $scope.update = false;
    // $scope.studentList = [{
    //     firstName: 'Pedro', lastName: 'Bellesa', tipCount: 0, belt: "White"
    // }];
    //console.log($scope.studentList);

    $scope.getStudentsList = function(){
      beltInfoFactory.getUsersToPromote()
      .success(function(results){
        console.log(results);
        $scope.studentList = results.studentsList;
      })
      .error(function(data, status, headers, config){
        console.log("Error: " + data.error + ' ' + status);
      });
    };

    $scope.getStudentsList();


    $scope.evaluated = function(student) {

      if($scope.studentList){
              if (moment().isSame(student.tips.firstTip, 'day')
        ||moment().isSame(student.tips.secondTip, 'day')
        || moment().isSame(student.tips.thirdTip, 'day')) {
        return true;
      }
      return false;
      }

    };
    $scope.evaluateStudent = function (student, mark) {
      student.mark = mark;
      student.hid
      beltInfoFactory.updateUserBeltTips(student)
      .success(function(results){
        $scope.getStudentsList();
      })
      .error(function(data, status, headers, config){
        console.log("Error: " + data+ ' ' + status);
      });
    }
  };

  //safe guard against minification scripts
  BeltInfoCtrl.$inject = ['$scope', 'beltInformationFactory', 'moment'];

  //register module
  angular.module('BeltInfoCtrl', []).controller('BeltInformationController', BeltInfoCtrl);

}());