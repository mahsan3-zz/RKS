 (function() {
    var EventController = function($scope, $resource, eventFactory, moment, studentFactory){
        // Property to hold list of posts.
        $scope.eventList = [];
        // $scope.newEvent = { name: "Test" , eventDate : new Date(), description: "Test", location: "Newmarket"}
        $scope.newEvent = {};

        // CALENDAR test
        var currentYear = moment().year();
        var currentMonth = moment().month();
        $scope.calendarDay = new Date();
        $scope.calendarView = "month";
        $scope.minDate = new Date();
        $scope.calendarToggle = false;
        $scope.format = 'dd-MMMM-yyyy';
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
          };
          // Disable weekend selection
          $scope.disabled = function(date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
          };

          $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
          };
          $scope.toggleMin();

          $scope.open = function($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope[opened] = true;
          };

          $scope.setCalendarToToday = function() {
              $scope.calendarDay = new Date();
            };
            $scope.setCalendarView = function(type){
                $scope.calendarView = type;
                $scope.$digest();
            };
        $scope.calendarControl = {};
        $scope.events = [];
        // Retrieve posts from context / Initialize with page load.
        //$scope.eventList.push(eventTest);
        //console.log($scope.eventList);
        ($scope.getEvents = function () {
            eventFactory.getEvents()
                .success(function(results) {
                    $scope.eventList = results.results;
                    console.log(results);
                    $scope.events = [];
                    for (var i = results.results.length - 1; i >= 0; i--) {

                        var e = { title: results.results[i].name, type:'info', starts_at: results.results[i].starts_at, ends_at: results.results[i].ends_at, editable: false, deletable: false, name: results.results[i].name, description: results.results[i].description, location: results.results[i].location, _id: results.results[i]._id };
                        $scope.events.push(e);

                    };

                })
                .error(function(data, status, headers, config){
                    $log.log(data.error + ' ' + status);
                });
        })();


        $scope.toView = function(viewEvent) {
          $scope.newEvent = viewEvent;
          $('#viewEventModal').modal(true);
        }

        $scope.clearEvent = function() {
          $scope.newEvent = {};
        }

        $scope.eventShow = function(eventDate) {
          if (moment($scope.calendarDay).isSame(eventDate, 'day') || moment($scope.calendarDay).isBefore(eventDate)) {
            return true;
          }
          else {
            return false;
          }
        }

          $scope.getCurrentUser = function() {
          studentFactory.getCurrentStudent()
            .success(function(results){
              $scope.currentUser = results.studentObj;
              if ($scope.currentUser.permission.toLowerCase() == "instructor") {
                $scope.homePage = "instructorMain";
              }
              else{
                $scope.homePage = "studentsMain";
              }
            })
            .error(function(data, status, headers, config){
              $log.log(data.error + ' ' + status);
            });
        }
        $scope.getCurrentUser();
    };
    //safe guard against minification scripts
    EventController.$inject = ['$scope', '$resource', 'eventFactory', 'moment', 'studentFactory'];

    //register module
    angular.module('EventCtrlAlt', []).controller('EventControllerAlt', EventController);
}());