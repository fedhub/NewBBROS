var app = angular.module('myapp.order-approve', [
    'myapp.services'
]);

app.controller('order-approve', ['$scope', 'message', 'order_details', 'cart', 'date', 'customer', function($scope, message, order_details, cart, date, customer){

    var order_details_message = check_order_details();
    var order_type = '';
    var payment_method = '';
    var order_time = '';
    var curr_date = '';
    var customer_details, my_cart, total_price;

    $scope.cart_approved = function(){

        if(cart.getSize() == 0) message.showMessage('עליך להוסיף פריט לסל על מנת להמשיך');
        else if(order_details_message.length != 0) message.showMessage(order_details_message);
        else{
            init_params();
            send_ajax(JSON.stringify(get_order_info()));
        }
    };

    function send_ajax(order_info){
        var url = base_url + '';
        $.ajax({
            url: url,
            type: 'POST',
            data: {data: order_info}
        }).done(function(){

        });

    }

    function init_params(){
        order_type = order_details.getOrderType();
        payment_method = order_details.getPaymentMethod();
        order_time = order_details.getOrderTime();
        if(order_time == '') order_time = date.getDefaultTime();
        curr_date = date.getFullDate();
        customer_details = JSON.stringify(customer.getDetails());
        total_price = cart.getTotalPrice();
        my_cart = JSON.stringify(cart.getMyCart());
    }

    function get_order_info(){
        return {
            order_type: order_type,
            payment_method: payment_method,
            order_time: order_time,
            order_date: curr_date,
            customer_details: customer_details,
            total_price: total_price,
            my_cart: my_cart
        };
    }

    function check_order_details(){
        var msg = '';
        if(order_details.getOrderType() == '')
            msg += 'אנא בחר סוג הזמנה. ';
        if(order_details.getPaymentMethod() == '')
            msg += 'אנא בחר אמצעי תשלום. ';
        return msg;
    }

}]);
