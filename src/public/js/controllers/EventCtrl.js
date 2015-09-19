(function() {
    var EventController = function($scope, $resource, eventFactory, moment){
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

                        var e = { title: results.results[i].name, type:'info', starts_at: results.results[i].starts_at, ends_at: results.results[i].ends_at, editable: true, deletable: true, name: results.results[i].name, description: results.results[i].description, location: results.results[i].location, _id: results.results[i]._id };
                        $scope.events.push(e);

                    };

                })
                .error(function(data, status, headers, config){
                    $log.log(data.error + ' ' + status);
                });
        })();

        // Create post with ngModel object in data context.
        $scope.saveEvent = function(){
            if ($scope.newEvent== null || $scope.newEvent.description == null) {
                bootbox.alert("Please fill in required fields.");
            }
            else {
                if ($scope.beingCreated) {
                    eventFactory.createEvent($scope.newEvent)
                    .success(function(){
                        $scope.getEvents();
                    })
                    .error(function(data, status, headers, config){
                        console.log(data.error + ' ' + status);
                    });
                // Empty post input area.
                $scope.newEvent = "";
                }
                else{
                    var edited = eventFactory.updateEvent($scope.newEvent)
                    .success(function(){
                        $scope.getEvents();
                        console.log("edited");
                    })
                    .error(function(data, status, headers, config){
                        console.log(data.error + ' ' + status);
                    });
                }

            }
        }
        $scope.toCreate = function(){
            $scope.newEvent = {};
            $scope.newEvent.modalTitle = "Create Event"
            $scope.beingCreated = true;
            $('#eventModal').on('shown.bs.modal', function () {
                $('#editSubject').focus();
            });
        }

        // Send ngRepeat object to modal edit object for editting.
        $scope.toEdit = function(editEvent){
            console.log(editEvent);
            $scope.newEvent.modalTitle = "Edit Event"
            $scope.newEvent._id = editEvent._id;
            $scope.newEvent.name = editEvent.name;
            $scope.newEvent.description = editEvent.description;
            $scope.newEvent.location = editEvent.location;
            $scope.newEvent.starts_at = editEvent.starts_at;
            $scope.newEvent.ends_at = editEvent.ends_at;
            $scope.beingCreated = false;
            $('#eventModal').modal(true);
            $('#editModal').on('shown.bs.modal', function () {
                $('#editSubject').focus();
            });

        }

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
        // Delete post from data context using passed item id.
        $scope.deleteEvent = function(pId){
            bootbox.confirm("Are you sure you want to delete this event?", function(result){
                if(result){
                    var deleted = eventFactory.removeEvent();
                    console.log(deleted);
                    deleted.delete({id: pId},
                        function(successResult){
                            console.log("Success (Deleted) ");
                            $scope.getEvents();
                        },
                        function(errorResult){
                            console.log("Error: " + errorResult);
                        }
                    );
                }
            });

        }

    };
    //safe guard against minification scripts
    EventController.$inject = ['$scope', '$resource', 'eventFactory', 'moment'];

    //register module
    angular.module('EventCtrl', []).controller('EventController', EventController);
}());