var app = angular.module('myapp.library', [
    'myapp.services'
]);

app.controller('library', ['$scope', '$routeParams', 'library', 'cart', 'message', 'date', function($scope, $routeParams, library, cart, message, date){


    //if(cart.getSize() > 0){
    //    console.log('cart length: ' + cart.getSize());
    //    print(cart.getMyCart());
    //}

    library.setIsLibrary(false);
    var lib = library.getLibrary();
    library_items_ajax($scope, message, lib);

    $scope.add_to_library = function(){
        library.setIsLibrary(true);
        window.location = '#/menu-types';
    };

}]);

function library_items_ajax($scope, message, lib){
    var url = base_url + '/library-items&library_id='+lib.id;
    $.ajax({
        url: url,
        type: 'POST'
    }).done(function(res){
        if(res == false) message.showMessage('הייתה בעיה בהבאת הפריטים של הספרייה, אנא נסה שוב מאוחר יותר');
        else{
            $scope.name = lib.lib_name;
            $scope.description = lib.lib_description;
            $scope.date = lib.creation_date;
            $scope.time = lib.creation_time;
            // API -- response from library_items (mobile_order_functions.js)
            //var library_item_info = {
            //    library_id: library.getLibraryID(),
            //    creation_date: date.getFullDate(),
            //    creation_time: date.getDefaultTime(),
            //    phone_number: customer.getPhoneNumber(),
            //    item_json: JSON.stringify(cart.getMyCart()) // 1 sized array
            //};
            if(res != 'empty'){
                var lib_items = [];
                for(var i = 0; i < res.length; i++){
                    res[i].item_json = JSON.parse(res[i].item_json);
                    lib_items.push(res[i].item_json[0]);
                }
                $scope.library = lib_items;
            }
            $scope.$apply();
        }
    });
}





//function print(my_cart){
//    console.log('My-cart: ');
//    for(var i = 0; i < my_cart.length; i++){
//        console.log('    id             : ' + my_cart[i].id);
//        console.log('    name           : ' + my_cart[i].name);
//        console.log('    description    : ' + my_cart[i].description);
//        console.log('    price          : ' + my_cart[i].price);
//        console.log('    total_price    : ' + my_cart[i].total_price);
//        console.log('    addition_types : ');
//        for(var j = 0; j < my_cart[i].addition_types.length; j++){
//            console.log('          id                : ' + my_cart[i].addition_types[j].id);
//            console.log('          name              : ' + my_cart[i].addition_types[j].name);
//            console.log('          description       : ' + my_cart[i].addition_types[j].description);
//            console.log('          selection_type    : ' + my_cart[i].addition_types[j].selection_type);
//            console.log('          selections_amount : ' + my_cart[i].addition_types[j].selections_amount);
//            console.log('          addition_items    : ');
//            for(var k = 0; k < my_cart[i].addition_types[j].addition_items.length; k++){
//                console.log('                id          : ' + my_cart[i].addition_types[j].addition_items[k].id);
//                console.log('                name        : ' + my_cart[i].addition_types[j].addition_items[k].name);
//                console.log('                description : ' + my_cart[i].addition_types[j].addition_items[k].description);
//                console.log('                image       : ' + my_cart[i].addition_types[j].addition_items[k].image);
//                console.log('                price       : ' + my_cart[i].addition_types[j].addition_items[k].price);
//            }
//        }
//    }
//}