var app = angular.module('myapp.forms', [
    'myapp.factory'
]);

app.directive('forms', function(){

    // GLOBALS
    var $lightbox = $('#lightbox'), $first_name='', $last_name='', $phone_number='', $email='',
        $street='', $house_number='', $floor='', $enter='', $screen_message = $('#screen-message');

    return {
        controller: function($scope) {
            $scope.signed_up = 'לא מחובר';
            $scope.form_request = function(form_type){
                form_request($scope, form_type);
                $scope.form_approved = function(){
                    form_approved(form_type);
                };
            };
        }
    };

    function form_request($scope, form_type){
        $lightbox.fadeIn();
        if(form_type == 'sign-up') $scope.title = 'הרשמה';
        if(form_type == 'log-in') $scope.title = 'התחברות';
        if(form_type == 'log-out') $scope.title = 'התנתקות';
        $scope.form_items = form_items(form_type);
    }

    function form_approved(form_type){
        set_globals(form_type);
        $screen_message = $('#screen-message');
        var error = error_msg(form_type);
        if(error.length > 0){
            $screen_message.find('p').html(error);
            $screen_message.fadeIn().delay(2000).fadeOut();
        }
        else{
            ajax_handler(form_type);
        }
    }

    function ajax_handler(form_type){
        var customer_details = get_customer_details(form_type);
        var url = base_url;
        if(form_type == 'sign-up') url += '/sign-up';
        if(form_type == 'log-in') url += '/log-in';
        $.ajax({
            type: 'POST',
            url: url,
            data : {data : JSON.stringify(customer_details)}
        }).done(function(res){
            ajax_response(res, form_type);
        });
    }

    function ajax_response(res, form_type){
        if(form_type == 'sign-up') {
            if (res) {
                $screen_message.find('p').html('ההרשמה בוצעה בהצלחה');
                $screen_message.fadeIn().delay(2000).fadeOut(function () {
                    $lightbox.fadeOut();
                });
                $('.mobile-menu-container .connected p:nth-child(2)').html('שלום ' + $first_name);
            }
            else {
                $screen_message.find('p').html('מספר הטלפון שהוזן כבר רשום במערכת');
                $screen_message.fadeIn().delay(2000).fadeOut();
            }
        }
        if(form_type == 'log-in'){
            if(res == 'phone-not-exist'){
                $screen_message.find('p').html('מספר הטלפון שהוזן אינו רשום במערכת');
                $screen_message.fadeIn().delay(2000).fadeOut();
            }
            if(res == 'name-not-match'){
                $screen_message.find('p').html('ייתכן והשם הפרטי שהוזן לא הוזן כראוי מאחר ולא נמצאה התאמה למספר הטלפון, אנא נסה שוב');
                $screen_message.fadeIn().delay(2000).fadeOut();
            }
            if(res == 'success'){
                $screen_message.find('p').html('ההתחברות הושלמה');
                $screen_message.fadeIn().delay(2000).fadeOut(function () {
                    $lightbox.fadeOut();
                });
                $('.mobile-menu-container .connected p:nth-child(2)').html('שלום ' + $first_name);
            }
        }
    }

    function set_globals(form_type){
        if(form_type == 'sign-up' || form_type == 'log-in') {
            $first_name   = $('#first-name input').val();
            $phone_number = $('#phone-number input').val();
        }
        if(form_type == 'sign-up'){
            $last_name    = $('#last-name input').val();
            $email        = $('#email input').val();
            $street       = $('#street input').val();
            $house_number = $('#house-number input').val();
            $floor        = $('#floor input').val();
            $enter        = $('#enter input').val();
        }
    }

    function error_msg(form_type){
        var error = '';
        if(form_type == 'sign-up' || form_type == 'log-in'){
            if($first_name.length == 0) error += 'הזן שם פרטי. ';
            if($('#first-name .validation p').hasClass('flaticon-cancel4')) error += 'שם פרטי לא תקין. ';
            if($phone_number.length == 0) error += 'הזן מספר טלפון. ';
            if($phone_number.length > 0 && $phone_number.length < 10) error += 'הזן מספר טלפון בן 10 ספרות. ';
            if($('#phone-number .validation p').hasClass('flaticon-cancel4')) error += 'מספר טלפון לא תקין. ';
        }
        if(form_type == 'sign-up'){
            if($last_name.length == 0) error += 'הזן שם משפחה. ';
            if($('#last-name .validation p').hasClass('flaticon-cancel4')) error += 'שם משפחה לא תקין. ';
            if($email.length > 0 && $('#email .validation p').hasClass('flaticon-cancel4')) error += 'כתובת דוא"ל לא תקינה. ';
            if($street.length == 0) error += 'הזן רחוב. ';
            if($('#street .validation p').hasClass('flaticon-cancel4')) error += 'שם הרחוב לא תקין. ';
            if($house_number.length == 0) error += 'הזן מספר בית. ';
            if($('#house-number .validation p').hasClass('flaticon-cancel4')) error += 'מספר בית לא תקין. ';
            if($floor.length == 0) error += 'הזן קומה. ';
            if($floor.length > 0 && $('#floor .validation p').hasClass('flaticon-cancel4')) error += 'קומה לא תקינה. ';
            if($enter.length > 0 && $('#enter .validation p').hasClass('flaticon-cancel4')) error += 'כניסה לא תקינה. ';
        }
        return error;
    }

    function form_items(form_type){
        var form_items = [];
        if(form_type == 'sign-up') {
            form_items = [
                {required: '*', label: 'שם פרטי:', max_length: 20, id: 'first-name'},
                {required: '*', label: 'שם משפחה:', max_length: 20, id: 'last-name'},
                {required: '*', label: 'טלפון:', max_length: 10, id: 'phone-number'},
                {required: '', label: 'דוא"ל:', max_length: 50, id: 'email'},
                {required: '*', label: 'רחוב:', max_length: 20, id: 'street'},
                {required: '*', label: 'מספר בית:', max_length: 3, id: 'house-number'},
                {required: '*', label: 'קומה:', max_length: 2, id: 'floor'},
                {required: '', label: 'כניסה', max_length: 1, id: 'enter'}
            ];
        }
        if(form_type == 'log-in') {
            form_items = [
                {required: '*', label: 'שם פרטי:', max_length: 20, id: 'first-name'},
                {required: '*', label: 'טלפון:', max_length: 10, id: 'phone-number'}
            ];
        }
        return form_items;
    }

    function get_customer_details(form_type){
        var customer_details = {};
        if(form_type == 'sign-up'){
           customer_details = {
                first_name:     $first_name,
                last_name:      $last_name,
                phone_number:   $phone_number,
                email:          $email,
                street:         $street,
                house_number:   $house_number,
                floor:          $floor,
                enter:          $enter
            }
        }
        if(form_type == 'log-in'){
            customer_details = {
                first_name:     $first_name,
                phone_number:   $phone_number
            }
        }

        return customer_details;
    }

});