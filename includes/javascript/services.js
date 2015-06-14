var app = angular.module('myapp.services', []);

// Authentication
app.service('authentication', function($rootScope){

    var connected = false;
    var customer_type = '';

    this.setConnected = function(state){
        connected = state;
        if(connected) $rootScope.$broadcast('got-connected');
    };

    this.isConnected = function(){
        return connected;
    };

    this.setCustomerType = function(type){
        customer_type = type;
    };

    this.getCustomerType = function(){
        return customer_type;
    }

});

app.service('library', function(){

    var library;
    var is_library = false;

    this.setLibrary = function(lib){
        library = lib;
    };

    this.getLibrary = function(){
        return library;
    };
    this.getLibraryID = function(){
        return library.id;
    };

    this.setIsLibrary = function(state){
        is_library = state;
    };

    this.getIsLibrary = function(){
        return is_library;
    };

});

app.service('customer', ['authentication', function(authentication){

    var details = {};

    this.setDetails = function(det){
        details.first_name = det.first_name;
        details.last_name = det.last_name;
        details.phone_number = det.phone_number;
        details.email = det.email;
        details.street = det.street;
        details.house_number = det.house_number;
        details.floor = det.floor;
        details.enter = det.enter;
        if(authentication.getCustomerType() == 'business'){
            details.password = det.password;
            details.company_code = det.company_code;
            details.company_name = det.company_name;
            details.budget = det.budget;
        }
    };

    this.getDetails = function(){
        return details;
    };

    this.getCustomerName = function(){
        return details.first_name;
    };

    this.getPhoneNumber = function(){
        return details.phone_number;
    };

    this.getBudget = function(){
        return details.budget;
    };

}]);

// Messages
app.service('message', function($rootScope){

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
            $lightbox.fadeOut(function(){
                $rootScope.$broadcast('msg-done');
            });
        });
    };

    this.greetings = function(msg){
        $slider_title.html(msg);
    };

    this.getDelay = function(){
        return delay;
    };

});

// Cart
app.service('cart', ['library', function(library){

    var my_cart = [];
    var food_item = {};
    var additions = [];
    var library_item;
    var total_price = 0;
    var lock = true;

    this.resetCart = function(){
        my_cart = [];
    };

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

    this.add = function(item){
        my_cart.push(item);
    };

    // when inside library and adding item to cart
    this.updateTotalPrice = function(price){
        total_price += price;
    };

    this.calculatePrice = function(){
        var last_item = my_cart.length - 1;
        my_cart[last_item].total_price += my_cart[last_item].price;
        for(var j = 0; j < my_cart[last_item].addition_types.length; j++){
            for(var k = 0; k < my_cart[last_item].addition_types[j].addition_items.length; k++){
                my_cart[last_item].total_price += my_cart[last_item].addition_types[j].addition_items[k].price;
            }
        }
        if(!library.getIsLibrary()) total_price += my_cart[last_item].total_price;
    };

    this.calLibItemTotPrice = function(){
        library_item.total_price += library_item.price;
        for(var j = 0; j < library_item.addition_types.length; j++){
            for(var k = 0; k < library_item.addition_types[j].addition_items.length; k++){
                library_item.total_price += library_item.addition_types[j].addition_items[k].price;
            }
        }
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

    this.setLibraryItem = function(item){
        library_item = item;
    };

    this.getLibraryItem = function(){
        return library_item;
    };

    this.removeLibraryItem = function(){
        my_cart.splice((my_cart.length-1), 1);
    };

    this.setTotalPrice = function(price){
        total_price += price;
    };

    this.getTotalPrice = function(){
        return total_price;
    };

    this.getMyCart = function(){
        return my_cart;
    };

}]);

app.service('order_details', function(){

    var order_type = '';
    var payment_method = '';
    var order_time = '';

    this.setOrderType = function(type){
        order_type = type;
    };

    this.setPaymentMethod = function(method){
        payment_method = method;
    };

    this.setOrderTime = function(time){
        order_time = time;
    };

    this.getPaymentMethod = function(){
        return payment_method;
    };

    this.getOrderType = function(){
        return order_type;
    };

    this.getOrderTime = function(){
        return order_time;
    };

});

app.service('date', function(){

    var curr_date;
    var day, month, year;
    var hour, minutes, seconds;

    this.getDay = function(){
        curr_date = new Date();
        return curr_date.getDate();
    };

    this.getMonth = function(){
        curr_date = new Date();
        return (curr_date.getMonth() + 1);
    };

    this.getYear = function(){
        curr_date = new Date();
        return curr_date.getFullYear()
    };

    this.getHour = function(){
        curr_date = new Date();
        return curr_date.getHours();
    };

    this.getMinutes = function(){
        curr_date = new Date();
        return  curr_date.getMinutes();
    };

    this.getSeconds = function(){
        curr_date = new Date();
        return curr_date.getSeconds();
    };

    this.getFullDate = function(){
        curr_date = new Date();
        return curr_date.getDate()+'.'+(curr_date.getMonth()+1)+'.'+curr_date.getFullYear();
    };

    this.getDefaultTime = function(){
        curr_date = new Date();
        return curr_date.getHours()+':'+checkTime(curr_date.getMinutes());
    };

    function checkTime(i) {
        if (i < 10) {i = "0" + i}  // add zero in front of numbers < 10
        return i;
    }

});

app.service('application_settings', function(){

    this.get_working_time_msg = function(working_time){
        var msg = 'לקוח יקר, החנות סגורה כרגע, שעות הפתיחה של החנות הם בין ';
        if(working_time.open_hour < 10) msg += '0'+working_time.open_hour;
        else msg += working_time.open_hour;
        msg += ':';
        if(working_time.open_minutes < 10) msg += '0'+working_time.open_minutes;
        else msg += working_time.open_minutes;
        msg += ' - ';
        if(working_time.close_hour < 10) msg += '0'+working_time.close_hour;
        else msg += working_time.close_hour;
        msg += ':';
        if(working_time.close_minutes < 10) msg += '0'+working_time.close_minutes;
        else msg += working_time.close_minutes;
        return msg;
    };

    this.store_closed = function(working_time){
        var date = new Date();
        if(date.getHours() < working_time.open_hour) return true;
        if(date.getHours() == working_time.open_hour){
            if(date.getMinutes() < working_time.open_minutes) return true;
        }
        if(date.getHours() > working_time.close_hour) return true;
        if(date.getHours() == working_time.close_hour){
            if(date.getMinutes()  > working_time.close_minutes) return true;
        }
        return false;
    };

});













