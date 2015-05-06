var app = angular.module('myapp.last-orders', [
    'myapp.services'
]);

app.controller('last-orders', ['$scope', 'customer', 'cart', function($scope, customer, cart){

    var customer_details = customer.getDetails();
    var url = base_url + '/last-orders&phone_number='+customer_details.phone_number;
    var $info_lightbox = $('#cart-item-info');

    $.ajax({
        url: url,
        type: 'POST'
    }).done(function(res){ // array of order_json (text)
        if(res == false){
            console.log('false');
        }
        else {
            resHandler($scope, res);
        }
    });

    $scope.info = function(item){
        $info_lightbox.fadeIn();
        $scope.item = item;
    };

    $scope.close_info = function(){
        $info_lightbox.fadeOut();
    };

    $scope.add_to_cart = function(order_info){
        var tot_price = 0;
        for(var i = 0; i < order_info.my_cart.length; i++){
            tot_price += order_info.my_cart[i].total_price;
            cart.addFromLastOrders(order_info.my_cart[i]);
        }
        cart.setTotalPrice(tot_price);
        window.location = '#/cart';
    };

}]);

// gets array of order_json (text)
function resHandler($scope, res){
    var last_orders = [];
    for(var i = 0; i < res.length; i ++){
        var order_info = JSON.parse(res[i].order_json);
        order_info.customer_details = JSON.parse(order_info.customer_details);
        order_info.my_cart = JSON.parse(order_info.my_cart);
        last_orders.push(order_info);
    }
    $scope.last_orders = last_orders;
    $scope.$apply();
}

function print(order_info){
    console.log('Order-type: ' + order_info.order_type);
    console.log('Payment-method: ' + order_info.payment_method);
    console.log('Order-time: ' + order_info.order_time);
    console.log('Date: ' + order_info.order_date);
    console.log('Customer-details: ');
    console.log('                  first_name   : ' + order_info.customer_details.first_name);
    console.log('                  last_name    : ' + order_info.customer_details.last_name);
    console.log('                  phone_number : ' + order_info.customer_details.phone_number);
    console.log('                  email        : ' + order_info.customer_details.email);
    console.log('                  street       : ' + order_info.customer_details.street);
    console.log('                  house_number : ' + order_info.customer_details.house_number);
    console.log('                  floor        : ' + order_info.customer_details.floor);
    console.log('                  enter        : ' + order_info.customer_details.enter);
    console.log('Cart-total-price: ' + order_info.total_price);
    console.log('My-cart: ');
    for(var i = 0; i < order_info.my_cart.length; i++){
        console.log('    id             : ' + order_info.my_cart[i].id);
        console.log('    name           : ' + order_info.my_cart[i].name);
        console.log('    description    : ' + order_info.my_cart[i].description);
        console.log('    price          : ' + order_info.my_cart[i].price);
        console.log('    total_price    : ' + order_info.my_cart[i].total_price);
        console.log('    addition_types : ');
        for(var j = 0; j < order_info.my_cart[i].addition_types.length; j++){
            console.log('          id                : ' + order_info.my_cart[i].addition_types[j].id);
            console.log('          name              : ' + order_info.my_cart[i].addition_types[j].name);
            console.log('          description       : ' + order_info.my_cart[i].addition_types[j].description);
            console.log('          selection_type    : ' + order_info.my_cart[i].addition_types[j].selection_type);
            console.log('          selections_amount : ' + order_info.my_cart[i].addition_types[j].selections_amount);
            console.log('          addition_items    : ');
            for(var k = 0; k < order_info.my_cart[i].addition_types[j].addition_items.length; k++){
                console.log('                id          : ' + order_info.my_cart[i].addition_types[j].addition_items[k].id);
                console.log('                name        : ' + order_info.my_cart[i].addition_types[j].addition_items[k].name);
                console.log('                description : ' + order_info.my_cart[i].addition_types[j].addition_items[k].description);
                console.log('                image       : ' + order_info.my_cart[i].addition_types[j].addition_items[k].image);
                console.log('                price       : ' + order_info.my_cart[i].addition_types[j].addition_items[k].price);
            }
        }
    }
}