angular.module('starter')

  .factory('CartService', function ($resource, ApiEndpoint) {

    var cart_rows = [];
    var cart_rowsXML = '';

    // Generate Cart XML String
    function updateCartXML(cartID, id_customer, id_currency, id_lang, cart_rowsXML) {
      return '<prestashop><cart><id>' + cartID + '</id><id_customer>' + id_customer + '</id_customer><id_currency>' + id_currency + '</id_currency><id_lang>' + id_lang + '</id_lang><associations><cart_rows>' + cart_rowsXML + '</cart_rows></associations></cart></prestashop>';
    }
    return {
      getCart: function () {
        return cart_rows;
      },
      updateCartRow: function (id_product, id_product_attribute, id_address_delivery, quantity) {
        cart_rows.push({
          id_product: id_product,
          id_product_attribute: id_product_attribute,
          id_address_delivery: id_address_delivery,
          quantity: quantity
        });
      },
      getCartId: function (id_cart) {
        return $resource(ApiEndpoint.url + '/carts/' + id_cart,
          { ws_key: ApiEndpoint.ws_key, output_format: 'JSON' });
      },
      checkCartHasOrderExist: function (id_cart) {
        return $resource(ApiEndpoint.url + '/orders', { ws_key: ApiEndpoint.ws_key, output_format: 'JSON', 'filter[id_cart]': [id_cart], display: '[id,id_cart]' },
          {
            get: { method: 'GET' }
          })
      },
      addProductToCart: function (cartID, id_customer, id_currency, id_lang, id_product, id_product_attribute, id_address_delivery, quantity) {
        for (var i = 0; i < cart_rows.length; i++) {
          if (cart_rows[i].id_product == id_product) {
            console.log('Item is already in cart');
            return;
          }
        }
        cart_rows.push({
          id_product: id_product,
          id_product_attribute: id_product_attribute,
          id_address_delivery: id_address_delivery,
          quantity: quantity
        });
        cart_rowsXML = cart_rowsXML.concat('<cart_row><id_product>' + id_product + '</id_product><id_product_attribute>' + id_product_attribute + '</id_product_attribute><id_address_delivery>' + id_address_delivery + '</id_address_delivery><quantity>' + quantity + '</quantity></cart_row>');
        //updateCart();
        console.log('No. item in cart:', cart_rows.length);
        //Update Web Service
        this.ws().update({}, updateCartXML(cartID, id_customer, id_currency, id_lang, cart_rowsXML)).$promise.then(function (data) {
        });
      },
      updateCartRowXML: function () {
        angular.forEach(cart_rows, function (value, key) {
          cart_rowsXML = cart_rowsXML.concat('<cart_row><id_product>' + value.id_product + '</id_product><id_product_attribute>' + value.id_product_attribute + '</id_product_attribute><id_address_delivery>' + value.id_address_delivery + '</id_address_delivery><quantity>' + value.quantity + '</quantity></cart_row>')
        })
        console.log('Cart have', cart_rows.length, 'items')
      },
      updateCartProductQuantity: function (index, quantity) {
        cart_rows[index].quantity = quantity;
      },
      updateShoppingCart: function (cartID, id_customer, id_currency, id_lang, id_product) {
        cart_rowsXML = '';
        this.updateCartRowXML();
        this.ws().update({}, updateCartXML(cartID, id_customer, id_currency, id_lang, cart_rowsXML));
      },
      removeProductFromCart: function (cartID, id_customer, id_currency, id_lang, id_product) {
        for (var i = 0; i < cart_rows.length; i++) {
          if (cart_rows[i].id_product == id_product) {
            cart_rows.splice(i, 1);
            cart_rowsXML = '';
            this.updateCartRowXML();
            //Update Web Service
            this.ws().update({}, updateCartXML(cartID, id_customer, id_currency, id_lang, cart_rowsXML));
            return;
          }
        }
      },
      removeAllProductFromCart: function (cartID, id_customer, id_currency, id_lang) {
        cart_rows = [];
        cart_rowsXML = '';
        var removeAllXML = '<prestashop><cart><id>' + cartID + '</id><id_customer>' + id_customer + '</id_customer><id_currency>' + id_currency + '</id_currency><id_lang>' + id_lang + '</id_lang><associations><cart_rows><id_product></id_product><id_product_attribute></id_product_attribute><id_address_delivery></id_address_delivery><quantity></quantity></cart_rows></associations></cart></prestashop>';
        //Update Web Service
        this.ws().update({}, removeAllXML);
        return;
      },
      ws: function () {
        return $resource(ApiEndpoint.url + '/carts', { ws_key: ApiEndpoint.ws_key, output_format: 'JSON' },
          {
            save: {
              method: "POST",
              headers:
                {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'Accept': 'application/xml'
                }
            },
            update: {
              method: "PUT",
              headers:
                {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'Accept': 'application/xml'
                }
            }
          });
      }
    }
  })