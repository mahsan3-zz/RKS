
// public/js/app.js

var app = angular.module('RKS', ['ngRoute', 'ngResource', 'appRoutes', 'StudentMembershipInfoCtrl', 'StudentsListCtrl', 'studentFactory', 'StudentsDetailsCtrl', 'CommunicationCtrl', 'communicationFactory', 'StudentsAddCtrl', 'angularFileUpload', 'securityFactory', 'EventCtrl', 'eventFactory', 'ShiftReportCtrl', 'shiftReportFactory', 'ui.bootstrap', 'mwl.calendar', 'attendanceController', 'attendanceDetailController', 'StudentsPersonalInfoDetailsCtrl', 'attendanceFactory', 'BeltCtrl', 'beltPromotionFactory', 'ReportCtrl', 'ezfb', 'EventCtrlAlt', 'BeltInfoCtrl','beltInformationFactory', 'InstructorMainCtrl', 'barCodeController', 'barcodeGenerator', 'help']);

// Configure ngResource
app.config(['$resourceProvider', function($resourceProvider) {
  // Don't strip trailing slashes from calculated URLs
  $resourceProvider.defaults.stripTrailingSlashes = false;
}]);

app.config(function(ezfbProvider){
    ezfbProvider.setLocale('en_CA');
    ezfbProvider.setInitParams({
        appId: '915595858461830',
        version    : 'v2.2'
    });
});
