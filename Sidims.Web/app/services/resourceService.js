(function () {
    'use strict';

    angular
        .module('app')
        .factory('resourceService', resourceService);

    resourceService.$inject = ['$http', 'ngAuthSettings'];

    function resourceService($http, ngAuthSettings) {
        
        var serviceBase = ngAuthSettings.apiResourceBaseUri;
        var resourceServiceFactory = {};

        // GET /api/controller
        var _getAllResource = function (resoureUri) {
            return $http.get(serviceBase + resoureUri)
                .then(function (results) {
                    return results;
                });
        };

        // GET /api/controller/atplerry
        var _getResourceByUsername = function (resoureUri, username) {
            return $http.get(serviceBase + resoureUri + '/' + username)
                .then(function (results) {
                    return results;
                });
        };

        // GET /api/controller/5
        var _getResourceById = function (resoureUri, entity) {
            return $http.get(serviceBase + resoureUri + '/' + entity.id)
                .then(function (results) {
                    return results;
                });
        };

        // POST /api/controller
        var _saveResource = function (resoureUri, entity) {
            return $http.post(serviceBase + resoureUri, entity)
                .then(function (results) {
                    return results;
                });
        };

        // PUT /api/controller/
        var _updateResource = function (resoureUri, entity) {
            return $http.put(serviceBase + resoureUri + '/' + entity.id, entity)
				.then(function (response) {
				    return response;
				});
        };

        // PUT /api/controller/
        var _updateResourcePartial = function (resoureUri, entity) {
            return $http.put(serviceBase + resoureUri, entity)
				.then(function (response) {
				    return response;
				});
        };

        // DELETE /api/controller/5
        var _deleteResource = function (resoureUri, entity, entityId) {
            return $http.delete(serviceBase + resoureUri + '/' + entityId, entity)
				.then(function (response) {
				    return response;
				});
        };

        resourceServiceFactory.getAllResource = _getAllResource;
        resourceServiceFactory.getResourceById = _getResourceById;
        resourceServiceFactory.getResourceByUsername = _getResourceByUsername;
        resourceServiceFactory.saveResource = _saveResource;
        resourceServiceFactory.updateResource = _updateResource;
        resourceServiceFactory.updateResourcePartial = _updateResourcePartial;
        resourceServiceFactory.deleteResource = _deleteResource;

        return resourceServiceFactory;
    }
})();