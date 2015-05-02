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

    var my_cart = [];
    var food_item = {};
    var additions = [];
    var total_price = 0;
    var lock = true;

    this.getSize = function(){
        return my_cart.length;
    };

    this.setLock = function(state){
        lock = state;
    };

    this.getLock = function(){
        return lock;
    };

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

    function foodItem(item){
        this.id = item.id;
        this.name = item.name;
        this.description = item.description;
        this.price = item.price;
        this.total_price = 0;
        this.addition_types = [];
    }

    this.addToCart = function(adds){
        food_item.addition_types = adds;
        my_cart.push(food_item);
    };

    this.calculatePrice = function(){
        var last_item = my_cart.length - 1;
        my_cart[last_item].total_price += my_cart[last_item].price;
        for(var j = 0; j < my_cart[last_item].addition_types.length; j++){
            for(var k = 0; k < my_cart[last_item].addition_types[j].addition_items.length; k++){
                my_cart[last_item].total_price += my_cart[last_item].addition_types[j].addition_items[k].price;
            }
        }
        total_price += my_cart[last_item].total_price;
    };

    this.print = function(){
        for(var i = 0; i < my_cart.length; i++){
            console.log(my_cart[i].name);
            for(var j = 0; j < my_cart[i].addition_types.length; j++){
                console.log(my_cart[i].addition_types[j].name);
                for(var k = 0; k < my_cart[i].addition_types[j].addition_items.length; k++){
                    console.log(my_cart[i].addition_types[j].addition_items[k].name);
                }
            }
        }
    };

    this.deleteItem = function(item_id){
        for(var i = 0; i < my_cart.length; i++){
            if(my_cart[i].id == item_id){
                total_price -= my_cart[i].total_price;
                my_cart.splice(i,1);
                break;
            }
        }
    };

    this.getTotalPrice = function(){
        return total_price;
    };

    this.getMyCart = function(){
        return my_cart;
    };

});













