angular.module('starter')

  .factory('ProductListService', function ($resource, ApiEndpoint, GlobalService) {
    return $resource(ApiEndpoint.url + '/products',
      { output_format: 'JSON', ws_key: ApiEndpoint.ws_key, language: GlobalService.id_lang, 'filter[active]': '1' },
      {
        getProduct: { method: 'GET' }
      });
  })

  .factory('CategoryListService', function ($resource, ApiEndpoint, GlobalService) {
    var data = $resource(ApiEndpoint.url + '/categories&display=full&filter[active]=[1]', { output_format: 'JSON', ws_key: ApiEndpoint.ws_key, language: GlobalService.id_lang });
    return data;

  })


  .factory('ProductCategoryListService', function ($resource, ApiEndpoint, GlobalService) {
    var data = $resource(ApiEndpoint.url + '/products&display=full&filter[active]=[1]&limit=:limit,8&filter[id]=[:productID]', { output_format: 'JSON', ws_key: ApiEndpoint.ws_key, id: '@productID', limit: '@limit', language: GlobalService.id_lang });
    return data;

  })

  .factory('ProductService', function ($resource, ApiEndpoint, GlobalService) {
    var data = $resource(ApiEndpoint.url + '/products/:productid', { productid: '@productid', output_format: 'JSON', ws_key: ApiEndpoint.ws_key, language: GlobalService.id_lang });
    return data;
  })

  .factory('ProductFeatureService', function ($resource, ApiEndpoint, GlobalService) {
    var ProductFeatureName = []
    var getProductFeature = function () {
      var data = $resource(ApiEndpoint.url + '/product_features/', { output_format: 'JSON', ws_key: ApiEndpoint.ws_key, language: GlobalService.id_lang, display: 'full' });
      data.get().$promise.then(function (data) {
        var ProductFeature = data;
        storeProductFeature(ProductFeature);
      })
    }

    function loadProductFeature() {
      var ProductFeature = angular.fromJson(window.localStorage['ProductFeature']);
      if (!ProductFeature) {
        getProductFeature();
      }
      if (ProductFeature) {
        useProductFeature(ProductFeature);
      }
    }

    function storeProductFeature(ProductFeature) {
      window.localStorage['ProductFeature'] = JSON.stringify(ProductFeature);
      useProductFeature(ProductFeature);
    }

    function useProductFeature(ProductFeature) {
      ProductFeatureName = ProductFeature;
    }

    function destroyProductFeature() {
      window.localStorage.removeItem('ProductFeature');
    }
    return {
      getProductFeature: function () {
        loadProductFeature();
        return ProductFeatureName;
      }
    }

  })
  .factory('ProductFeatureValueService', function ($resource, ApiEndpoint, GlobalService) {
    var data = $resource(ApiEndpoint.url + '/product_feature_values&filter[id]=[:product_feature_valuesId]', { product_feature_valuesId: '@product_feature_valuesId', output_format: 'JSON', ws_key: ApiEndpoint.ws_key, display: 'full', language: GlobalService.id_lang });
    return data;

  })

  .factory('ProductStockAvailableService', function ($resource, ApiEndpoint) {
    return {
      getStock: function () {
        return $resource(ApiEndpoint.url + '/stock_availables', { ws_key: ApiEndpoint.ws_key, output_format: 'JSON', display: '[id_product,id_product_attribute,quantity]' })
      }
    }
  })

  .factory('SearchService', function ($resource, ApiEndpoint, GlobalService) {
    var data = $resource(ApiEndpoint.url + '/search?query=:query&display=full&limit=:limit,5', { query: '@query', limit: '@limit', output_format: 'JSON', ws_key: ApiEndpoint.ws_key, language: GlobalService.id_lang });
    return data;

  })

  .factory('TaxRuleService', function ($resource, ApiEndpoint, GlobalService) {
    var taxrule = [];
    getTaxes();
    function getTaxes() {
      var data = $resource(ApiEndpoint.url + '/taxes', { output_format: 'JSON', ws_key: ApiEndpoint.ws_key, language: GlobalService.id_lang, display: 'full' });
      data.get().$promise.then(function (data) {
        taxrule = data.taxes;
        console.log(taxrule);
      });
    }
    return {
      getTaxRate: function (id_tax_rules_group) {
        for (var i = 0; i < taxrule.length; i++) {
          if (taxrule[i].id == id_tax_rules_group) {
            return taxrule[i].rate;
          }
        }

      }
    }
  });