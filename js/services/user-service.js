angular.module('starter')
  .factory('UserService', function ($resource, ApiEndpoint, $rootScope, $q, AUTH_EVENTS, GlobalService) {
    var isAuthenticated = false;
    var userData = ''
    var login = function (email, passwd) {
      var data = $resource(ApiEndpoint.url + '/customers',
        { 'filter[email]': email, 'filter[passwd]': passwd, 'filter[active]': '1', 'filter[deleted]': '0', 'output_format': 'JSON', ws_key: ApiEndpoint.ws_key, display: '[id,secure_key]' });
      data.get().$promise.then(function (data) {
        var user = data.customers;
        if (user) {
          storeUserCredentials(user);
          alert('Login Success');
          GlobalService.id_customer = user[0].id;
          $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
        }
        else {
          alert('Login Failed');
        }
      }, function (err) {
        //alert('Login Failed', err);
      })
    }

    function loadUserCredentials() {
      var user = JSON.parse(window.localStorage['user'] || '{}')[0];
      if (user) {
        useCredentials(user);
      }
    }

    function storeUserCredentials(user) {
      window.localStorage['user'] = JSON.stringify(user);
      useCredentials(user);
    }

    function useCredentials(user) {
      isAuthenticated = true;
      userData = user;
    }

    function destroyUserCredentials() {
      isAuthenticated = false;
      window.localStorage.removeItem('user');
    }

    var getCustomer = function (id_customer) {
      var customer = $resource(ApiEndpoint.url + '/customers&filter[id]=[:id_customer]', { ws_key: ApiEndpoint.ws_key, output_format: 'JSON', id_customer: id_customer, display: 'full' });
      return $q(function (resolve, reject) {
        customer.get().$promise.then(function (data) {
          resolve(data.customers[0]);
        }, function (error) {
          reject(error);
        })
      });
    }

    var editCustomer = function (id_customer, id_default_group, id_lang, newsletter_date_add, ip_registration_newsletter, last_passwd_gen, secure_key, passwd, lastname, firstname, email, id_gender, birthday, newsletter, optin, website, company, siret, ape, outstanding_allow_amount, show_public_prices, id_risk, max_payment_days, active, note, is_guest) {
      //var customerXML = '<prestashop><customer><id>'+id_customer+'</id><id_lang>'+id_lang+'</id_lang><lastname>'+lastname+'</lastname><firstname>'+firstname+'</firstname><email>'+email+'</email><passwd>'+passwd+'</passwd><id_gender>'+id_gender+'</id_gender><birthday>'+birthday+'</birthday></customer></prestashop>';
      var customerXML = '<prestashop><customer><id>' + id_customer + '</id><id_default_group>' + id_default_group + '</id_default_group><id_lang>' + id_lang + '</id_lang><newsletter_date_add>' + newsletter_date_add + '</newsletter_date_add><ip_registration_newsletter>' + ip_registration_newsletter + '</ip_registration_newsletter><last_passwd_gen>' + last_passwd_gen + '</last_passwd_gen><secure_key>' + secure_key + '</secure_key><deleted>0</deleted><passwd>' + passwd + '</passwd><lastname>' + lastname + '</lastname><firstname>' + firstname + '</firstname><email>' + email + '</email><id_gender>' + id_gender + '</id_gender><birthday>' + birthday + '</birthday><newsletter>' + newsletter + '</newsletter><optin>' + optin + '</optin><website>' + website + '</website><company>' + company + '</company><siret>' + siret + '</siret><ape>' + ape + '</ape><outstanding_allow_amount>' + outstanding_allow_amount + '</outstanding_allow_amount><show_public_prices>' + show_public_prices + '</show_public_prices><id_risk>' + id_risk + '</id_risk><max_payment_days>' + max_payment_days + '</max_payment_days><active>' + active + '</active><note>' + note + '</note><is_guest>' + is_guest + '</is_guest><id_shop>1</id_shop><id_shop_group>1</id_shop_group></customer></prestashop>'
      var customer = $resource(ApiEndpoint.url + '/customers', { ws_key: ApiEndpoint.ws_key, output_format: 'JSON' },
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
      return $q(function (resolve, reject) {
        customer.update({}, customerXML).$promise.then(function (data) {
          resolve(data.customer);
        }, function (error) {
          reject(error);
        })
      });
    }

    var checKCustomerIsExist = function (email) {
      var customer = $resource(ApiEndpoint.url + '/customers&filter[email]=[:email]', { ws_key: ApiEndpoint.ws_key, output_format: 'JSON', email: email });
      return $q(function (resolve, reject) {
        customer.get().$promise.then(function (data) {
          if (data.customers) {
            resolve("exist");
            alert("An account using this email address has already been registered.");
          }
          if (!data.customers) {
            resolve("not-exist");
          }
        }, function (error) {
          reject(error);
        })
      });
    }

    var createCustomer = function (id_lang, email, passwd, firstname, lastname, id_gender, birthday, newsletter, optin) {
      var id_default_group = "3";
      var active = "1";
      var customerXML = '<prestashop><customer><id_default_group>' + id_default_group + '</id_default_group><id_lang>' + id_lang + '</id_lang><passwd>' + passwd + '</passwd><lastname>' + lastname + '</lastname><firstname>' + firstname + '</firstname><email>' + email + '</email><id_gender>' + id_gender + '</id_gender><birthday>' + birthday + '</birthday><newsletter>' + newsletter + '</newsletter><optin>' + optin + '</optin><active>' + active + '</active></customer></prestashop>';
      var customer = $resource(ApiEndpoint.url + '/customers', { ws_key: ApiEndpoint.ws_key, output_format: 'JSON' },
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
      return $q(function (resolve, reject) {
        customer.save({}, customerXML).$promise.then(function (data) {
          resolve(data.customer);
        }, function (error) {
          reject(error);
        })
      });
    }

    var customerAddresses = []
    var getAddresses = function (id_customer) {
      return $resource(ApiEndpoint.url + '/addresses',
        { ws_key: ApiEndpoint.ws_key, display: 'full', output_format: 'JSON', 'filter[id_customer]': id_customer, 'filter[deleted]': '[0]' });
    }
    var addCustomerAddress = function (id_customer, id_country, id_state, alias, firstname, lastname, company, address1, address2, postcode, city, other, phone, phone_mobile) {
      var addressXML = '<prestashop><address><id_customer>' + id_customer + '</id_customer><id_country>' + id_country + '</id_country><id_state>' + id_state + '</id_state><alias>' + alias + '</alias><company>' + company + '</company><lastname>' + lastname + '</lastname><firstname>' + firstname + '</firstname><address1>' + address1 + '</address1><address2>' + address2 + '</address2><postcode>' + postcode + '</postcode><city>' + city + '</city><other>' + other + '</other><phone>' + phone + '</phone><phone_mobile>' + phone_mobile + '</phone_mobile></address></prestashop>';

      var address = $resource(ApiEndpoint.url + '/addresses', { ws_key: ApiEndpoint.ws_key, output_format: 'JSON' },
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
      return $q(function (resolve, reject) {
        address.save({}, addressXML).$promise.then(function (data) {
          resolve(data.address);
        }, function (error) {
          reject(error);
        })
      });

    }

    var editCustomerAddress = function (id_address, id_customer, id_country, id_state, alias, firstname, lastname, company, address1, address2, postcode, city, other, phone, phone_mobile) {
      var addressXML = '<prestashop><address><id>' + id_address + '</id><id_customer>' + id_customer + '</id_customer><id_country>' + id_country + '</id_country><id_state>' + id_state + '</id_state><alias>' + alias + '</alias><company>' + company + '</company><lastname>' + lastname + '</lastname><firstname>' + firstname + '</firstname><address1>' + address1 + '</address1><address2>' + address2 + '</address2><postcode>' + postcode + '</postcode><city>' + city + '</city><other>' + other + '</other><phone>' + phone + '</phone><phone_mobile>' + phone_mobile + '</phone_mobile></address></prestashop>';

      var address = $resource(ApiEndpoint.url + '/addresses', { ws_key: ApiEndpoint.ws_key, output_format: 'JSON' },
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
      return $q(function (resolve, reject) {
        address.update({}, addressXML).$promise.then(function (data) {
          resolve(data.address);
        }, function (error) {
          reject(error);
        })
      });

    }

    function deleteCustomerAddress(id_address, id_customer, id_country, id_state, alias, firstname, lastname, company, address1, address2, postcode, city, other, phone, phone_mobile) {
      var addressXML = '<prestashop><address><id>' + id_address + '</id><id_customer>' + id_customer + '</id_customer><id_country>' + id_country + '</id_country><id_state>' + id_state + '</id_state><alias>' + alias + '</alias><company>' + company + '</company><lastname>' + lastname + '</lastname><firstname>' + firstname + '</firstname><address1>' + address1 + '</address1><address2>' + address2 + '</address2><postcode>' + postcode + '</postcode><city>' + city + '</city><other>' + other + '</other><phone>' + phone + '</phone><phone_mobile>' + phone_mobile + '</phone_mobile><deleted>1</deleted></address></prestashop>';

      var address = $resource(ApiEndpoint.url + '/addresses', { ws_key: ApiEndpoint.ws_key, output_format: 'JSON' },
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
      address.update({}, addressXML);
    }

    loadUserCredentials();

    return {
      login: login,

      getUser: function () { return userData },

      getOrderList: function (id_customer) {
        return $resource(ApiEndpoint.url + '/orders',
          { ws_key: ApiEndpoint.ws_key, display: 'full', output_format: 'JSON', 'filter[id_customer]': id_customer });
      },
      logout: function () {
        destroyUserCredentials();
      },
      isAuthenticated: function () {
        return isAuthenticated;
      },
      createCustomer: createCustomer
      ,
      checKCustomerIsExist: checKCustomerIsExist
      ,
      getCustomer: getCustomer
      ,
      editCustomer: editCustomer
      ,
      getAddresses: getAddresses
      ,
      addCustomerAddress: addCustomerAddress
      ,
      editCustomerAddress: editCustomerAddress
      ,
      deleteCustomerAddress: function (id_address, id_customer, id_country, id_state, alias, firstname, lastname, company, address1, address2, postcode, city, other, phone, phone_mobile) {
        deleteCustomerAddress(id_address, id_customer, id_country, id_state, alias, firstname, lastname, company, address1, address2, postcode, city, other, phone, phone_mobile);
      },
      customerAddresses: customerAddresses
    }
  })