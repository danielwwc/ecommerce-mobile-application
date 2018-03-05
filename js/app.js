// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngResource', 'ngCordova', 'angular-md5'])

  .config(function ($ionicConfigProvider) {
    $ionicConfigProvider.views.forwardCache(true);
  })

  // API ENDPOINT CONSTANT
  .constant('ApiEndpoint', {
    url: 'http://159.89.103.218/prestashop/api',
    ws_key: 'FKKYB2FE68EPPETMM2JVE3L9S6B6F1ZG',
    COOKIE_KEY: 'xHMpsvzv0fOvJnSuWeCNQttQ0LGmt91eiemzxVWJAE1gHgh9jz8y5NIL'
  })

  // AUTHORIZATION EVENTS
  .constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized',
    changedLanguage: 'change-language'
  })

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs) 
      if (window.cordova && window.cordova.plugins.Keyboard) {
        //cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })

  // APP ROUTER
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })

      .state('app.featured', {
        url: '/featured',
        views: {
          'tab-featured': {
            templateUrl: 'templates/featured.html',
            controller: 'SearchCtrl'
          }
        }
      })

      .state('app.search-product', {
        url: '/featured/product/:productId',
        views: {
          'tab-featured': {
            templateUrl: 'templates/product-featured.html',
            controller: 'ProductCtrl'
          }
        }
      })

      .state('app.browse', {
        url: '/browse',
        views: {
          'tab-browse': {
            templateUrl: 'templates/browse.html'
          }
        }
      })

      .state('app.my-account', {
        url: '/my-account',
        views: {
          'tab-account': {
            templateUrl: 'templates/my-account.html',
            controller: 'MyAccountCtrl',
            cache: false
          }
        }
      })

      .state('app.identity', {
        url: '/identity',
        views: {
          'tab-account': {
            templateUrl: 'templates/identity.html',
            controller: 'IdentityCtrl',
            cache: false
          }
        }
      })

      .state('app.shopping-cart', {
        url: '/shopping-cart',
        views: {
          'tab-cart': {
            templateUrl: 'templates/shopping-cart.html',
            controller: 'ShoppingCartCtrl',
            cache: false
          }
        }
      })

      .state('app.checkout', {
        url: '/checkout',
        views: {
          'tab-cart': {
            templateUrl: 'templates/shipping-modal.html',
            controller: 'CheckoutCtrl'
          }
        }
      })

      .state('app.order-history', {
        url: '/order-history',
        views: {
          'tab-account': {
            templateUrl: 'templates/order-history.html',
            controller: 'MyAccountCtrl',
            cache: false
          }
        }
      })

      .state('app.addresses', {
        url: '/my-account/addresses',
        views: {
          'tab-account': {
            templateUrl: 'templates/addresses.html',
            controller: 'MyAddressCtrl'
          }
        }
      })

      .state('app.address', {
        url: '/my-account/addresses/address',
        views: {
          'tab-account': {
            templateUrl: 'templates/address.html',
            controller: 'MyAddressCtrl',
            cache: false
          }
        }
      })

      .state('app.edit-address', {
        url: '/my-account/addresses/address/:addressIndex',
        views: {
          'tab-account': {
            templateUrl: 'templates/address.html',
            controller: 'EditAddressCtrl',
            cache: false
          }
        }
      })

      .state('app.categories', {
        url: '/categories',
        views: {
          'tab-categories': {
            templateUrl: 'templates/categories.html',
            controller: ''
          }
        }
      })

      .state('app.sub-categories', {
        url: '/categories/:categoryId',
        views: {
          'tab-categories': {
            templateUrl: 'templates/sub-categories.html',
            controller: 'CategoriesCtrl'
          }
        }
      })

      .state('app.produstListAll', {
        url: '/product_list_all/:categoryId',
        views: {
          'tab-categories': {
            templateUrl: 'templates/product_list_all.html',
            controller: 'ProductlistAllCtrl'
          }
        }
      })

      .state('app.product', {
        url: '/product/:productId',
        views: {
          'tab-categories': {
            templateUrl: 'templates/product.html',
            controller: 'ProductCtrl'
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/categories');
  });
