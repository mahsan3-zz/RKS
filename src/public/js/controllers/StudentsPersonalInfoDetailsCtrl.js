(function() {
	var StudentsPersonalInfoController = function($scope, studentFactory, $routeParams){
		//$scope.studentImg = 'noimage.jpg';
      
		//url argument extracted
        $scope.userID = $routeParams.userID;
		$scope.studentObj = {};
        $scope.tempStudentObj = {};
   		
        // Set editor to disabled
        $scope.editorEnabled = false;

        // If editor is enabled
        $scope.enableEditor = function() {
          console.log("enable editor");  // TESTING
          $scope.editorEnabled = true;
        };

        // If editor is disabled
        $scope.disableEditor = function() {
          console.log("disable editor");  // TESTING
          $scope.editorEnabled = false;
        };

        
        // Save Function
        $scope.save = function(isValid) {
            console.log("TEMP STUDENT OBJ");
            console.log( $scope.tempStudentObj );
            $scope.studentObj = angular.copy($scope.tempStudentObj);
            console.log("STUDENT OBJ");
            console.log( $scope.studentObj);

            studentFactory.updateCurrentStudent($scope.studentObj)
				.success(function(results) {
					console.log('updated successfully!');
				   	console.log("NEW STUDENT OBJ");
				   	console.log(results);
				})
				.error(function(data, status, headers, config){
					console.log(data.error + ' ' + status);
				});
            $scope.disableEditor();
        };
      
      
      // Cancel Function
      $scope.cancel = function() {
		  	$scope.tempStudentObj = angular.copy($scope.studentObj);
        	$scope.disableEditor();
      };
      
//		function getStudentDetails(){
//			studentFactory.getStudent($scope.userID)
//				.success(function(results){
//					$scope.studentObj = results[0];
//                    $scope.tempStudentObj = results[0];
//              console.log("inside getStudentDetails:");
//              console.log($scope.studentObj);  // TESTING
//				})
//				.error(function(data, status, headers, config){
//					$log.log(data.error + ' ' + status);
//				});
//		};
      
		//constructor, in a way
		//getStudentDetails();

        function getCurrStudentDetails(){
			studentFactory.getCurrentStudent()
				.success(function(results){
					$scope.studentObj = results.studentObj;
                    $scope.tempStudentObj = results.studentObj;
              console.log("inside getCurrStudentDetails");
              console.log($scope.studentObj);  // TESTING
				})
				.error(function(data, status, headers, config){
					$log.log(data.error + ' ' + status);
				});
		};
      
		//constructor, in a way
		getCurrStudentDetails();
      

		
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
	StudentsPersonalInfoController.$inject = ['$scope', 'studentFactory', '$routeParams'];
	
	//register module
	angular.module('StudentsPersonalInfoDetailsCtrl', []).controller('StudentsPersonalInfoController', StudentsPersonalInfoController);
  
}());