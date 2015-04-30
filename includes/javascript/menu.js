var app = angular.module('myapp.menu', [
    'myapp.services'
]);

app.controller('menu-types', ['$scope', 'message', function($scope, message){

    var url = base_url + '/menu-types';
    $.ajax({
        type: 'POST',
        url: url
    }).done(function(menu_types){
        // Query arguments - id, name, image_name
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

app.controller('menu-items', ['$scope', '$routeParams', 'message', 'cart', function($scope, $routeParams, message, cart){

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

    $scope.selected = function(menu_item){
        cart.foodItem(menu_item);
        cart.printFoodItem();
    }

}]);

app.controller('menu-additions', ['$scope', '$routeParams', 'message', 'cart', function($scope, $routeParams, message, cart){

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
            var additions = getAdditions(menu_additions);
            $scope.additions = additions;
            $scope.$apply();
            $.each( $('.menu-additions-wrapper').find('.image'), function(i) {
                //alert(menu_items[i].image_name);
                $(this).css({
                    "background": "url('"+base_url+'/images/'+menu_additions[i].image+"') no-repeat",
                    "background-size": "contain",
                    "background-position": "center center"
                });
                //$scope.addition_item_id = menu_additions[i].addition_item_id;
            });
            cart.setAdditions(additions);
        }
        else message.showMessage('אירעה תקלה בהבאת התפריט, אנא נסה שוב מאוחר יותר');
    });

    $scope.selected = function(type_id, item_id){
        var additions = cart.getAdditions();
        handleItemsSelections(additions,type_id,item_id, message);
    };

    $scope.approve = function(additions){

        var $tot_visible = $('.menu-additions-wrapper .selected').filter(':visible');
        var type_id;
        var item_id;

        $.each($('.additions-type-container'), function(){
            type_id = $(this).attr('id');
            console.log(type_id);
        });

        //$.each($tot_visible, function(){
        //    item_id = $(this).parent().parent().attr('id');
        //    item_id = item_id.split('-')[2];
        //    type_id = $(this).parent().parent().parent().attr('id');
        //    console.log('type_id: '+type_id);
        //    console.log('item_id: '+item_id);
        //});

        //var selection_type;
        //var selections_amount;
        //for(var i = 0; i < additions.length; i++){
        //    if(additions[i].id == type_id){
        //        selection_type = additions[i].selection_type;
        //        selections_amount = additions[i].selections_amount;
        //        break;
        //    }
        //}
    }

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

function handleItemsSelections(additions, type_id, item_id, message){
    var duration = 400;
    var selection_type = '';
    var selections_amount;
    var $length = $('.additions-type-container#'+type_id+' .selected:visible').length;
    var $tot_selected = $('.additions-type-container#'+type_id+' .selected');
    for(var i = 0; i < additions.length; i++){
        if(additions[i].id == type_id){
            selection_type = additions[i].selection_type;
            selections_amount = additions[i].selections_amount;
            break;
        }
    }
    var type_name = additions[i].name;
    item_id = 'addition-item-'+item_id;
    var $selected = $('#'+item_id).find('.selected');
    if(selection_type == 'required_exact'){
        required_exact_handler(duration, selections_amount, $length, $selected, $tot_selected, message, type_name);
    }
    if(selection_type == 'optional_max'){
        optional_max_handler(duration, selections_amount, $length, $selected, message, type_name);
    }
    if(selection_type == 'required_min'){
        required_min_handler(duration, $length, $selected);
    }

}

function required_min_handler(duration, $length, $selected){
    var clicked = true;
    if (!$selected.is(':visible')) {
        $selected.fadeIn(duration);
        $length++;
        clicked = false;
    }
    if (clicked && $selected.is(':visible')) {
        $selected.fadeOut(duration);
        $length--;
    }
}

function optional_max_handler(duration, selections_amount, $length, $selected, message, type_name){
    var clicked = true;
    if($length < selections_amount){
        if (!$selected.is(':visible')) {
            $selected.fadeIn(duration);
            $length++;
        }
        else{
            $selected.fadeOut(duration);
            $length--;
        }
        clicked = false;
    }
    if(clicked && $length == selections_amount){
        if (!$selected.is(':visible')) {
            var msg = 'באפשרותך לבחור עד ';
            msg += selections_amount;
            msg += ' פריטים מ - ';
            msg += '"'+type_name+'"';
            msg += ' באפשרותך לבטל בחירה אחרת';
            message.showMessage(msg);
        }
        else{
            $selected.fadeOut(duration);
            $length--;
        }
    }
}

function required_exact_handler(duration, selections_amount, $length, $selected, $tot_selected, message, type_name){
    var clicked = true;
    if(selections_amount == 1) {
        if ($length < selections_amount) {
            if (!$selected.is(':visible')) {
                $selected.fadeIn(duration);
                $length++;
            }
        }
        if ($length == selections_amount) {
            if (!$selected.is(':visible')) {
                $tot_selected.fadeOut(duration);
                $selected.fadeIn(duration);
            }
        }
    }
    if(selections_amount > 1){
        if ($length < selections_amount) {
            if (!$selected.is(':visible')) {
                $selected.fadeIn(duration);
                $length++;
                clicked = false;
            }
            if (clicked && $selected.is(':visible')) {
                $selected.fadeOut(duration);
                $length--;
            }
        }
        if($length == selections_amount){
            if (!$selected.is(':visible')) {
                var msg = 'עליך לבחור בדיוק ';
                msg += selections_amount;
                msg += ' פריטים מ - ';
                msg += '"'+type_name+'"';
                msg += ' באפשרותך לבטל בחירה אחרת';
                message.showMessage(msg);
                clicked = false;
            }
            if(clicked && $selected.is(':visible')){
                $selected.fadeOut();
                $length--;
            }
        }
    }
}