(function() {
    var ShiftReportController = function($scope, $filter, $resource, shiftReportFactory, studentFactory){
        // Property to hold list of posts.
        $scope.reportList = [];
        $scope.update = false;
        $scope.selectedReports = [];

        $scope.getCurrentUser = function() {
          studentFactory.getCurrentStudent()
            .success(function(results){
              $scope.currentUser = results.studentObj;
              if ($scope.currentUser.permission.toLowerCase() == "admin") {
                $scope.homePage = "adminMain";
              }
              else{
                $scope.homePage = "instructorMain";
              }
            })
            .error(function(data, status, headers, config){
              $log.log(data.error + ' ' + status);
            });
        }
        $scope.getCurrentUser();

        // Retrieve posts from context / Initialize with page load.
        ($scope.getReports = function (){
            shiftReportFactory.getReports()
                .success(function(results) {
                  if ($scope.currentUser.permission.toLowerCase() == "admin") {
                    $scope.reportList = results.results;
                  }
                  else {
                    $scope.reportList = $filter('filter')(results.results, {reportAuthor: $scope.currentUser.firstName + ' ' + $scope.currentUser.lastName});
                  }
                })
                .error(function(data, status, headers, config){
                    $log.log(data.error + ' ' + status);
                });
        })();

        // Create post with ngModel object in data context.
        $scope.createReport = function(){
            if ($scope.newReport== null) {
                bootbox.alert("Please fill all fields.");
            }
            else {

                if($scope.update == false) {
                  $scope.newReport.reportAuthor = $scope.currentUser.firstName + ' ' + $scope.currentUser.lastName;
                    shiftReportFactory.createReport($scope.newReport)
                        .success(function(){
                            $scope.getReports();
                        })
                        .error(function(data, status, headers, config){
                            console.log(data.error + ' ' + status);
                        });
                    // Empty post input area.
                    $scope.newReport = {};
                }
                else{

                    shiftReportFactory.updateReport($scope.newReport)
                    .success(function(){
                        $scope.getReports();
                        $scope.update = false;
                        console.log("edited");
                    })
                    .error(function(data, status, headers, config){
                        console.log(data.error + ' ' + status);
                    });
                }
            }
        }

        // Delete post from data context using passed item id.
        $scope.deleteReport = function(){
            bootbox.confirm("Are you sure you want to delete the report(s)?", function(result){
                if(result){
                    var deleted = shiftReportFactory.removeReport();

                    for( i = 0 ; i < $scope.selectedReports.length; i++){
                        deleted.delete({id: $scope.selectedReports[i]._id},
                        function(successResult){
                            console.log("Success (Deleted)");
                            $scope.getReports();
                        },
                        function(errorResult){
                            console.log("Error: " + errorResult);
                        });
                    }
                }

            });

        }

        $scope.viewReportDetail = function(report){
            console.log(report);
            $scope.viewReport = report;
        }
        $scope.addReport = function (){
          $scope.modalTitle = "Create Report";
          $scope.modalButton = "Add";
        };
        $scope.editReport = function(report){
            $scope.modalTitle = "Edit Report";
            $scope.modalButton = "Save";
            $scope.newReport = {};
            $scope.newReport = report;
            $scope.update = true;
        }

        $scope.addSelectedReport = function(){
          $scope.selectedReports = $filter('filter')($scope.reportList, {checked: true});
        }


        $scope.validate = function() {
          if(editAddForm.title.$invalid && editAddForm.description.$invalid){
            $scope.errorMessage = "Please fill in all the fields."
          }
          else{
            console.log("NO ERROR \n");
            $scope.errorMessage = null;
            $scope.createReport();
          }

        }
    };
    //safe guard against minification scripts
    ShiftReportController.$inject = ['$scope', '$filter', '$resource', 'shiftReportFactory', 'studentFactory'];

    //register module
    angular.module('ShiftReportCtrl', []).controller('ShiftReportController', ShiftReportController);
}());