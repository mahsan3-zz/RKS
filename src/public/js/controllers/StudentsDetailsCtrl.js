(function() {
    var StudentsDetailsController = function($scope, studentFactory, $routeParams){
        $scope.studentImg = 'noimage.jpg';
        //url argument extracted
        $scope.userID = $routeParams.userID;
        $scope.studentObj = {};
        $scope.tempStudentObj = {};
        
       $scope.listOfBelts = [];
      
        $scope.totalClasses = 0;
        $scope.progressBar = 0;

        $scope.nextBelt = "";
        
        // Calendar Options
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.open = function($event, toggle) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope[toggle] = true;
        };
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        // $scope.formats = ['yyyy-MM-dd'];
        $scope.format = $scope.formats[0];


        // Set editor to disabled
        $scope.editorEnabled = false;

        // If editor is enabled
        $scope.enableEditor = function() {
            console.log("studentObj before editing: ");
            console.log($scope.studentObj);

            $scope.editorEnabled = true;
        };

        // If editor is disabled
        $scope.disableEditor = function() {
            $scope.editorEnabled = false;
        };


        // Save Function
        $scope.save = function(isValid) {

            console.log("SAVE");
            console.log("studentObj Clicked save: ");
            console.log($scope.studentObj);
            if (true) { 
                $scope.studentObj = angular.copy($scope.tempStudentObj);

                console.log("studentObj after angular copy tempStudentObj: ");
                console.log( $scope.studentObj);

                studentFactory.updateStudent($scope.studentObj)
                .success(function(results) {
                    console.log('updated successfully!');
                })
                .error(function(data, status, headers, config){
                    console.log(data.error + ' ' + status);
                });
                $scope.disableEditor();
            }
            else { // FOR TESTING PURPOSES
                alert('invalid form');
            }
        };

        // Cancel Function
        $scope.cancel = function() {        
            //$scope.tempStudentObj = angular.copy($scope.studentObj);
            getStudentDetails();
            $scope.disableEditor();
        };

        function getStudentDetails(){
            studentFactory.getStudent($scope.userID)
            .success(function(results){
                $scope.studentObj = results[0];
                $scope.tempStudentObj = results[0];
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
          
          switch($scope.studentObj.membershipInfo.tip.tipCount) {
                case 0: $scope.progressBar = 0; break;
                case 1: $scope.progressBar = 25; break;
                case 2: $scope.progressBar = 50; break;
                case 3: $scope.progressBar = 75; break;
                case 4: $scope.progressBar = 100; break;
              }
          
            })
            .error(function(data, status, headers, config){
                $log.log(data.error + ' ' + status);
            });
        };

        //constructor, in a way
        getStudentDetails();

      function getAllBelts() {
          studentFactory.getAllBelts()
              .success(function(results) {
                  $scope.listOfBelts = results.bList;
            console.log($scope.listOfBelts[0]);
            console.log($scope.listOfBelts);

              })
              .error(function(data, status, headers, config){
                  console.log(data.error + ' ' + status);
              });
        };
      getAllBelts();
      
        $scope.updateStudentDetail = function() {
            studentFactory.updateStudent($scope.studentObj)
            .success(function(results){
                console.log("Student %s updated", $scope.studentObj.userID);
            })
            .error(function(data, status, headers, config){
                $log.log(data.error + ' ' + status);
            });
        };

        $scope.upload = function (file) {
            studentFactory.imageUpload(file, $scope.studentObj.photo)
            .success(function (data, status, headers, config) {
                console.log('file ' + config.file.name + 'uploaded. Response: ' +
                JSON.stringify(data));
                $scope.studentObj.photo = data.fileName;
            }).error(function(data, status, headers, config){
                console.log(data.error + ' ' + status);
            });
        };

    };

    //safe guard against minification scripts
    StudentsDetailsController.$inject = ['$scope', 'studentFactory', '$routeParams'];

    //register module
    angular.module('StudentsDetailsCtrl', []).controller('StudentsDetailsController', StudentsDetailsController);

}());