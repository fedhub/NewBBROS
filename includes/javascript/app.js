var app = angular.module('myapp', [
    'myapp.header',
    'myapp.forms',
    'myapp.factory'
]);

var base_url = 'http://localhost:3000';

app.config(['$routeProvider', function($routeProvider){

    $routeProvider
        .when('/home',{
            templateUrl: 'partials/home.html',
            controller: 'home',
            resolve: { resolvedVal: function(){ return; }}}
        )
        .when('/menu',{
            templateUrl: 'partials/menu.html',
            controller: 'menu',
            resolve: { resolvedVal: function(){ return; }}}
        )
        .when('/cart',{
            templateUrl: 'partials/cart.html',
            controller: 'cart',
            resolve: { resolvedVal: function(){ return; }}}
         )
        .when('/status',{
            templateUrl: 'partials/status.html',
            controller: 'status',
            resolve: { resolvedVal: function(){ return; }}}
        ).otherwise({redirectTo: '/home'});

}]);

function home($scope){

}
function menu($scope){

}
function cart($scope){

}
function status($scope){

}