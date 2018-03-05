
angular.module('starter')
  // SHOPPING CART CONTROLLER
  .controller('ShoppingCartCtrl', function ($scope, $filter, CartService, ProductListService, ProductStockAvailableService, GlobalService, TaxRuleService) {

    var $id_guest = GlobalService.id_guest;
    var $id_cart = GlobalService.id_cart;
    var $id_customer = GlobalService.id_customer;
    var $id_lang = GlobalService.id_lang;
    var $id_currency = GlobalService.id_currency;

    $scope.$on('$ionicView.enter', function (e) {
      getShoppingCart();
    });

    function getShoppingCart() {
      $scope.shoppingcart = CartService.getCart();
      if ($scope.shoppingcart.length) {
        var productid = '';
        angular.forEach($scope.shoppingcart, function (value, i) {
          productid = productid + value.id_product + '|';
        })
        ProductListService.getProduct({ 'filter[id]': '[' + productid + ']', display: '[id,name,id_default_image,price,id_tax_rules_group]' }).$promise.then(function (data) {
          angular.forEach($scope.shoppingcart, function (value, i) {
            var extend = $filter('filter')(data.products, { id: value.id_product })[0];
            angular.extend($scope.shoppingcart[i], extend);
            angular.forEach($scope.shoppingcart, function (value, i) {
              var extend = totalTaxIncluded(value.price, value.id_tax_rules_group);
              angular.extend($scope.shoppingcart[i], { totalTaxIncluded: extend });
            })
          })
          getTotalPrice();
        })
        ProductStockAvailableService.getStock().get({ 'filter[id_product]': '[' + productid + ']' }).$promise.then(function (data) {
          angular.forEach($scope.shoppingcart, function (value, i) {
            var extend = $filter('filter')(data.stock_availables, { id_product: value.id_product, id_product_attribute: value.id_product_attribute })[0].quantity;
            angular.extend($scope.shoppingcart[i], { stock_availables: extend });
          })
        })
        console.log('getShoppingCart() $scope.shoppingcart', $scope.shoppingcart);
      }
    }

    function getTotalPrice() {
      $scope.totalPrice = 0
      angular.forEach($scope.shoppingcart, function (value, i) {
        $scope.totalPrice = $scope.totalPrice + $scope.shoppingcart[i].totalTaxIncluded * $scope.shoppingcart[i].quantity
      })
      getTotalTax();
    }

    function getTotalTax() {
      $scope.totalTax = 0;
      var productPrice = 0;
      var productPriceTaxIncluded = 0;
      angular.forEach($scope.shoppingcart, function (value, i) {
        productPrice = productPrice + $scope.shoppingcart[i].price * $scope.shoppingcart[i].quantity;
        productPriceTaxIncluded = productPriceTaxIncluded + $scope.shoppingcart[i].totalTaxIncluded * $scope.shoppingcart[i].quantity;
        $scope.totalTax = productPriceTaxIncluded - productPrice;
      })
    }

    function totalTaxIncluded(price, id_tax_rules_group) {
      var rate = TaxRuleService.getTaxRate(id_tax_rules_group);
      var rate = 1 + rate / 100;
      var totalTaxIncluded = (parseFloat(price) * rate).toFixed(2);;
      return totalTaxIncluded;
    }

    $scope.cart_quantity_down = function ($index) {
      var currentQuantity = $scope.shoppingcart[$index].quantity;
      if (currentQuantity != 1) {
        $scope.shoppingcart[$index].quantity = parseInt($scope.shoppingcart[$index].quantity) - 1;
        CartService.updateCartProductQuantity($index, $scope.shoppingcart[$index].quantity);
        CartService.updateShoppingCart($id_cart, $id_customer, $id_currency, $id_lang);
      }
      getTotalPrice();
    }

    $scope.cart_quantity_up = function ($index) {
      var currentQuantity = parseInt($scope.shoppingcart[$index].quantity);
      var stock_availables = parseInt($scope.shoppingcart[$index].stock_availables);
      console.log('Current Quantity', currentQuantity, 'Stock', stock_availables)
      if (currentQuantity >= stock_availables) {
        alert('No more stock')
      }
      else {
        $scope.shoppingcart[$index].quantity = parseInt($scope.shoppingcart[$index].quantity) + 1;
        CartService.updateCartProductQuantity($index, $scope.shoppingcart[$index].quantity);
        CartService.updateShoppingCart($id_cart, $id_customer, $id_currency, $id_lang);
      }
      getTotalPrice();
    }

    $scope.remove = function (productId) {
      if ($scope.shoppingcart.length == 1) {
        try { CartService.removeAllProductFromCart($id_cart, $id_customer, $id_currency, $id_lang); } catch (error) { };
        for (var i = 0; i < $scope.shoppingcart.length; i++) {
          if ($scope.shoppingcart[i].id == productId) {
            $scope.shoppingcart.splice(i, 1);
            getTotalPrice();
            return;
          }
        }
      }
      if ($scope.shoppingcart.length > 1) {
        CartService.removeProductFromCart($id_cart, $id_customer, $id_currency, $id_lang, productId);
        for (var i = 0; i < $scope.shoppingcart.length; i++) {
          if ($scope.shoppingcart[i].id == productId) {
            $scope.shoppingcart.splice(i, 1);
            getTotalPrice();
            return;
          }
        }
      }
    }

    $scope.doRefresh = function () {
      getShoppingCart();
      $scope.$broadcast('scroll.refreshComplete');
    }
  })

  // CHECKOUT CONTROLLER
  // TODO 
  .controller('CheckoutCtrl', function ($scope, $state, $filter, $ionicPopup, $resource, UserService, ApiEndpoint, GlobalService) {
    var carriers = $resource(ApiEndpoint.url + '/carriers',
      { ws_key: ApiEndpoint.ws_key, output_format: 'JSON', display: 'full', 'filter[deleted]': '0', 'filter[active]': '1' })
    carriers.get().$promise.then(function (data) {
      $scope.carriers = data.carriers;
      console.log($scope.carriers)
    });

    var pricerange = $resource(ApiEndpoint.url + '/price_ranges',
      { ws_key: ApiEndpoint.ws_key, output_format: 'JSON', display: 'full', 'filter[id_carrier]': '[19|24|26]' })
    pricerange.get().$promise.then(function (data) {
      $scope.pricerange = data.price_ranges;
    })

    var deliveries = $resource(ApiEndpoint.url + '/deliveries',
      { ws_key: ApiEndpoint.ws_key, output_format: 'JSON', display: 'full' })
    deliveries.get().$promise.then(function (data) {
      angular.forEach($scope.pricerange, function (value, i) {
        var extend = $filter('filter')(data.deliveries, { id_range_price: value.id })[0];
        angular.extend($scope.pricerange[i], extend);
      })
      console.log($scope.pricerange);
    })

    $scope.getShippingPriceByPrice = function (id_carrier, total_price) {
      var filtered = [];
      var total_price = parseFloat(total_price);
      angular.forEach($scope.pricerange, function (value, key) {
        var min = parseFloat(value.delimiter1);
        var max = parseFloat(value.delimiter2);
        var id_carrier2 = value.id_carrier;
        if (id_carrier == id_carrier2) {
          if (total_price >= min && total_price <= max) {
            filtered.push(value);
            console.log('Total Price', total_price, 'Min', min, 'Max', max, id_carrier2);
          }
        }
      })
      return filtered[0];
    }
  })

  .filter('getShippingPriceByWeight', function () {
    return function (items, rangeInfo) {
      var filtered = [];
      var min = parseFloat(rangeInfo.userMin).toFixed(2);
      var max = parseFloat(rangeInfo.userMax).toFixed(2);
      // If time is with the range
      angular.forEach(items, function (item) {
        if (item.time >= min && item.time <= max) {
          filtered.push(item);
        }
      });
      return filtered;
    };
  });