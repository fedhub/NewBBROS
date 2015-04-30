var app = angular.module('myapp.services', []);

// Authentication
app.service('authentication', function(){

    var connected = false;
    var connected_type = '';

    this.setConnected = function(state){
        connected = state;
    }

    this.isConnected = function(){
        return connected;
    };

    this.getConnectedType = function(){
        return connected_type;
    }

});

// Messages
app.service('message', function(){

    var $screen_message = $('#screen-message');
    var $p = $screen_message.find('p');
    var delay = 2000;
    var $lightbox = $('#lightbox');
    var $slider_title = $('.mobile-menu-container .connected p:nth-child(2)');

    this.showMessage = function(msg){
        $p.html(msg);
        $screen_message.fadeIn().delay(delay).fadeOut();
    };

    this.msgCloseLightbox = function(msg){
        $p.html(msg);
        $screen_message.fadeIn().delay(delay).fadeOut(function(){
            $lightbox.fadeOut();
        });
    };

    this.greetings = function(msg){
        $slider_title.html(msg);
    }

});

// Cart
app.service('cart', function(){

    //var my_cart = [];
    //var total_price = 0;
    var food_item = {};
    var additions = [];

    //this.resetCart = function(){
    //    my_cart = [];
    //};

    this.setAdditions = function(adds){
        additions = [];
        additions = adds;
    };

    this.getAdditions = function(){
      return additions;
    };

    this.foodItem = function(item) {
        food_item = {};
        food_item = new foodItem(item);
    };

    this.printFoodItem = function(){
        console.log(food_item.id);
        console.log(food_item.name);
        console.log(food_item.price);
        console.log(food_item.description);
    }

    function foodItem(item){
        this.id = item.id;
        this.name = item.name;
        this.description = item.description;
        this.price = item.price;
        this.addition_types = [];
    }

    //this.getTmpFoodItem = function(){
    //    return tmp_food_item;
    //};
    //
    //this.addFoodItem = function(new_food_item){
    //    var food_item = new foodItem(new_food_item);
    //    my_cart.push(food_item);
    //};
    //
    //this.addAdditionType = function(name){
    //    var addition_type = new additionType(name);
    //    my_cart[my_cart.length-1].addition_types.push(addition_type);
    //};
    //
    //this.addAdditionItem = function(new_addition_item){
    //    var addition_item = new additionItem(new_addition_item);
    //    var length = my_cart[my_cart.length-1].addition_types.length;
    //    my_cart[my_cart.length-1].addition_types[length-1].push(addition_item);
    //};
    //
    //function additionType(){
    //    this.name = name;
    //    this.items = [];
    //}
    //
    //function additionItem(new_addition_item){
    //    this.id = new_addition_item.addition_item_id;
    //    this.name = new_addition_item.addition_item_name;
    //    this.description = new_addition_item.description;
    //    this.price = new_addition_item.price;
    //}

});













