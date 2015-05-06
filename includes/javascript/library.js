var app = angular.module('myapp.library', [
    'myapp.services'
]);

app.controller('library', ['$scope', 'library', 'date', function($scope, library, date){

    $scope.name = library.getNewLibraryName();
    $scope.description = library.getNewLibraryDescription();
    $scope.date = date.getFullDate();
    $scope.time = date.getDefaultTime();

}]);