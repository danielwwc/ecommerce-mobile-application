angular.module('starter')
    // CATEGORIES CONTROLLER
    .controller('CategoriesCtrl', function ($scope, $state, $stateParams, $filter, $timeout, ProductCategoryListService, GlobalService) {

        $scope.products = [];
        var limit = 0;
        $scope.id_parent = $stateParams.categoryId;
        $scope.currentCategory = ($filter('filter')($scope.categories.categories, { id: $scope.id_parent }));

        if ($scope.currentCategory) {
            $scope.totalProduct = $scope.currentCategory[0].nb_total_products;
        }

        // Load products from category
        var productID = '';
        console.log($scope.currentCategory);
        angular.forEach($scope.currentCategory[0].associations.products, function (value, key) {
            if (key == 0) { productID = value.id; return; }
            productID = productID + "|" + value.id;
        });
        console.log('Load product ids', productID);
        console.log('limit', limit);

        function loadProduct(params, callback) {
            ProductCategoryListService.get(params).$promise.then(function (data) {
                var products = [];
                products = data.products;
                callback(products);
            }, function (error) {
                console.log(error);
            })
        }

        $scope.doRefresh = function () {
            var limit = 0;
            var params = { productID: productID, limit: limit };
            loadProduct(params, function (products) {
                $scope.products = products;
                //Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');
            })
        };

        $scope.loadMore = function () {
            console.log('Total Product Loaded', $scope.products.length, 'Total Product in Categories', $scope.totalProduct);
            if ($scope.products.length >= $scope.totalProduct) {
                $scope.noMoreItemsAvailable = true;
                $scope.$broadcast('scroll.infiniteScrollComplete');
                return;
            }

            $timeout(function () {
                var params = { productID: productID, limit: limit };
                loadProduct(params, function (products) {
                    $scope.products = $scope.products.concat(products);
                    //load next 8 product
                    limit += 8;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                })
            }, 1000);
        }
    })

    // PRODUCT LIST ALL CONTROLLER
    .controller('ProductlistAllCtrl', function ($scope, $stateParams, $filter, ProductCategoryListService, $timeout) {
        $scope.products = [];
        var limit = 0;
        $scope.id_parent = $stateParams.categoryId;
        $scope.currentCategory = ($filter('filter')($scope.categories.categories, { id: $scope.id_parent }));

        if ($scope.currentCategory) {
            $scope.totalProduct = $scope.currentCategory[0].nb_total_products;
        }

        // Load products from category
        var productID = '';
        console.log($scope.currentCategory);
        angular.forEach($scope.currentCategory[0].associations.products, function (value, key) {
            if (key == 0) { productID = value.id; return; }
            productID = productID + "|" + value.id;
        });
        console.log('Load product ids', productID);
        console.log('limit', limit);

        function loadProduct(params, callback) {
            ProductCategoryListService.get(params).$promise.then(function (data) {
                var products = [];
                products = data.products;
                callback(products);
            })
        }

        $scope.doRefresh = function () {
            var limit = 0;
            var params = { productID: productID, limit: limit };
            loadProduct(params, function (products) {
                $scope.products = products;
                //Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');
            })
        };

        $scope.loadMore = function () {
            console.log('Total Product Loaded', $scope.products.length, 'Total Product in Categories', $scope.totalProduct);
            if ($scope.products.length >= $scope.totalProduct) {
                $scope.noMoreItemsAvailable = true;
                $scope.$broadcast('scroll.infiniteScrollComplete');
                return;
            }

            $timeout(function () {
                var params = { productID: productID, limit: limit };
                loadProduct(params, function (products) {
                    $scope.products = $scope.products.concat(products);
                    //load next 8 product
                    limit += 8;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                })

            }, 1000);
        }
    })