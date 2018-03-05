angular.module('starter')
    // MY ACCOUNT CONTROLLER
    .controller('MyAccountCtrl', function ($scope, $state, $q, $filter, $ionicPopup, UserService, GlobalService) {
        $scope.addressData = {};
        $scope.customerAddresses = [];
        $id_customer = GlobalService.id_customer;
        $scope.id_lang = GlobalService.id_lang;
        $scope.currentLanguages = $filter('filter')(GlobalService.languages, { id: GlobalService.id_lang })[0];

        $scope.$on('$ionicView.enter', function (e) {
            if ($id_customer) {
                getOrder($id_customer);
                getOrderState();
            }
        });

        function getOrderState() {
            $scope.orderState = GlobalService.order_states;
            if (!$scope.orderState.length) {
                GlobalService.getOrderState().get().$promise.then(function (data) {
                    GlobalService.order_states = data.order_states;
                    $scope.orderState = GlobalService.order_states;
                });
            }
        }

        function getOrder(customerID) {
            $scope.isLoadingOrderHistoryList = true;
            UserService.getOrderList(customerID).get().$promise.then(function (data) {
                $scope.orderHistoryList = data.orders;
                $scope.isLoadingOrderHistoryList = false;
            });
        }
    })

    // MY ADDRESS CONTROLLER
    .controller('MyAddressCtrl', function ($scope, $state, $q, $filter, $ionicPopup, UserService, GlobalService) {
        $scope.addressData = {}; //Add customer address
        $id_customer = GlobalService.id_customer;
        $scope.id_lang = GlobalService.id_lang;
        //var customerAddresses = []; // To display customer's list of addresses

        $scope.$on('$ionicView.enter', function (e) {
            if ($id_customer) {
                getCountries();
                getStates();
                getAddresses($id_customer);
            }
        });

        function getAddresses(customerID) { //Get all address from id_customer
            $scope.isLoadingcustomerAddresses = true;
            UserService.getAddresses(customerID).get().$promise.then(function (data) {
                $scope.customerAddresses = data.addresses;
                UserService.customerAddresses = data.addresses;
                $scope.isLoadingcustomerAddresses = false;
            });
        }

        function getCountries() { //Get all active countries from ws
            $scope.countries = GlobalService.countries;
            if (!GlobalService.countries.length) {
                GlobalService.getCountries().get().$promise.then(function (data) {
                    GlobalService.countries = data.countries;
                    $scope.countries = GlobalService.countries;
                })
            }
        }

        function getStates() { //Get all active states from ws
            $scope.states = GlobalService.states;
            if (!GlobalService.states.length) {
                GlobalService.getStates().get().$promise.then(function (data) {
                    GlobalService.states = data.states;
                    $scope.states = GlobalService.states;
                });
            }
        }

        $scope.getCountryById = function (id_country) { //used for displaying country name
            return $filter('filter')($scope.countries, { id: id_country })[0];
        }

        if ($scope.countries) {
            $scope.getCountryById(id_country = $scope.addressData.id_country)
        }

        $scope.getStateByStateId = function (id_state) { //used for displaying state name
            if (GlobalService.states.length) {
                return $filter('filter')($scope.states, { id: id_state })[0];
            }
        }

        $scope.submitAddress = function () {
            var id_customer = $id_customer;
            var id_country = $scope.addressData.id_country;
            var id_state = $scope.addressData.id_state;
            var alias = $scope.addressData.alias;
            var firstname = $scope.addressData.firstname;
            var lastname = $scope.addressData.lastname || "";
            var company = $scope.addressData.company || "";
            var address1 = $scope.addressData.address1;
            var address2 = $scope.addressData.address2 || "";
            var postcode = $scope.addressData.postcode || "";
            var city = $scope.addressData.city;
            var other = $scope.addressData.other || "";
            var phone = $scope.addressData.phone || "";
            var phone_mobile = $scope.addressData.phone_mobile || "";
            UserService.addCustomerAddress(id_customer, id_country, id_state, alias, firstname, lastname, company, address1, address2, postcode, city, other, phone, phone_mobile).then(function (data) {
                if ($scope.customerAddresses) {
                    $scope.customerAddresses = $scope.customerAddresses.concat(data);
                }
                else {
                    $scope.customerAddresses = data;
                }
                $scope.addressData = {}; //clear form
                $state.go('app.addresses', {}, { reload: true });
            });
        }

        $scope.deleteAddress = function ($index, id_address, alias) {
            var id_address = $scope.customerAddresses[$index].id;
            var id_customer = $id_customer;
            var id_country = $scope.customerAddresses[$index].id_country;
            var id_state = $scope.customerAddresses[$index].id_state;
            var alias = $scope.customerAddresses[$index].alias;
            var firstname = $scope.customerAddresses[$index].firstname;
            var lastname = $scope.customerAddresses[$index].lastname || "";
            var company = $scope.customerAddresses[$index].company || "";
            var address1 = $scope.customerAddresses[$index].address1;
            var address2 = $scope.customerAddresses[$index].address2 || "";
            var postcode = $scope.customerAddresses[$index].postcode || "";
            var city = $scope.customerAddresses[$index].city;
            var other = $scope.customerAddresses[$index].other || "";
            var phone = $scope.customerAddresses[$index].phone || "";
            var phone_mobile = $scope.customerAddresses[$index].phone_mobile || "";

            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete Address',
                template: 'Are you sure you want to delete ' + alias
            });

            confirmPopup.then(function (res) {
                if (res) {
                    UserService.deleteCustomerAddress(id_address, id_customer, id_country, id_state, alias, firstname, lastname, company, address1, address2, postcode, city, other, phone, phone_mobile);
                    $scope.customerAddresses.splice($index, 1);
                    console.log('You are sure');
                } else {
                    console.log('You are not sure');
                }
            });
        }

    })

    // EDIT ADDRESS CONTROLLER
    .controller('EditAddressCtrl', function ($scope, $state, $ionicPopup, UserService, GlobalService) {

        $id_customer = GlobalService.id_customer;
        $scope.countries = GlobalService.countries;
        $scope.states = GlobalService.states;
        $scope.addressData = angular.copy(UserService.customerAddresses[$state.params.addressIndex]);

        $scope.submitAddress = function () {
            var id_address = $scope.addressData.id;
            var id_customer = $id_customer;
            var id_country = $scope.addressData.id_country;
            var id_state = $scope.addressData.id_state;
            var alias = $scope.addressData.alias;
            var firstname = $scope.addressData.firstname;
            var lastname = $scope.addressData.lastname || "";
            var company = $scope.addressData.company || "";
            var address1 = $scope.addressData.address1;
            var address2 = $scope.addressData.address2 || "";
            var postcode = $scope.addressData.postcode || "";
            var city = $scope.addressData.city;
            var other = $scope.addressData.other || "";
            var phone = $scope.addressData.phone || "";
            var phone_mobile = $scope.addressData.phone_mobile || "";

            UserService.editCustomerAddress(id_address, id_customer, id_country, id_state, alias, firstname, lastname, company, address1, address2, postcode, city, other, phone, phone_mobile).then(function (data) {
                UserService.customerAddresses[$state.params.addressIndex] = data;
                $state.go('app.addresses', {}, { reload: true });
            });
        }

    })

    // IDENTITY CONTROLLER
    .controller('IdentityCtrl', function ($scope, $state, $filter, $ionicPopup, UserService, GlobalService) {
        var $id_customer = GlobalService.id_customer;
        var $id_lang = GlobalService.id_lang;
        var $secure_key = null; // TODO

        $scope.$watch('user', function () {
            if($scope.user.length == 1){
                $scope.user = $scope.user[0];
            }
            if ($scope.user.secure_key) {
                $secure_key = $scope.user.secure_key;
            }
            if ($scope.user.birthday == "0000-00-00") {
                $scope.user.birthday = null;
            }
            else {
                $scope.user.birthday = new Date($scope.user.birthday); //convert to Date object
            }
        });

        UserService.getCustomer($id_customer).then(function (data) {
            $scope.user = data;
        })

        $scope.doUpdate = function () {
            var id_customer = $id_customer;
            var id_default_group = $scope.user.id_default_group || "";
            var id_lang = $id_lang;
            var newsletter_date_add = $scope.user.newsletter_date_add || "";
            var ip_registration_newsletter = $scope.user.ip_registration_newsletter || "";
            var last_passwd_gen = $scope.user.last_passwd_gen || "";
            var secure_key = $scope.user.secure_key || "";
            var passwd = $scope.user.passwd || "";
            var lastname = $scope.user.lastname || "";
            var firstname = $scope.user.firstname || "";
            var email = $scope.user.email || "";
            var id_gender = $scope.user.id_gender || "";
            var birthday = $filter('date')($scope.user.birthday, 'yyyy-MM-dd') || '';
            var newsletter = $scope.user.newsletter || "";
            var optin = $scope.user.optin || "";
            var website = $scope.user.website || "";
            var company = $scope.user.company || "";
            var siret = $scope.user.siret || "";
            var ape = $scope.user.ape || "";
            var outstanding_allow_amount = $scope.user.outstanding_allow_amount || "";
            var show_public_prices = $scope.user.show_public_prices || "";
            var id_risk = $scope.user.id_risk || "";
            var max_payment_days = $scope.user.max_payment_days || "";
            var active = $scope.user.active || "";
            var note = $scope.user.note || "";
            var is_guest = $scope.user.is_guest || "";
            UserService.editCustomer(id_customer, id_default_group, id_lang, newsletter_date_add, ip_registration_newsletter, last_passwd_gen, secure_key, passwd, lastname, firstname, email, id_gender, birthday, newsletter, optin, website, company, siret, ape, outstanding_allow_amount, show_public_prices, id_risk, max_payment_days, active, note, is_guest).then(function (data) {
                console.log(data);
            })
        }
    })
