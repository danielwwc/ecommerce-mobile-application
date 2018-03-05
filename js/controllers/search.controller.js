angular.module('starter')
    // SEARCH CONTROLLER
    .controller('SearchCtrl', function ($scope, $state, $stateParams, $filter, SearchService, $timeout, $sce, $cordovaBarcodeScanner) {
        var limit = 0;
        $scope.products = [];
        $scope.query = { products: '' };

        var doSearch = ionic.debounce(function (query) {
            limit += 5;
            if (query.length >= 3) {
                SearchService.get({ query: query, limit: limit }).$promise.then(function (data) {
                    $scope.products = data.products;
                    console.log($scope.products);
                })
            };
        }, 500);

        $scope.goProduct = function (productId) {
            $state.go('app.search-product', {
                productId: productId
            });
        }
        $scope.search = function () {
            doSearch($scope.query.products);
        }

        //highight search result text
        $scope.highlight = function (haystack, needle) {
            if (!needle) {
                return $sce.trustAsHtml(haystack);
            }
            return $sce.trustAsHtml(haystack.replace(new RegExp(needle, "gi"), function (match) {
                return '<span class="highlighted">' + match + '</span>';
            }));
        };

        $scope.clearSearch = function () {
            $scope.query.products = '';
        };

        $scope.scanBarcode = function () {
            $cordovaBarcodeScanner.scan().then(function (imageData) {
                $scope.query = { products: imageData.text };
                doSearch($scope.query.products);
                console.log("Barcode Format -> " + imageData.format);
                console.log("Cancelled -> " + imageData.cancelled);
            }, function (error) {
                console.log("Scan Failed: " + error);
            });
        };
    })