(function() {

	var studentFactory = function($http, $upload) {
        var factory = {};
        
        factory.getStudents = function() {
             return $http.get('/studentsList');
        };
		
		factory.deleteStudentsList = function(sList) {
			return $http({
				url: '/deleteStudents',
				method: "POST",
				data: {sList: sList}
			});
		};
		
		//need to pass params in case of GET to retrieve at nodejs end
		factory.getStudent = function(sId) {
			return $http({
				url: '/getStudent',
				method: "GET",
				params: {studentNumber: sId}
			});
		};
		
        factory.getAllBelts = function() {
            return $http({
                url: '/getAllBelts', 
                method: "GET"
			});
        };
        
		//need to pass params in case of GET to retrieve at nodejs end
		factory.getNextBelt = function(belt) {
			return $http({
				url: '/getNextBelt',
				method: "GET",
				params: {currentBelt: belt}
			});
		};
      		
		//need to pass params in case of GET to retrieve at nodejs end
		factory.getCurrentStudent = function() {
			return $http({
				url: '/getCurrentStudent',
				method: "GET"
			});
		};

      
		factory.updateStudent = function(studentObj) {
			return $http({
				url: '/updateStudent',
				method: "POST",
				data: {studentObj: studentObj}
			});
		};
		
		factory.updateCurrentStudent = function(studentObj) {
			return $http({
				url: '/updateCurrentStudent',
				method: "POST",
				data: {studentObj: studentObj}
			});
		};
		factory.createNewStudent = function(studentObj) {
			return $http({
				url: '/createNewStudent',
				method: "POST",
				data: {studentObj: studentObj}
			});
		};
		
		//courtesy of https://github.com/danialfarid/angular-file-upload
		factory.imageUpload = function(files, currentPhoto) {
			if (files && files.length) {
				var file = files[0];
				return $upload.upload({
					url: '/upload',
					fields: {
						'currentPhoto': currentPhoto
					},
					file: file
				}).progress(function (evt) {
					var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
					console.log('progress: ' + progressPercentage + '% ' +
								evt.config.file.name);
				});
			}
		};

        return factory;
    };

    //safe guard against minification scripts
    studentFactory.$inject = ['$http', '$upload'];
  
	//register factory
    angular.module('studentFactory', []).factory('studentFactory', studentFactory);

}());