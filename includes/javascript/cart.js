var app = angular.module('myapp.cart', [
    'myapp.services'
]);

app.controller('cart', ['$scope', 'message', 'cart', function($scope, message, cart){

    var $info_lightbox = $('#cart-item-info');
    var $delete_lightbox = $('#delete-item');
    var $order_type_lightbox = $('#order-type');
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
        $order_type_lightbox.fadeIn();
    };
    $scope.close_order_type = function(){
        $order_type_lightbox.fadeOut();
    };
    $scope.order_time = function(){
        alert('time');
    };
    $scope.payment_method = function(){
        alert('payment_method');
    };
}]);
