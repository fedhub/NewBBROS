var app = angular.module('myapp.orders-library', [
    'myapp.services'
]);

app.controller('orders-library', ['$scope', 'cart', 'message', 'library', 'date', 'customer', function($scope, cart, message, library, date, customer){

    var $add_library_lightbox = $('#add_library');

    get_libraries_ajax($scope, message, customer.getPhoneNumber());

    $scope.add_to_cart = function(){
        alert('add to cart');
    };
    $scope.edit_library_details = function(){
        alert('edit cart details');
    };
    $scope.delete_library = function(){
        alert('delete from cart');
    };

    $scope.enter_library = function(lib){
        library.setLibrary(lib);
        window.location = '#/library';
    };

    // open the new library lightbox
    $scope.add_library = function(){
        $add_library_lightbox.fadeIn();
    };

    // close the new library lightbox
    $scope.close_add_library = function(){
        $add_library_lightbox.fadeOut();
    };

    // clicks ok to add the new library
    $scope.approve_library = function(){
        var $lib_name = $('#library_name input').val();
        var $lib_description = $('#library_description textarea').val();
        if($lib_name.length == 0) message.showMessage('עליך לתת שם לספריה');
        else{
            var lib_details = new_lib_json(customer.getPhoneNumber(), $lib_name, $lib_description, date.getFullDate(), date.getDefaultTime());
            new_lib_ajax($scope, lib_details, message);
            $add_library_lightbox.fadeOut();
        }
    };

}]);

function get_libraries_ajax($scope, message, phone_number){
    var url = base_url + '/get-libraries&phone_number='+phone_number;
    $.ajax({
        url: url,
        type: 'POST'
    }).done(function(res){
        if(res == false) message.showMessage('הייתה בעיה בהבאת הספריות שלך, אנא נסה שוב מאוחר יותר');
        else if(res != 'empty'){
            $scope.libraries = res;
            $scope.$apply();
        }
    });
}

function new_lib_ajax($scope, lib_details, message){
    var url = base_url + '/new-library';
    $.ajax({
        url: url,
        type: 'POST',
        data: {data: JSON.stringify(lib_details)}
    }).done(function(res){
        if(res == false) message.showMessage('הייתה בעיה ביצירת הספריה החדשה, אנא נסה שוב מאוחר יותר');
        else{
            $scope.libraries = res;
            $scope.$apply();
        }
    });
}

function new_lib_json(phone_number, lib_name, lib_desc, date, time){
    return {
        phone_number: phone_number,
        lib_name: lib_name,
        lib_description: lib_desc,
        creation_date: date,
        creation_time: time
    }
}