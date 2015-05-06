var app = angular.module('myapp.orders-library', [
    'myapp.services'
]);

app.controller('orders-library', ['$scope', 'cart', 'message', 'library', function($scope, cart, message, library){

    var $add_library_lightbox = $('#add_library');

    $scope.add_to_cart = function(){
        alert('add to cart');
    };
    $scope.edit_library_details = function(){
        alert('edit cart details');
    };
    $scope.delete_library = function(){
        alert('delete from cart');
    };
    $scope.enter_library = function(){
        alert('enter library');
    };
    $scope.add_library = function(){
        $add_library_lightbox.fadeIn();
    };
    $scope.close_add_library = function(){
        $add_library_lightbox.fadeOut();
    };
    $scope.approve_library = function(){
        var $library_name = $('#library_name input').val();
        var $library_description = $('#library_description textarea').val();
        if($library_name.length == 0) message.showMessage('עליך לתת שם לספריה');
        else{
            library.setIsNewLibrary(true);
            library.setNewLibraryName($library_name);
            library.setNewLibraryDescription($library_description);
            $add_library_lightbox.fadeOut(function(){
                window.location = "#/library";
            });
        }
    };

}]);