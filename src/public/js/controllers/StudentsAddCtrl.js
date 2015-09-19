(function() {
	var StudentsAddController = function($scope, studentFactory, $routeParams, $location){
		$scope.studentImg = 'noimage.jpg';
		$scope.inValidEmail = false;
        // userID should be generated and passed into here            // UNCOMMENT THIS AFTER DELETE ABOVE
        //$scope.userID = $routeParams.userID;

      $scope.listOfBelts = [];
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
//      $scope.formats = ['yyyy-MM-dd'];
      $scope.format = $scope.formats[0];

		$scope.parent1 = {};
		$scope.tempParent1 = {};
		$scope.parent2 = {};
		$scope.tempParent2 = {};
		/*
		{
			contactOrder: String,
			firstName: String,
			lastName: String,
			relation: String,
			email: String,
			phoneNumbers: {
				homePhone: String,
				cellPhone: String,
				other: String
			},
			address: {
				street: String,
				city: String,
				postalCode: String,
				province: String
			}
    	}
		*/

		$scope.studentObj = {};
        $scope.tempStudentObj = {};

        $scope.tempStudentObj.userId = $scope.userID;

        console.log("Before clicking add: "); // DELETE - FOR TESTING PURPOSE
        console.log($scope.tempStudentObj);   // DELETE - FOR TESTING PURPOSE


        // Set default dates
        $scope.tempStudentObj.membershipDate = new Date();
        //$scope.tempStudentObj.membershipDate = { type: Date, default: Date.now };
      //{ type: Date, default: Date.now }

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
      

        // function to submit the form after all validation has occurred
        $scope.addStudent = function(isValid) {
			$scope.tempStudentObj.photo = $scope.studentImg;
//            alert("Inside addStudent(isValid) "); // FOR TESTING PURPOSES
            console.log("After click add: ");     // DELETE - FOR TESTING PURPOSE
            console.log($scope.tempStudentObj);   // DELETE - FOR TESTING PURPOSE

          
          console.log("CHECK THE DATE!! ");
          console.log($scope.tempStudentObj.dateOfBirth);
          
            // check to make sure the form is completely valid

            if (true) {
              // Form is valid, copy data from temp object to studentObj
              	$scope.studentObj = angular.copy($scope.tempStudentObj);
              // TODO: Add new student to DB
				studentFactory.createNewStudent($scope.studentObj)
					.success(function(results) {
						if(results.error) {
							console.log(results.error);
							$scope.inValidEmail = true;
						} else {
							$location.path( "/adminStudentsList");
						}
					})
					.error(function(data, status, headers, config){
						console.log(data.error + ' ' + status);
					});
            }
            else { // FOR TESTING PURPOSES
				alert('invalid form');
            }
        };

        $scope.cancelAddStudent = function() {
          $location.path( "/adminStudentsList" );
        };


		$scope.upload = function (file) {
			studentFactory.imageUpload(file, $scope.studentImg)
				.success(function (data, status, headers, config) {
					console.log('file ' + config.file.name + 'uploaded. Response: ' +
								JSON.stringify(data));
					$scope.studentImg = data.fileName;
				}).error(function(data, status, headers, config){
					console.log(data.error + ' ' + status);
				});
		};

    };


	//safe guard against minification scripts
	StudentsAddController.$inject = ['$scope', 'studentFactory', '$routeParams', '$location'];

	//register module
	angular.module('StudentsAddCtrl', []).controller('StudentsAddController', StudentsAddController);

}());