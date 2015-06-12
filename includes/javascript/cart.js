var app = angular.module('myapp.cart', [
    'myapp.services'
]);

app.controller('cart', ['$scope', 'message', 'cart', 'order_details', 'date', function($scope, message, cart, order_details, date){

    var $info_lightbox = $('#cart-item-info');
    var $delete_lightbox = $('#delete-item');
    var $order_type_lightbox = $('#order-type');
    var $payment_method_lightbox = $('#payment-method');
    var $order_time_lightbox = $('#order-time');
    $scope.total_price = cart.getTotalPrice();
    var cart_size = cart.getSize();
    if(cart_size > 0){
        $('.cart-size').css('display','block');
        $('.cart-size p').html(cart_size);
        if(!cart.getLock()) cart.calculatePrice();
        $scope.cart_items = cart.getMyCart();
        $scope.total_price = cart.getTotalPrice();
        cart.setLock(true);
    }
    else{
        $('.cart-size').css('display','none');
    }
    $scope.info = function(item){
        $info_lightbox.fadeIn();
        $scope.item = item;
    };
    $scope.close_info = function(){
        $info_lightbox.fadeOut();
    };
    $scope.delete_item = function(item){
        $delete_lightbox.fadeIn();
        $scope.del_item = item;
    };
    $scope.close_delete_window = function(){
        $delete_lightbox.fadeOut();
    };
    $scope.deletion_approved = function(item){
        cart.deleteItem(item.id);
        $scope.total_price = cart.getTotalPrice();
        cart_size = cart.getSize();
        if(cart_size > 0){
            $('.cart-size').css('display','block');
            $('.cart-size p').html(cart_size);
        }
        else{
            $('.cart-size').css('display','none');
        }
        $delete_lightbox.fadeOut();
    };
    $scope.order_type = function(){
        $scope.order_types = [
            {class: "flaticon-free6", text: "משלוח", id: "delivery"},
            {class: "flaticon-box37", text: "לקחת", id: "take-away"},
            {class: "flaticon-two200", text: "לשבת", id: "sit"}
        ];
        $order_type_lightbox.fadeIn();
    };
    $scope.payment_method = function(){
        $scope.payment_methods = [
            {class: "flaticon-currency19", text: "מזומן", id: "cash"},
            {class: "flaticon-credit31", text: "אשראי", id: "credit"}
        ];
        $payment_method_lightbox.fadeIn();
    };
    var lock = 0;
    $scope.order_time = function(){
        $order_time_lightbox.fadeIn();
        order_time_handler($scope, date, ++lock);
    };
    $scope.order_type_selected = function(order_type){
        order_type_validation(order_type, order_details, $order_type_lightbox, message);
    };
    $scope.payment_method_selected = function(payment_method){
        order_details.setPaymentMethod(payment_method);
        $payment_method_lightbox.fadeOut();
    };
    $scope.order_time_selected = function(){
        var hour = $('#hours').val();
        var minute = $('#minutes').val();
        var due_time = hour+':'+minute;
        order_details.setOrderTime(due_time);
        $order_time_lightbox.fadeOut();
    };
    $scope.close_order_type = function(){
        $order_type_lightbox.fadeOut();
    };
    $scope.close_payment_method = function(){
        $payment_method_lightbox.fadeOut();
    };
    $scope.close_order_time = function(){
        $order_time_lightbox.fadeOut();
    };
}]);

function order_type_validation(order_type, order_details, $order_type_lightbox, message){
    var url = base_url + '/get-order-type-settings';
    $.ajax({
        url: url,
        type: 'POST'
    }).done(function(res){
        if(!res.status) message.showMessage(res.msg);
        else is_order_type_allowed(res.result, order_type, order_details, $order_type_lightbox, message);
    });
}

function is_order_type_allowed(res, order_type, order_details, $order_type_lightbox, message){
    var msg = '';
    if(order_type == 'delivery'){
        if(res.delivery_allowed){
            order_details.setOrderType(order_type);
            $order_type_lightbox.fadeOut();
        }
        else {
            msg = 'לקוחות יקרים, זמנית לא ניתן לבצע משלוחים, עמכם הסליחה';
            message.showMessage(msg);
        }
    }
    if(order_type == 'sit'){
        if(res.sit_allowed){
            order_details.setOrderType(order_type);
            $order_type_lightbox.fadeOut();
        }
        else {
            msg = 'לקוחות יקרים, זמנית לא ניתן לבצע הזמנות לשבת, עמכם הסליחה';
            message.showMessage(msg);
        }
    }
    if(order_type == 'take-away'){
        if(res.take_away_allowed){
            order_details.setOrderType(order_type);
            $order_type_lightbox.fadeOut();
        }
        else{
            msg = 'לקוחות יקרים, זמנית לא ניתן לבצע הזמנות לקחת, עמכם הזליחה';
            message.showMessage(msg);
        }
    }
}

function round5(x) {
    return Math.ceil(x/5)*5;
}

function order_time_handler($scope, date, lock){
    var first_hour_mins = [];
    var rest_hours_mins = [];
    var close_time = 23;
    var hours = [];
    var start_min = round5(date.getMinutes());
    var i = 0;
    for(i = start_min; i <= 55; i+=5){
        first_hour_mins.push(checkTime(i));
    }
    for(i = 0; i <= 55; i+=5){
        rest_hours_mins.push(checkTime(i));
    }
    var hour = date.getHour();
    var not_in_range = false;
    if(hour > close_time || hour < 9) {
        hour = 9;
        not_in_range = true;
    }
    for(i = hour; i <= close_time; i++){
        hours.push(checkTime(i));
    }
    if(date.getMinutes() > 55){
        hours.splice(0,1);
        $scope.minutes = rest_hours_mins;
    }
    else{
        if(not_in_range) $scope.minutes = rest_hours_mins;
        else $scope.minutes = first_hour_mins;
    }
    $scope.hours = hours;
    if(lock == 1){
        $('#hours option:nth-last-of-type(1)').remove();
    }
    $scope.checkHour = function(selected){
        if(selected == date.getHour()){
            $scope.minutes = first_hour_mins;
        }
        else{
            $scope.minutes = rest_hours_mins;
            $('#minutes').val('0');
        }
    };
}

function checkTime(i) {
    if (i < 10) {i = "0" + i}  // add zero in front of numbers < 10
    return i;
}