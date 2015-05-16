var loginController = (function (){
  var $emailElement,
      $passwordElement,
      $loginButtonElement,
      $errorElement,
      showError = function (errorList){
        var errorHtml = '';
        errorList.forEach(function (element, index, array){
          errorHtml = errorHtml + '*' + element + '<br/>';
        });
        $errorElement.html(errorHtml);
        $errorElement.addClass('show');
      },
      login = function(){
        var payload = {
          "email": $emailElement.val(),
          "password": $passwordElement.val()
        };

        $.ajax({
          "url": '/api/login',
          "method": "POST",
          "data": payload,
          "dataType": "json"
        })
          .fail(function (){
            showError(["Login service is temporarily unavailable"]);
          })
          .done(function (data){
            if(data.success === false){
              showError(data.errors);
            }else{
              window.location = data.redirectTo;
            }
          });

      };

  return {
    "setup": function ($formElement){
      if($formElement.length === 0){
        return false;
      }
      $emailElement = $($formElement).find('input[type="email"]');
      $passwordElement = $($formElement).find('input[type="password"]');
      $loginButtonElement = $($formElement).find('button');
      $errorElement = $($formElement).find('#errors');

      $loginButtonElement.click(login);
      $($formElement)
        .find('input[type="email"],input[type="password"]')
        .keypress(function (e){
          if( e.which === 13 ){
            login();
          }

        });
    }
  };
}());
loginController.setup($('#login-form'));

// nav pane toggle logic
(function(){
  $('button#nav-pane-toggle').click(function(){
    $('#navigation-pane').toggleClass('show');
  });
}());
