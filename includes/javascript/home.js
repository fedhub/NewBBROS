var app = angular.module('myapp.home', [
    'myapp.services'
]);

app.controller('home', ['$scope', 'authentication', function($scope, authentication){

    $scope.last_orders = function(){
        if(!authentication.isConnected()) $scope.form_request('log-in');
        else window.location = '#/last-orders';
    };

    $scope.make_new_order = function(){
        window.location = '#/menu-types'
    };

    $scope.orders_library = function(){
        if(!authentication.isConnected()) $scope.form_request('log-in');
        else window.location = '#/orders-library';
    };

}]);