(function () {
    'use strict';
    var serviceId = 'authService';
    angular
        .module('app')
        .factory('authService', authService);

    authService.$inject = ['$http', '$q', 'localStorageService', 'ngAuthSettings'];

    function authService($http, $q, localStorageService, ngAuthSettings) {

        var serviceBase = ngAuthSettings.apiServiceBaseUri;
    	var authServiceFactory = {};

    	var _authentication = {
    	    clientId: "",
    		isAuth: false,
    		userName: "",
    		page: "",
    		roles: "",
            fullName: ""
    	};

        // GET /api/controller
    	var _getAllResource = function (resoureUri) {
    	    return $http.get(serviceBase + resoureUri)
                .then(function (results) {
                    return results;
                });
    	};

        // GET /api/controller/5
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
    	    return $http.put(serviceBase + resoureUri + '/' + entityId, entity)
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

        /////////////////////
        // Auth Server Region
    	var _saveRegistration = function (registration) {
    		return $http.post(serviceBase + 'api/accounts/create', registration)
				.then(function (response) {
					return response;
				});
    	};

    	var _saveUserRegistration = function (registration) {
    	    return $http.post(serviceBase + 'api/accounts/create', registration)
				.then(function (response) {
				    return response;
				});
    	};

    	var _saveUserAccountType = function (entity) {
    	    return $http.post(serviceBase + 'api/accounts/accounttype/create', entity)
				.then(function (response) {
				    return response;
				});
    	};

    	var _login = function (loginData) {

    	    var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;
    	    data = data + "&client_id=" + ngAuthSettings.clientId;

    		var deferred = $q.defer();
    		$http.post(serviceBase + 'oauth/token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
				.success(function (response) {
				    var pageRoles = JSON.parse(response.roles);
				    var supRoles = [];

				    // buildup roles access
				    var found = false;
				    for (var i = 0; i < pageRoles.length && !found; i++) {
				        if (pageRoles[i] === "Supervisor") {
				            found = true;
				            break;
				        }
				    }

				    if (found) {
				        angular.forEach(pageRoles, function (role) {
				            if (role !== "Supervisor") {				            
				                var supervisorRole = JSON.parse(JSON.stringify(role + " Supervisor"));
				                //supRoles.push(role);
				                supRoles.push(supervisorRole);
				            }
				            //supRoles.push(role);
				        });
				        var newPageRole = pageRoles[1];

				    } else {
				        angular.forEach(pageRoles, function (role) {				          
				            supRoles.push(role);
				        });

				        var newPageRole = pageRoles[0];
				    }
				    
				    localStorageService.set('authorizationData',
                        {
                            clientId: ngAuthSettings.clientId,
                            token: response.access_token,
                            userName: loginData.userName,
                            roles: supRoles, //response.roles,
                            page: newPageRole, //pageRoles[0],
                            fullName: response.fullName
                        });

					_authentication.isAuth = true;
					_authentication.userName = loginData.userName;
					_authentication.clientId = ngAuthSettings.clientId;
					_authentication.page = pageRoles[0];
					_authentication.roles = supRoles; //response.roles;
					_authentication.fullName = response.fullName;

					deferred.resolve(response);

				}).error(function (err, status) {
					_logOut();
					deferred.reject(err);
				});

    		return deferred.promise;
    	};

    	var _logOut = function () {

    		localStorageService.remove('authorizationData');

    		_authentication.isAuth = false;
    		_authentication.userName = "";
    		_authentication.page = "";
    		_authentication.roles = "";
    		_authentication.fullName = "";


    	};

    	var _fillAuthData = function () {
    	    var authData = localStorageService.get('authorizationData');
    		if (authData) {
    			_authentication.isAuth = true;
    			_authentication.userName = authData.userName;
    			_authentication.clientId = ngAuthSettings.clientId;
    			_authentication.page = authData.page;
    			_authentication.roles = authData.roles;
    			_authentication.fullName = authData.fullName;
    		}

    	}

    	authServiceFactory.saveRegistration = _saveRegistration;
    	authServiceFactory.saveUserRegistration = _saveUserRegistration;
    	authServiceFactory.saveUserAccountType = _saveUserAccountType;
    	authServiceFactory.login = _login;
    	authServiceFactory.logOut = _logOut;
    	authServiceFactory.fillAuthData = _fillAuthData;
    	authServiceFactory.authentication = _authentication;

    	authServiceFactory.getAllResource = _getAllResource;
    	authServiceFactory.getResourceByUsername = _getResourceByUsername;
    	authServiceFactory.getResourceById = _getResourceById;
    	authServiceFactory.saveResource = _saveResource;
    	authServiceFactory.updateResource = _updateResource;
    	authServiceFactory.deleteResource = _deleteResource;


    	return authServiceFactory;

    }
})();