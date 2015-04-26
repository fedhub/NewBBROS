var app = angular.module('myapp.menu', [
    'myapp.services'
]);

app.controller('menu-types', ['$scope', 'message', function($scope, message){

    var url = base_url + '/menu-types';
    $.ajax({
        type: 'POST',
        url: url
    }).done(function(menu_types){
        if(menu_types != false){
            $scope.menu_types = menu_types;
            $scope.$apply();
            $.each( $('.food-types-container').find('.container'), function(i) {
                $(this).css({
                    "background": "url('"+base_url+'/images/'+menu_types[i].image_name+"') no-repeat",
                    "background-size": "contain",
                    "background-position": "center center"
                });
            })
        }
        else message.showMessage('אירעה תקלה בהבאת התפריט, אנא נסה שוב מאוחר יותר');
    });

}]);

app.controller('menu-items', ['$scope', '$routeParams', 'message', function($scope, $routeParams, message){

    var id = $routeParams.menu_type_id;
    id = id.split('=');
    id = id[1];

    var url = base_url + '/menu-items&'+id;
    $.ajax({
        type: 'POST',
        url: url
    }).done(function(menu_items){
        if(menu_items != false){
            $scope.menu_items = menu_items;
            $scope.$apply();
            $.each( $('.food-items-container').find('.right-cont'), function(i) {
                //alert(menu_items[i].image_name);
                $(this).css({
                    "background": "url('"+base_url+'/images/'+menu_items[i].image_name+"') no-repeat",
                    "background-size": "contain",
                    "background-position": "center center"
                });
            })
        }
        else message.showMessage('אירעה תקלה בהבאת התפריט, אנא נסה שוב מאוחר יותר');
    });

}]);