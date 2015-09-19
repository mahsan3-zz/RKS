(function() {
	var attendanceDetailController = function($scope, attendanceFactory, $routeParams) {
		$scope.attendanceList = [];
		$scope.totalClasses = 0;
		$scope.fullName = '';
		$scope.userID = $routeParams.userID;
		$scope.sortBy = 'date';
    $scope.reverse = false;
		$scope.selectedDates = [];
		$scope.update_ = false;

		$scope.editAttendance = function(item){
			$scope.attendanceAdd = item;
			$scope.update_ = true;
		};

		$scope.clearRule = function() {
          $scope.attendanceAdd = {};
            $scope.update_ = false;
        };

        $scope.belts = ["White", "Yellow", "Green", "Brown", "Purple", "Black"];
        //TEST VARIABLE FOR POPUP
        $scope.attendanceAdd = {};

        $scope.disabled = function(date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
          };

          $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
          };
          $scope.toggleMin();

          $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
          };

          $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
          };

          $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
          $scope.format = $scope.formats[0];

          //TIMEPICKER
            $scope.attendanceAdd.time = new Date();

              $scope.hstep = 1;
              $scope.mstep = 15;

              $scope.options = {
                hstep: [1, 2, 3],
                mstep: [1, 5, 10, 15, 25, 30]
              };

              $scope.ismeridian = true;
              $scope.toggleMode = function() {
                $scope.ismeridian = ! $scope.ismeridian;
              };

              $scope.update = function() {
                var d = new Date();
                d.setHours( 14 );
                d.setMinutes( 0 );
                $scope.mytime = d;
              };

              $scope.changed = function () {
                $console.log('Time changed to: ' + $scope.mytime);
              };

              $scope.clear = function() {
                $scope.mytime = null;
              };




		$scope.doSort = function(colName) {
           $scope.sortBy = colName;
           $scope.reverse = !$scope.reverse;
        };

		function getAttendanceList() {
			attendanceFactory.getEvents($scope.userID)
				.success(function(results){
					$scope.attendanceList = results.attendanceList;
					$scope.totalClasses = results.totalClasses;
					$scope.fullName = results.fullName;
					console.log(results);
				})
				.error(function(data, status, headers, config){
					console.log(data.error + ' ' + status);
				});
		};

		//constructor, in a way
		getAttendanceList();

		$scope.manageSelected = function(docID) {
			if ($scope.selectedDates.indexOf(docID) === -1) {
				$scope.selectedDates.push(docID);
			} else{
				$scope.selectedDates.splice($scope.selectedDates.indexOf(docID), 1);
				console.log("removing");
			}
		};

		$scope.deleteAttendance = function() {
			if($scope.selectedDates.length > 0) {
				bootbox.confirm("Are you sure you want to delete these dates?", function(result){
					if(result) {
						attendanceFactory.deleteDatesList($scope.selectedDates, $scope.userID)
							.success(function(data, status) {
								getAttendanceList();
								$scope.selectedDates = [];
								console.log(data);
							})
							.error(function(data, status, headers, config) {
								console.log(data.error + ' ' + status);
							});
					}
				});
			} else{
				bootbox.alert("No dates selected!");
			}
      getAttendaceList();
		};

		$scope.createAttendance = function() {
      console.log($scope.attendanceAdd + " " + $scope.userID);
			attendanceFactory.createAttendance($scope.attendanceAdd, $scope.userID)
            .success(function(){
                console.log("rekkid created");
                getAttendanceList();
                $scope.attendanceAdd = {};
            })
             .error(function(data, status, headers, config){
                console.log(data.error + ' ' + status);
            });
            // Empty post input area.

		};

		$scope.updateAttendance = function(itemId) {
      $scope.attendanceAdd.attID =  $scope.attendanceAdd._id;
			// console.log("!!!!!!attid", $scope.attendanceAdd.attID);
			attendanceFactory.updateAttendance($scope.attendanceAdd, $scope.userID)
            .success(function(){
                // console.log("rekkid updated");
                getAttendanceList();
            })
             .error(function(data, status, headers, config){
                console.log(data.error + ' ' + status);
            });
            // Empty post input area.
            $scope.attendanceAdd = {};
            $scope.update_ = false;
		};

	};

	//safe guard against minification scripts
	attendanceDetailController.$inject = ['$scope', 'attendanceFactory', '$routeParams'];

	//register module
	angular.module('attendanceDetailController', []).controller('attendanceDetailController', attendanceDetailController);

}());