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
                $scope.menu_item_id = menu_items[i].menu_item_id;
            })
        }
        else message.showMessage('אירעה תקלה בהבאת התפריט, אנא נסה שוב מאוחר יותר');
    });

}]);

app.controller('menu-additions', ['$scope', '$routeParams', 'message', function($scope, $routeParams, message){

    var type_id = $routeParams.menu_type_id;
    var item_id = $routeParams.menu_item_id;
    type_id = type_id.split('=');
    item_id = item_id.split('=');
    type_id = type_id[1];
    item_id = item_id[1];

    var url = base_url + '/menu-additions&'+item_id;
    $.ajax({
        type: 'POST',
        url: url
    }).done(function(menu_additions){
        // Query arguments -
        // ADDITION_TYPE: addition_type_id, addition_type_name, addition_type_description, selection_type, selections_amount
        // ADDITION_ITEM: addition_item_id, addition_item_name, addition_item_description, image, price
        // For each addition item we have the above information plus we have the food_item_id and the food_type_id
        if(menu_additions != false){

            $scope.additions = getAdditions(menu_additions);
            $scope.$apply();

            //for(var i = 0; i <  additions.length; i++){
            //    console.log(additions[i].name);
            //    for(var j = 0; j < additions[i].addition_items.length; j++){
            //        console.log('  ' + additions[i].addition_items[j].name);
            //    }
            //}

            //$scope.menu_items = menu_items;
            //$scope.$apply();
            //$.each( $('.food-items-container').find('.right-cont'), function(i) {
            //    //alert(menu_items[i].image_name);
            //    $(this).css({
            //        "background": "url('"+base_url+'/images/'+menu_items[i].image_name+"') no-repeat",
            //        "background-size": "contain",
            //        "background-position": "center center"
            //    });
            //    $scope.menu_item_id = menu_items[i].menu_item_id;
            //})
        }
        else message.showMessage('אירעה תקלה בהבאת התפריט, אנא נסה שוב מאוחר יותר');
    });

}]);

function getAdditions(menu_additions){
    var additions = [];
    var i = 0, j = 0;
    var new_addition_obj = new additionType(menu_additions[0]);
    additions.push(new_addition_obj);

    var tmpID = additions[0].id;
    for(i = 1; i <  menu_additions.length; i++){
        if(menu_additions[i].addition_type_id != tmpID){
            new_addition_obj = new additionType(menu_additions[i]);
            additions.push(new_addition_obj);
            tmpID = menu_additions[i].addition_type_id;
        }
    }

    for(i = 0; i < additions.length; i++){
        for(j = 0; j < menu_additions.length; j++){
            if(menu_additions[j].addition_type_id == additions[i].id){
                var new_addition_item = new additionItem(menu_additions[j]);
                additions[i].addition_items.push(new_addition_item);
            }
        }
    }

    return additions;
}

function additionType(type){
    this.id = type.addition_type_id;
    this.name = type.addition_type_name;
    this.description = type.addition_type_description;
    this.selection_type = type.selection_type;
    this.selections_amount = type.selections_amount;
    this.addition_items = [];
}

function additionItem(item){
    this.id = item.addition_item_id;
    this.name = item.addition_item_name;
    this.description = item.addition_item_description;
    this.image = item.image;
    this.price = item.price;
}