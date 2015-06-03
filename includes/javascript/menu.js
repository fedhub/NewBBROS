var app = angular.module('myapp.menu', [
    'myapp.services',
    'myapp.forms'
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
    }

}]);

app.controller('menu-additions', ['$scope', '$routeParams', 'message', 'cart', 'library', 'authentication', 'date', 'customer', function($scope, $routeParams, message, cart, library, authentication, date, customer){

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
        var msg = checkSelections(additions);
        if(msg.length != 0)
            message.showMessage(msg);
        else{
            if(!authentication.isConnected()) $scope.form_request('log-in');
            else updateCart(cart, additions, library, date, customer, message);
        }
    }

}]);

function updateCart(cart, additions, library, date, customer, message){
    var cart_item_additions = [];
    $.each( $('.additions-type-container'), function(){
        var type_id = $(this).attr('id');
        var item_id_arr = [];
        $(this).find('.selected').filter(':visible').each(function(){
            item_id_arr.push($(this).parent().parent().attr('id').split('-')[2]);
        });
        for(var i = 0; i < additions.length; i++){
            if(additions[i].id == type_id){
                var items = [];
                for(var j = 0; j < item_id_arr.length; j++){
                    for(var k = 0; k < additions[i].addition_items.length; k++){
                        if(item_id_arr[j] == additions[i].addition_items[k].id){
                            items.push(additions[i].addition_items[k]);
                            break;
                        }
                    }
                }
                var temp = additions[i];
                temp.addition_items = items;
                if(items.length != 0) cart_item_additions.push(temp);
                break;
            }
        }
    });
    cart.addToCart(cart_item_additions);
    if(library.getIsLibrary()){
        var tmp_cart = cart.getMyCart();
        cart.setLibraryItem(tmp_cart[tmp_cart.length - 1]);
        cart.removeLibraryItem();
        library_item_ajax(cart, library, date, customer, message);
    }
    else{
        cart.setLock(false);
        window.location = '#/cart';
    }
}

function library_item_ajax(cart, library, date, customer, message){
    cart.calLibItemTotPrice();
    var library_item_info = {
        library_id: library.getLibraryID(),
        creation_date: date.getFullDate(),
        creation_time: date.getDefaultTime(),
        phone_number: customer.getPhoneNumber(),
        item_json: JSON.stringify(cart.getLibraryItem())
    };
    var url = base_url + '/add-library-item';
    $.ajax({
        url: url,
        type: 'POST',
        data: {data: JSON.stringify(library_item_info)}
    }).done(function(res){
        if(!res) message.showMessage('הייתה בעיה בהוספת הפריט אל ספריית ההזמנות, אנא נסה שוב מאוחר יותר');
        else{
            library.setIsLibrary(false);
            window.location = '#/library';
        }
    });
}

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

function checkSelections(additions){
    var msg = '';
    var type_id;
    var $tot_visible;
    $.each($('.additions-type-container'), function(){
        type_id = $(this).attr('id');
        $tot_visible = $(this).find('.selected').filter(':visible');
        for(var i = 0; i < additions.length; i++){
            if(type_id == additions[i].id ){
                if(additions[i].selection_type == 'required_exact' && $tot_visible.length != additions[i].selections_amount){
                    msg += 'עליך לבחור בדיוק ';
                    msg += additions[i].selections_amount + ' ';
                    msg += 'פריטים מ - ';
                    msg += '"'+additions[i].name+'"<br><br>';
                }
                if(additions[i].selection_type == 'required_min' && $tot_visible.length < additions[i].selections_amount){
                    msg += 'עליך לבחור לפחות ';
                    msg += additions[i].selections_amount + ' ';
                    msg += 'פריטים מ - ';
                    msg += '"'+additions[i].name+'"<br><br>';
                }
                break;
            }
        }
    });
    return msg;
}