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
    }

    this.msgCloseLightbox = function(msg){
        $p.html(msg);
        $screen_message.fadeIn().delay(delay).fadeOut(function(){
            $lightbox.fadeOut();
        });
    }

    this.greetings = function(msg){
        $slider_title.html(msg);
    }

});

// Menu
app.service('menu', function(){

    var menu_types;

    this.get_menu_types = function(){
        return menu_types;
    }

    this.set_menu_types = function(types){
        menu_types = types;
    }

});













