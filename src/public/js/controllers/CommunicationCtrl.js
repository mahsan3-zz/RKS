(function() {
    var CommunicationController = function($scope, $resource, $window, $location, communicationFactory, ezfb, studentFactory){

        // Property to hold list of posts.
        $scope.communicationList = [];

        // Retrieve posts from context / Initialize with page load.
        ($scope.getCommunication = function (){
            communicationFactory.getCommunications()
                .success(function(results) {
                    $scope.communicationList = results.results;
                })
                .error(function(data, status, headers, config){
                    $log.log(data.error + ' ' + status);
                });
        })();

        $scope.getCurrentUser = function() {
          studentFactory.getCurrentStudent()
            .success(function(results){
              $scope.currentUser = results.studentObj;
            })
            .error(function(data, status, headers, config){
              $log.log(data.error + ' ' + status);
            });
        }
        $scope.getCurrentUser();

        // Create post with ngModel object in data context.
        $scope.createPost = function(){
            if ($scope.post== null || $scope.post.content == null) {
                bootbox.alert("Please fill in required fields.");
            }
            else if($scope.post.socialMedia == null){
                bootbox.alert("Please check one communication media.");
            }
            else {
                if ($scope.post.socialMedia.facebook) {
                    $scope.share();
                }
                if ($scope.post.socialMedia.email) {
                    communicationFactory.sendMail($scope.post)
                        .success(function(){
                            console.log("Email sent");
                        })
                        .error(function(data, status, headers, config){
                            console.log(data.error + ' ' + status);
                        })
                }
				if($scope.post.socialMedia.twitter) {
                    communicationFactory.tweetTime($scope.post)
                        .success(function(){
                            console.log("Tweet pushed");
                        })
                        .error(function(data, status, headers, config){
                            console.log(data.error + ' ' + status);
                        })
				}
                $scope.post.author = $scope.currentUser.firstName + ' ' + $scope.currentUser.lastName;
                communicationFactory.createCommunication($scope.post)
                    .success(function(){
                        $scope.getCommunication();
                    })
                    .error(function(data, status, headers, config){
                        console.log(data.error + ' ' + status);
                    });
                // Empty post input area.
                $scope.post = "";
            }
        }

        // Send ngRepeat object to modal edit object for editting.
        $scope.toEdit = function(post){
            $scope.edit = post;
            $('#editModal').on('shown.bs.modal', function () {
                $('#editSubject').focus();
            });
        }

        // Edit post in data context.
        $scope.editPost = function(){
            var edited = communicationFactory.updateCommunication($scope.edit)
            .success(function(){
                $scope.getCommunication();
                console.log("edited");
            })
            .error(function(data, status, headers, config){
                console.log(data.error + ' ' + status);
            });
        }

        // Delete post from data context using passed item id.
        $scope.deletePost = function(pId){
            bootbox.confirm("Are you sure you want to delete this post?", function(result){
                if(result){
                    var deleted = communicationFactory.removeCommunication();
                    console.log(deleted);
                    deleted.delete({id: pId},
                        function(successResult){
                            console.log("Success (Deleted) ");
                            $scope.getCommunication();
                        },
                        function(errorResult){
                            console.log("Error: " + errorResult);
                        }
                    );
                }
            });

        }


        // FACEBOOK MODULE (ezfb)
            updateLoginStatus(updateApiMe);
          /**
           * Update loginStatus result
           */
          function updateLoginStatus (more) {
            ezfb.getLoginStatus(function (res) {
              $scope.loginStatus = res;

              (more || angular.noop)();
            });
          }
          $scope.login = function () {
            /**
             * Calling FB.login with required permissions specified
             * https://developers.facebook.com/docs/reference/javascript/FB.login/v2.0
             */
            ezfb.login(function (res) {
              /**
               * no manual $scope.$apply, I got that handled
               */
              if (res.authResponse) {
                updateLoginStatus(updateApiMe);
              }
            }, {scope: 'email,user_likes, manage_pages, publish_actions'});
          };
          $scope.logout = function () {
            /**
             * Calling FB.logout
             * https://developers.facebook.com/docs/reference/javascript/FB.logout
             */
            ezfb.logout(function () {
              updateLoginStatus(updateApiMe);
            });
          };
          $scope.share = function () {

            ezfb.api(
                "/1638302279722926/feed",
                "POST",
                {
                    "access_token": $scope.apiMe.access_token,
                    "message": $scope.post.subject + "\n\n" + $scope.post.content
                },
                function (response) {
                  if (response && !response.error) {
                    console.log(response);
                  }
                  console.log(response.error);
                }
            );
          };
          /**
           * Update api('/me') result
           */
          function updateApiMe () {
            ezfb.api('/me/accounts', function (res) {
                console.log(res);
                if (res && !res.error) {
                  $scope.apiMe = res.data[0]; // Get Page Info
                };

            });
          }
    };
    //safe guard against minification scripts
    CommunicationController.$inject = ['$scope', '$resource','$window', '$location', 'communicationFactory', 'ezfb', 'studentFactory'];

    //register module
    angular.module('CommunicationCtrl', []).controller('CommunicationController', CommunicationController);
}());