(function () {
    'use strict';

    angular
        .module('app')
        .factory('accountService', accountService);

    accountService.$inject = ['$http', 'ngAuthSettings'];

    function accountService($http, ngAuthSettings) {

        var serviceBase = ngAuthSettings.apiServiceBaseUri;
        var resourceServiceFactory = {};

        // GET /api/controller
        var _getAllAccount = function (resoureUri) {
            return $http.get(serviceBase + resoureUri)
                .then(function (results) {
                    return results;
                });
        };

        // GET /api/controller/atplerry
        var _getAccountByUsername = function (resoureUri, username) {

            return $http.get(serviceBase + resoureUri + '/' + username)
                .then(function (results) {
                    return results;
                });
        };

        // GET /api/controller/5
        var _getAccountById = function (resoureUri, entity) {
            return $http.get(serviceBase + resoureUri + '/' + entity.id)
                .then(function (results) {

                    _paycheck.employeeId = "1234";
                    return results;
                });
        };

        // POST /api/controller
        var _saveAccount = function (resoureUri, entity) {

            return $http.post(serviceBase + resoureUri, entity)
                .then(function (results) {
                    return results;
                });
        };

        // PUT /api/controller/
        var _updateAccount = function (resoureUri, entity) {
            return $http.put(serviceBase + resoureUri + '/' + entity.id, entity)
				.then(function (response) {
				    return response;
				});
        };

        // DELETE /api/controller/5
        var _deleteAccount = function (resoureUri, entity, entityId) {
            return $http.delete(serviceBase + resoureUri + '/' + entityId, entity)
				.then(function (response) {
				    return response;
				});
        };

        resourceServiceFactory.getAllAccount = _getAllAccount;
        resourceServiceFactory.getAccountById = _getAccountById;
        resourceServiceFactory.getAccountByUsername = _getAccountByUsername;
        resourceServiceFactory.saveAccount = _saveAccount;
        resourceServiceFactory.updateAccount = _updateAccount;
        resourceServiceFactory.deleteAccount = _deleteAccount;

        return resourceServiceFactory;

    }
})();