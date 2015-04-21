var app = angular.module('myapp', []);

app.config(['$routeProvider', function($routeProvider){

    $routeProvider
        .when('/home',{
            templateUrl: 'partials/home.html',
            controller: 'main',
            resolve: { resolvedVal: function(){ return; }}}
    ).otherwise({redirectTo: '/home'});

}]);

