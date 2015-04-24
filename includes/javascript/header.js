var app = angular.module('myapp.header', []);

app.controller('header', function($scope){

    $scope.title = 'ראשי';
    $scope.setTitle = function(title){
        $scope.title = title;
    }

    var counter = 1;
    $scope.slideMenu = function(){
        //e.preventDefault();
        var $body = $('.body');
        var $mobile_menu_container = $('.mobile-menu-container');
        var $container = $('.hamburger .container');
        var transitionEnd = 'transitionend webkitTransitionEnd otransitionend MSTransitionEnd';

        if(counter % 2 == 1) {
            if($container.hasClass('rotate-left'))
                $container.removeClass('rotate-left');
            $container.toggleClass('rotate-right');
            counter = 0;
        }
        else {
            if(counter % 2 == 0) {
                if($container.hasClass('rotate-right'))
                    $container.removeClass('rotate-right');
                $container.toggleClass('rotate-left');
                counter = 1;
            }
        }

        $mobile_menu_container.toggleClass('right');

        $container.on(transitionEnd, function() {
            $container.off(transitionEnd);
        });

        $mobile_menu_container.on(transitionEnd, function(){
            $body.removeClass('right');
            $mobile_menu_container.off(transitionEnd);
        });
    }

});