(function() {
	var StudentMembershipInfoController = function($scope, studentFactory, beltPromotionFactory, $routeParams, communicationFactory){
              // COMMUNICATIONS
       $scope.communicationList = [];

       ($scope.getCommunications = function(){
        communicationFactory.getStudentCommunications()
          .success(function(results) {
              $scope.communicationList = results.results;
              console.log(results);
          })
          .error(function(data, status, headers, config){
              $log.log(data.error + ' ' + status);
          });
       })();


        //$scope.studentsList = ["name1", "name2"];

        //url argument extracted
        $scope.userID = $routeParams.userID;
        $scope.studentObj = {};
        $scope.beltPromotionObj = [];

        $scope.totalClasses = 0;
        $scope.progressBar = 0;

        //$scope.testDate = {};
        //$scope.newDayOfWeek = [];

      // if tipCount = 0, tiptwo tip3 dates 0, etc etc.....
        $scope.tipA = 5;
        $scope.tipB = 3;
        $scope.bootCampDays = 1;

        $scope.tipOneA = 1;
        $scope.tipOneB = 2;
        $scope.tipOneBootCamp = 3;

        $scope.tipTwoA = 3;
        $scope.tipTwoB = 2;
        $scope.tipTwoBootCamp = 1;

        $scope.tipThreeA = 2;
        $scope.tipThreeB = 4;
        $scope.tipThreeBootCamp = 6;

        $scope.nextBelt = "";

        function getPromotionsInfo() {
          beltPromotionFactory.getPromotionsInfo()
              .success(function(results){
                  $scope.beltPromotionObj = results;
                  console.log("success getPromotionsInfo");
                  console.log($scope.beltPromotionObj);
              })
              .error(function(data, status, headers, config){
                  $log.log(data.error + ' ' + status);
              });
		};

      getPromotionsInfo();


        function getCurrStudentDetails(){
			studentFactory.getCurrentStudent()
				.success(function(results) {
					$scope.studentObj = results.studentObj;
                    $scope.tempStudentObj = results.studentObj;
                    $scope.totalClasses = $scope.studentObj.membershipInfo.attendanceDates.length;
				//Get next belt
				console.log('CURRENT BELT IS ');
				console.log($scope.studentObj.membershipInfo.belt);
				studentFactory.getNextBelt($scope.studentObj.membershipInfo.belt)
					.success(function(results) {
						console.log('+++++++++++++++++++++');
						console.log(results);
						$scope.studentObj.membershipInfo.nextBelt = results.nextBelt.belt;
					})
					.error(function(data, status, headers, config){
						console.log(data.error + ' ' + status);
					});
              console.log("classes: " + $scope.totalClasses);
              console.log("CurrentBelt: " + $scope.studentObj.membershipInfo.belt);

              console.log("TipOneDate: " + $scope.studentObj.membershipInfo.tip.firstTip);
              console.log("TipTwoDate: " + $scope.studentObj.membershipInfo.tip.secondTip);
              console.log("TipThreeDate: " + $scope.studentObj.membershipInfo.tip.thirdTip);
              console.log("ExamDate: " + $scope.studentObj.membershipInfo.tip.examDate);


              console.log("NextBelt: " + $scope.studentObj.membershipInfo);

              // Calculating and displaying attendance A or B days....
//              $scope.testDate = $scope.studentObj.membershipInfo.attendanceDates;
//              console.log("attendance dates: " + $scope.testDate[0].type );
//              console.log("attendance dates: " + $scope.testDate[1].type );
//              console.log("attendance dates: " + $scope.testDate[2].type );
              // Need to change type to A/B instead of belt type

              // A days: Mon, Tue, Fri
              // B days: Wed, Thu, Sat
              // Day of the week sun-sat 0-6
              /*
              for( x in $scope.testDate ) {
                console.log("attendance dates " + x + " : " + $scope.testDate[x].date);
                var d = new Date($scope.testDate[x].date);
                //var n = d.getDay();
                $scope.newDayOfWeek.push(d);
              }
              console.log($scope.newDayOfWeek);
              */

              // Check whether attendance date is A or B day, and add to count
              /*
              for( x in $scope.newDayOfWeek ) {
                console.log("get day: " + $scope.newDayOfWeek.getDay() );
                // how to use the filter?? $filter($scope.newDayOfWeek).('EEE')
                switch( $scope.newDayOfWeek ) {
                    case "Sun": break;
                    case "Mon": $scope.tipOneA++; break;
                    case "Tue": $scope.tipOneA++; break;
                    case "Wed": $scope.tipOneB++; break;
                    case "Thu": $scope.tipOneB++; break;
                    case "Fri": $scope.tipOneA++; break;
                    case "Sat": $scope.tipOneB++; break;
                }
              }
              */



              // Tip 1 Date: $scope.studentObj.membershipInfo.tip.firstTip
              // Need to get #A days, #B days, and BootCamp days for 1st TIP

              // Tip 2 Date: $scope.studentObj.membershipInfo.tip.secondTip
              // Need to get #A days, #B days, and BootCamp days for 2nd TIP

              // Tip 3 Date: $scope.studentObj.membershipInfo.tip.thirdTip
              // Need to get #A days, #B days, and BootCamp days for 3rd TIP

              // Belt Date #A days = total above, #B days = total above, BootCamp days = total above

              // For testing purposes:
              //$scope.studentObj.membershipInfo.tip.tipCount = 3; // DELETE THIS LINE

              switch($scope.studentObj.membershipInfo.tip.tipCount) {
                case 0: $scope.progressBar = 0; break;
                case 1: $scope.progressBar = 25; break;
                case 2: $scope.progressBar = 50; break;
                case 3: $scope.progressBar = 75; break;
                case 4: $scope.progressBar = 100; break;
              }



              console.log("inside getCurrStudentDetails");
              console.log($scope.studentObj);  // TESTING
				})
				.error(function(data, status, headers, config){
					$log.log(data.error + ' ' + status);
				});


		};

		//constructor, in a way
		getCurrStudentDetails();

	};
	//safe guard against minification scripts
	StudentMembershipInfoController.$inject = ['$scope', 'studentFactory', 'beltPromotionFactory', '$routeParams', 'communicationFactory'];

	//register module
	angular.module('StudentMembershipInfoCtrl', []).controller('StudentMembershipInfoController', StudentMembershipInfoController);
}());