angular.module('starter')
    // PRODUCT CONTROLLER
    .controller('ProductCtrl', function ($scope, $stateParams, $q, $filter, $ionicModal, $ionicScrollDelegate, $ionicSlideBoxDelegate, ProductService, ProductListService, ProductFeatureService, ProductFeatureValueService, CartService, GlobalService, TaxRuleService) {

        var $id_guest = GlobalService.id_guest;
        var $id_cart = GlobalService.id_cart;
        var $id_customer = GlobalService.id_customer;
        var $id_lang = GlobalService.id_lang;
        var $id_currency = GlobalService.id_currency;

        //current state parameter
        $scope.id_product = $stateParams.productId;

        showProductDetail();

        var startTime = Date.now();
        function showProductDetail() {
            var query = ProductService.get({ productid: $scope.id_product });
            query.$promise.then(function (data) {
                $scope.product = data.product;
                getFeatures(data.product.associations.product_features);
                getAccessories(data.product.associations.accessories);
                getProductImage(data.product.associations.images);
                $scope.product_feature = [];
                $scope.accessories = [];
                console.log('Load Product Time:', Date.now() - startTime + 'ms', data.product.name)
            });
        }

        $scope.totalTaxIncluded = function (id_tax_rules_group) {
            var id_tax_rules_group = $scope.product.id_tax_rules_group;
            var rate = TaxRuleService.getTaxRate(id_tax_rules_group);
            var rate = 1 + rate / 100;
            var totalTaxIncluded = (parseFloat($scope.product.price) * rate).toFixed(2);;
            return totalTaxIncluded;
        }

        function getFeatures(associations) {
            //Get product features from web service
            var getFeatures = associations;
            if (getFeatures) {
                var product_features = "0";
                angular.forEach(getFeatures, function (value, key) {
                    product_features = product_features + "|" + value.id_feature_value;
                })
                //console.log('@product_feature_valuesId:',product_features);
                var queryProductFeatureId = ProductFeatureService.getProductFeature();
                var queryProductFeatureValue = ProductFeatureValueService.get({ product_feature_valuesId: product_features });
                $q.all([queryProductFeatureId, queryProductFeatureValue.$promise]).then(function (data) {
                    var product_feature_name = data[0].product_features;
                    var product_feature_value = data[1].product_feature_values;
                    angular.forEach(getFeatures, function (value, key) {
                        $scope.product_feature.push({
                            id_feature: value.id,
                            position: getById(product_feature_name, value.id).position,
                            name: getById(product_feature_name, value.id).name,
                            id_feature_value: getById(product_feature_value, value.id_feature_value).id,
                            value: getById(product_feature_value, value.id_feature_value).value,
                        });
                    })
                    $ionicScrollDelegate.resize();
                    //console.log('FINAL Product_Feature', $scope.product_feature)
                    //console.log('Compare getFeatures.length:', getFeatures.length,'product_feature.length:',$scope.product_feature.length);
                    console.log('Load Product Feature Time:', Date.now() - startTime + 'ms')
                });
            }
        }

        function getAccessories(associations) {
            //Get product accessories from web service
            var accessories = associations;
            if (accessories) {
                var accessoriesIds = '';
                angular.forEach(accessories, function (value, key) {
                    accessoriesIds = accessoriesIds + value.id + '|';
                });
                ProductListService.get({ 'filter[id]': '[' + accessoriesIds + ']', display: '[id,name,id_default_image,price]' }).$promise.then(function (data) {
                    angular.forEach(data.products, function (value, key) {
                        $scope.accessories.push(value);
                    });
                    $ionicScrollDelegate.resize();
                    //console.log('Accessories',$scope.accessories);
                    console.log('Load Product Accessories Time:', Date.now() - startTime + 'ms', 'Accessories Length:', $scope.accessories.length)
                })
            }
        }

        function getById(arr, id) {
            return $filter('filter')(arr, { id: id })[0];
        };

        function getProductImage(associations) {
            $scope.showPager = false;
            $scope.productImageIds = [];
            var productImageIds = associations;
            angular.forEach(productImageIds, function (value, key) {
                $scope.productImageIds.push(value)
            })
            if (productImageIds.length > 1) {
                $scope.showPager = true;
            }
            // setTimeout(function(){
            //   $ionicSlideBoxDelegate.update();
            // },1000);
        }
        $scope.AddToCart = function (id_product, id_product_attribute, id_address_delivery, quantity) {
            CartService.addProductToCart($id_cart, $id_customer, $id_currency, $id_lang, id_product, id_product_attribute, id_address_delivery, quantity);
        }

        $scope.zoomMin = 1;

        $scope.showLargeImages = function (index) {
            $scope.activeSlide = index;
            $scope.showModal();
        }

        $ionicModal.fromTemplateUrl('templates/product-image-zoomview.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $scope.showModal = function (templateUrl) {
            $scope.showSlider = true;
            $scope.modal.show();
        }

        $scope.closeModal = function () {
            $scope.showSlider = false;
            $scope.modal.hide();
        };

        $scope.updateSlideStatus = function (slide) {
            var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
            if (zoomFactor == $scope.zoomMin) {
                $ionicSlideBoxDelegate.enableSlide(true);
            } else {
                $ionicSlideBoxDelegate.enableSlide(false);
            }
        };
    })