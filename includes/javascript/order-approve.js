var app = angular.module('myapp.order-approve', [
    'myapp.services'
]);

app.controller('order-approve', ['$scope', 'message', 'order_details', 'cart', 'date', 'customer', 'authentication', 'application_settings', function($scope, message, order_details, cart, date, customer, authentication, application_settings){

    var order_details_message;
    var order_type = '';
    var payment_method = '';
    var order_time = '';
    var curr_date = '';
    var customer_details, my_cart, total_price;
    var order_hour, order_minutes;

    $scope.cart_approved = function(){
        var url = base_url + '/get-working-hours';
        $.ajax({
            url: url,
            type: 'POST'
        }).done(function(res){
            if(!res.status) message.showMessage(res.msg);
            else{
                var msg = '';
                if(application_settings.store_closed(res.working_time)){
                    msg = application_settings.get_working_time_msg(res.working_time);
                    message.showMessage(msg);
                }
                else{
                    if(authentication.getCustomerType() == 'business' && cart.getSize() > 0 && cart.getTotalPrice() > customer.getBudget()){
                        console.log('here');
                        msg = 'שלום ';
                        msg += customer.getCustomerName() + ', ';
                        msg += 'יתרתך הנוכחית: ';
                        msg += customer.getBudget() + 'ש"ח' + ' ';
                        msg += 'נמוכה ממחיר ההזמנה, אנא פנה למנהל החברה שלך או למנהל המסעדה על מנת להפקיד לחשבונך, תודה.';
                        message.showMessage(msg);
                    }
                    else{
                        order_details_message = check_order_details();
                        if(cart.getSize() == 0) message.showMessage('עליך להוסיף פריט לסל על מנת להמשיך');
                        else if(order_details_message.length != 0) message.showMessage(order_details_message);
                        else{
                            init_params();
                            send_ajax(JSON.stringify(get_order_info()));
                        }
                    }
                }
            }
        });
    };

    function send_ajax(order_info){
        var url = base_url + '/make-order';
        $.ajax({
            url: url,
            type: 'POST',
            data: {data: order_info}
        }).done(function(res){
            if(res){
                if(authentication.getCustomerType() == 'business') update_business_budget();
                else console.log('true');
            }
            else console.log('false');
        });
    }

    function update_business_budget(){
        var url = base_url + '/decrease-from-budget';
        var info = {
            phone_number: customer.getPhoneNumber(),
            new_budget: customer.getBudget()-cart.getTotalPrice()
        };
        $.ajax({
            url: url,
            type: 'POST',
            data: {data: JSON.stringify(info)}
        }).done(function(res){
            if(res) console.log('true-business');
            else console.log('false');
        });
    }

    function init_params(){
        order_type = order_details.getOrderType();
        payment_method = order_details.getPaymentMethod();
        order_time = order_details.getOrderTime();
        if(order_time == ''){
            order_time = date.getDefaultTime();
            order_hour = date.getHour();
            order_minutes = date.getMinutes();
        }
        else{
            var time_params = order_time.split(':');
            order_hour = time_params[0];
            order_minutes = time_params[1];
        }
        curr_date = date.getFullDate();
        customer_details = JSON.stringify(customer.getDetails());
        total_price = cart.getTotalPrice();
        my_cart = JSON.stringify(cart.getMyCart());
    }

    function get_order_info(){
        return {
            order_type: order_type,
            customer_type: authentication.getCustomerType(),
            payment_method: payment_method,
            order_time: order_time,
            order_hour: order_hour,
            order_minutes: order_minutes,
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
        if(authentication.getCustomerType() == 'private' && order_details.getPaymentMethod() == '')
            msg += 'אנא בחר אמצעי תשלום. ';
        return msg;
    }

}]);
