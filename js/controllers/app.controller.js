angular.module('starter')
  // APP CONTROLLER : GLOBAL FEATURES, USER FEATURES
  .controller('AppCtrl', function ($rootScope, $scope, $state, $ionicConfig, $ionicModal, $ionicPopover, $filter, $ionicHistory, $window, $timeout, $http, md5, ApiEndpoint, ProductListService, CategoryListService, UserService, CartService, AUTH_EVENTS, GlobalService, LOCAL_EN, LOCAL_DE) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.$on(AUTH_EVENTS.loginSuccess, function (event) {
      $scope.isAuthenticated = UserService.isAuthenticated();
    });

    $scope.$on(AUTH_EVENTS.changedLanguage, function (event) {
      $timeout(function () {
        //$ionicHistory.clearCache();
        $window.location.reload(true);
        $state.go('app.categories', {});
      }, 1000);
    });

    $scope.isAuthenticated = UserService.isAuthenticated();
    if ($scope.isAuthenticated == true) {
      $scope.user = UserService.getUser();
      GlobalService.updateCustomerId($scope.user.id);
    }


    var $id_guest = GlobalService.id_guest;
    var $id_cart = GlobalService.id_cart;
    var $id_customer = GlobalService.id_customer;
    var $id_lang = GlobalService.id_lang;
    var $id_currency = GlobalService.id_currency;

    inital();
    function inital() {
      if ($id_cart) {
        getShoppingCartItemByCartId();
      }
    }

    function getShoppingCartItemByCartId() {
      CartService.getCartId($id_cart).get().$promise.then(function (data) {
        try {
          var cart_rows = data.cart.associations.cart_rows;
          if (cart_rows.length) {
            for (var i = 0; i < cart_rows.length; i++) {
              CartService.updateCartRow(cart_rows[i].id_product, cart_rows[i].id_product_attribute, cart_rows[i].id_address_delivery, cart_rows[i].quantity)
            }
            CartService.updateCartRowXML();
          }
        }
        catch (error) {
          console.log(error);
        }
      });
    }

    // TO DO : Create Order
    // function createCart (id_address_delivery,id_address_invoice,id_currency,id_customer,id_lang,secure_key){
    //   CartService.save({},'<prestashop><cart><id></id><id_address_delivery>'+id_address_delivery+'</id_address_delivery><id_address_invoice>'+id_address_invoice+'</id_address_invoice><id_currency>'+id_currency+'</id_currency><id_customer>'+id_customer+'</id_customer><id_guest>'+id_guest+'</id_guest><id_lang>'+id_lang+'</id_lang><id_shop_group>1</id_shop_group><id_shop>1</id_shop><id_carrier>0</id_carrier><recyclable>0</recyclable><gift>0</gift><gift_message/><mobile_theme></mobile_theme><delivery_option/><secure_key>'+secure_key+'</secure_key><allow_seperated_package>0</allow_seperated_package></cart></prestashop>');
    // }

    // function setCartID (cartid){
    //   $scope.cartid = cartid;
    //   console.log('Cart ID is set to:', cartid);
    // }

    // function getCart(userid){
    //   var cart_rows = []
    //   var cartid = '';
    //   //Get the last cart record from webservice and return cartid
    //   CartService.getCartId(userid).get().$promise.then(function(data){
    //     //check @cartid belong to any order id
    //     if (data.carts.length){
    //       try{
    //         CartService.checkCartHasOrderExist(data.carts[0].id).get().$promise.then(function(orderData){
    //           if(!orderData.length){
    //             //if cartid does not belong to any order
    //             setCartID(data.carts[0].id);
    //             console.log('Cart ID:',data.carts[0].id,'Cart is has no order yet');
    //             try{
    //               if(data.carts[0].associations.cart_rows.length){
    //                 for (var i = 0; i < data.carts[0].associations.cart_rows.length; i++) {
    //                 CartService.updateCartRow(data.carts[0].associations.cart_rows[i].id_product,data.carts[0].associations.cart_rows[i].id_product_attribute,data.carts[0].associations.cart_rows[i].id_address_delivery,data.carts[0].associations.cart_rows[i].quantity)    
    //                 }
    //                 CartService.updateCartRowXML();
    //                 }
    //             }
    //             catch(error){console.log('getCart Error:',error)}
    //           }
    //           if(orderData.length){
    //             //if cartid belong to order, perform create new cart id
    //             console.log('Cart ID:',data.carts[0].id,'Cart have already ordered');
    //             setCartID('');
    //           }
    //         })
    //       }
    //       catch(error){console.log('CartID:',cartid,'getCart Error:',error, 'data',data)}
    //     }
    //     else{
    //       //create cart
    //     }
    //   });
    // }

    $scope.ImgUrl = function (productId, imageId, pictureSize) {
      return ApiEndpoint.url + '/images/products/' + productId + '/' + imageId + '/' + pictureSize + '&ws_key=' + ApiEndpoint.ws_key;
    }
    var COOKIE_KEY = ApiEndpoint.COOKIE_KEY;
    $scope.categories = CategoryListService.get();

    $scope.tab = 1;

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
      $scope.modal.show();
    };

    $scope.logout = function () {
      UserService.logout();
      $scope.isAuthenticated = UserService.isAuthenticated();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
      var md5Key = md5.createHash(COOKIE_KEY + $scope.loginData.password);
      UserService.login($scope.loginData.username, md5Key);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function () {
        $scope.closeLogin();
      }, 1000);
    }

    // REGISTER MODAL
    $scope.registerData = {};
    $scope.registerData.newsletter = true;
    $scope.registerData.optin = true;
    $scope.doRegister = function () {
      console.log($scope.registerData);
      var id_lang = $id_lang;
      var email = $scope.registerData.email;
      var passwd = $scope.registerData.passwd;
      var firstname = $scope.registerData.firstname;
      var lastname = $scope.registerData.lastname;
      var id_gender = $scope.registerData.id_gender || '1';
      var birthday = $filter('date')($scope.registerData.birthday, 'yyyy-MM-dd') || '';
      var newsletter = formatter($scope.registerData.newsletter) || '1';
      var optin = formatter($scope.registerData.optin) || '1';

      UserService.checKCustomerIsExist(email).then(function (data) { //check customer email isExist
        if (data == "exist") {
          return false;
        }
        if (data == "not-exist") {
          UserService.createCustomer(id_lang, email, passwd, firstname, lastname, id_gender, birthday, newsletter, optin).then(function (data) {
            if (data) {
              $scope.registerData = {}; //clear form
              alert("Succesfully Registed");
              UserService.login(data.email, passwd); //login
              $timeout(function () { //close modal
                $scope.closeLogin();
              }, 1000);
            }
          })
        }
      })
    }

    // GENDER POPOVER
    $ionicPopover.fromTemplateUrl('templates/gender-popover.html', {
      scope: $scope
    }).then(function (popover) {
      $scope.popover = popover;
    });

    $scope.openPopover = function ($event) {
      $scope.popover.show($event);
    };
    $scope.closePopover = function () {
      $scope.popover.hide();
    };

    function formatter(value) {
      if (value === true) {
        return '1';
      } else if (value === false) {
        return '0';
      } else {
        return '';
      }
    }

    // LANGUAGE SETTINGS MODAL
    $ionicModal.fromTemplateUrl('templates/change-language-modal.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.ChangeLanguageModal = modal;
    });

    $scope.showChangeLanguage = function () {
      $scope.languages = GlobalService.languages;
      $scope.ChangeLanguageModal.show();
    };

    $scope.closeChangeLanguage = function () {
      $scope.ChangeLanguageModal.hide();
    };

    $scope.doChangeLanguage = function (id_lang) {
      GlobalService.updateLanguageId(id_lang);
      $timeout(function () {
        $scope.closeChangeLanguage();
      }, 1000);
    };

    // LOCALIZATION - TRANSLATION
    // example usages string interpolation: {{translation[iso_code]['string']}}
    $rootScope.iso_code = GlobalService.iso_code;
    $rootScope.translation = [];
    $rootScope.translation['en'] = LOCAL_EN;
    $rootScope.translation['de'] = LOCAL_DE;
    //$ionicConfig.backButton.text() = $rootScope.translation[GlobalService.iso_code]['Back'];
    // Only change the "Back" wording
    var backButton = document.getElementsByClassName("default-title");
    for (var i = 0; i < backButton.length; i++) {
      backButton[i].innerText = $rootScope.translation[GlobalService.iso_code]['Back'];
    }


  })