var app = angular.module('myapp', [
    'myapp.header',
    'myapp.forms',
    'myapp.menu',
    'myapp.services'
]);

var base_url = 'http://localhost:3000';

app.config(['$routeProvider', function($routeProvider){

    $routeProvider
        .when('/home',{
            templateUrl: 'partials/home.html',
            resolve: { resolvedVal: function(){ return; }}}
        )
        .when('/menu-types',{
            templateUrl: 'partials/menu/menu-types.html',
            controller: 'menu-types',
            resolve: { resolvedVal: function(){ return; }}}
        )
        .when('/menu-items/:menu_type_id',{
            templateUrl: 'partials/menu/menu-items.html',
            controller: 'menu-items',
            resolve: { resolvedVal: function(){ return; }}}
        )
        .when('/menu-additions/:menu_type_id/:menu_item_id',{
            templateUrl: 'partials/menu/menu-additions.html',
            controller: 'menu-additions',
            resolve: { resolvedVal: function(){ return; }}}
         )
        .when('/cart',{
            templateUrl: 'partials/cart.html',
            resolve: { resolvedVal: function(){ return; }}}
         )
        .when('/status',{
            templateUrl: 'partials/status.html',
            resolve: { resolvedVal: function(){ return; }}}
        ).otherwise({redirectTo: '/home'});

}]);